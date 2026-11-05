import { db } from './firebase.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { normalizeService } from '../constants/services.js';

const SERVICES_COLLECTION = 'services';
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

let cachedServices = null;
let lastCacheTime = 0;

/**
 * Fetch all services from Firebase Firestore with intelligent in-memory caching.
 * Only returns real services added by the admin; returns empty array if none exist.
 */
export async function getServicesFromFirebase(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedServices && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedServices;
  }

  try {
    const q = query(collection(db, SERVICES_COLLECTION), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      cachedServices = [];
      lastCacheTime = now;
      return [];
    }

    const services = [];
    querySnapshot.forEach((docSnap) => {
      const normalized = normalizeService({ id: docSnap.id, ...docSnap.data() });
      if (normalized) services.push(normalized);
    });

    cachedServices = services;
    lastCacheTime = now;
    return services;
  } catch (error) {
    console.warn('Firestore service read failed:', error.message);
    if (cachedServices && cachedServices.length > 0) {
      return cachedServices;
    }
    return [];
  }
}

/**
 * Fetch a single service by ID from Firestore or cache
 */
export async function getServiceByIdFromFirebase(serviceId) {
  if (!serviceId) return null;

  // Check cache first
  if (cachedServices) {
    const found = cachedServices.find((s) => s.id === serviceId);
    if (found) return found;
  }

  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return normalizeService({ id: docSnap.id, ...docSnap.data() });
    }
    return null;
  } catch (error) {
    console.warn('Error fetching service by ID from Firestore:', error.message);
    return null;
  }
}

/**
 * Save or update a service in Firebase Firestore adhering to the Service data model
 */
export async function saveServiceToFirebase(serviceData) {
  const normalized = normalizeService(serviceData);
  if (!normalized) {
    throw new Error('Invalid service data structure provided.');
  }

  try {
    const docRef = doc(db, SERVICES_COLLECTION, normalized.id);
    const existingSnap = await getDoc(docRef);
    const isNew = !existingSnap.exists();

    const payload = {
      ...normalized,
      updatedAt: new Date().toISOString(),
      ...(isNew ? { createdAt: new Date().toISOString() } : {}),
    };

    await setDoc(docRef, payload, { merge: true });

    // Invalidate local in-memory cache
    if (cachedServices) {
      const existingIdx = cachedServices.findIndex((s) => s.id === normalized.id);
      if (existingIdx !== -1) {
        cachedServices[existingIdx] = payload;
      } else {
        cachedServices.push(payload);
      }
    }

    return { success: true, service: payload };
  } catch (error) {
    console.error('Error saving service to Firebase:', error);
    throw error;
  }
}

/**
 * Delete a service from Firebase Firestore
 */
export async function deleteServiceFromFirebase(serviceId) {
  if (!serviceId) return { success: false, error: 'No serviceId provided' };

  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    await deleteDoc(docRef);

    // Update in-memory cache
    if (cachedServices) {
      cachedServices = cachedServices.filter((s) => s.id !== serviceId);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting service from Firebase:', error);
    if (cachedServices) {
      cachedServices = cachedServices.filter((s) => s.id !== serviceId);
    }
    return { success: false, error: error.message };
  }
}

/**
 * Real-time subscription to Services from Firestore
 */
export function subscribeToServices(onUpdate, onError) {
  try {
    const q = query(collection(db, SERVICES_COLLECTION), orderBy('createdAt', 'asc'));
    return onSnapshot(
      q,
      (querySnapshot) => {
        const services = [];
        querySnapshot.forEach((docSnap) => {
          const normalized = normalizeService({ id: docSnap.id, ...docSnap.data() });
          if (normalized) services.push(normalized);
        });
        cachedServices = services;
        lastCacheTime = Date.now();
        onUpdate(services);
      },
      (err) => {
        console.warn('Real-time services subscription warning:', err.message);
        onError?.(err);
      }
    );
  } catch (err) {
    console.warn('Failed to initialize services subscription:', err.message);
    onError?.(err);
    return () => {};
  }
}

/**
 * Synchronize full list of services with Firestore:
 * Writes updated services and deletes removed services.
 */
export async function syncAllServicesToFirebase(servicesList) {
  try {
    const cleanList = Array.isArray(servicesList)
      ? servicesList.map((s, idx) => normalizeService(s, idx)).filter(Boolean)
      : [];

    const existingSnap = await getDocs(collection(db, SERVICES_COLLECTION));
    const keepIds = new Set(cleanList.map((s) => s.id));

    // Delete any documents that are no longer present in cleanList
    const deletePromises = [];
    existingSnap.forEach((docSnap) => {
      if (!keepIds.has(docSnap.id)) {
        deletePromises.push(deleteDoc(docSnap.ref));
      }
    });
    await Promise.all(deletePromises);

    // Save/update each service in cleanList
    const savePromises = cleanList.map((svc) => {
      const docRef = doc(db, SERVICES_COLLECTION, svc.id);
      return setDoc(
        docRef,
        {
          ...svc,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });
    await Promise.all(savePromises);

    cachedServices = cleanList;
    lastCacheTime = Date.now();
    return { success: true };
  } catch (err) {
    console.error('Failed to sync all services to Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Clear all services from Firestore
 */
export async function clearAllServicesFromFirebase() {
  try {
    const existingSnap = await getDocs(collection(db, SERVICES_COLLECTION));
    const deletePromises = [];
    existingSnap.forEach((docSnap) => {
      deletePromises.push(deleteDoc(docSnap.ref));
    });
    await Promise.all(deletePromises);
    cachedServices = [];
    lastCacheTime = Date.now();
    return { success: true };
  } catch (err) {
    console.error('Failed to clear services from Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Price Verification Helper
 * Verifies the selected subplan price against the stored service data.
 */
export function verifySubplanPrice(servicesList, serviceId, planId, subplanId) {
  const list = Array.isArray(servicesList) ? servicesList : cachedServices || [];
  const service = list.find((s) => s.id === serviceId);
  if (!service) return null;

  const plan = (service.plans || []).find((p) => p.id === planId);
  if (!plan) return null;

  const subplan = (plan.subplans || []).find((sub) => sub.id === subplanId);
  if (!subplan) return null;

  return {
    verified: true,
    serviceId: service.id,
    serviceName: service.name,
    planId: plan.id,
    planName: plan.name,
    subplanId: subplan.id,
    subplanName: subplan.name,
    price: Number(subplan.price) || 0,
  };
}

export default {
  getServicesFromFirebase,
  getServiceByIdFromFirebase,
  saveServiceToFirebase,
  deleteServiceFromFirebase,
  subscribeToServices,
  syncAllServicesToFirebase,
  clearAllServicesFromFirebase,
  verifySubplanPrice,
};
