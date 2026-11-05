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
} from 'firebase/firestore';
import { DEFAULT_SERVICES_DATA, normalizeService } from '../constants/services.js';

const SERVICES_COLLECTION = 'services';
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes in-memory cache

let cachedServices = null;
let lastCacheTime = 0;

/**
 * Fetch all services from Firebase Firestore with intelligent in-memory caching.
 * Prevents redundant read queries during client navigation.
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
      // If collection is empty in Firestore, return cached or defaults
      if (!cachedServices || cachedServices.length === 0) {
        cachedServices = DEFAULT_SERVICES_DATA.map((s, idx) => normalizeService(s, idx));
        lastCacheTime = now;
      }
      return cachedServices;
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
    console.warn('Firestore service read failed (falling back to local cache):', error.message);
    if (cachedServices && cachedServices.length > 0) {
      return cachedServices;
    }
    return DEFAULT_SERVICES_DATA.map((s, idx) => normalizeService(s, idx));
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
    return DEFAULT_SERVICES_DATA.find((s) => s.id === serviceId) || null;
  }
}

/**
 * Save or update a service in Firebase Firestore adhering to the new Service data model
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
      id: normalized.id,
      name: normalized.name,
      description: normalized.description,
      images: normalized.images || [],
      startingPrice: Number(normalized.startingPrice) || 0,
      plans: (normalized.plans || []).map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        images: plan.images || [],
        startingPrice: Number(plan.startingPrice) || 0,
        subplans: (plan.subplans || []).map((sub) => ({
          id: sub.id,
          name: sub.name,
          price: Number(sub.price) || 0,
        })),
      })),
      updatedAt: serverTimestamp(),
    };

    if (isNew) {
      payload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, payload, { merge: true });

    // Update in-memory cache
    if (cachedServices) {
      const idx = cachedServices.findIndex((s) => s.id === normalized.id);
      if (idx !== -1) {
        cachedServices[idx] = normalized;
      } else {
        cachedServices.push(normalized);
      }
    } else {
      cachedServices = [normalized];
    }
    lastCacheTime = Date.now();

    return { success: true, service: normalized };
  } catch (error) {
    console.error('Error saving service to Firebase:', error);
    // Still update local cache so admin changes persist in current session
    if (cachedServices) {
      const idx = cachedServices.findIndex((s) => s.id === normalized.id);
      if (idx !== -1) cachedServices[idx] = normalized;
      else cachedServices.push(normalized);
    }
    return { success: false, error: error.message, service: normalized };
  }
}

/**
 * Delete a service from Firestore
 */
export async function deleteServiceFromFirebase(serviceId) {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    await deleteDoc(docRef);

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
 * Price Verification Helper (Rule 4: Never trust client-submitted purchase prices)
 * Verifies the selected subplan price against the stored service data.
 */
export function verifySubplanPrice(servicesList, serviceId, planId, subplanId) {
  const list = Array.isArray(servicesList) ? servicesList : cachedServices || DEFAULT_SERVICES_DATA;
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

