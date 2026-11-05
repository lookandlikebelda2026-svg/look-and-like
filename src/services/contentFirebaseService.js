import { db } from './firebase.js';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const DOC_LOOKBOOK = 'lookbook';
const DOC_PARTNERS = 'partners';
const DOC_VIDEOS = 'videos';

/**
 * Fetch Lookbook (inspired images) from Firestore
 */
export async function getLookbookFromFirebase() {
  try {
    const docRef = doc(db, 'site_content', DOC_LOOKBOOK);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }
    return [];
  } catch (err) {
    console.warn('Firestore lookbook fetch warning:', err.message);
    return [];
  }
}

/**
 * Save Lookbook (inspired images) to Firestore
 */
export async function saveLookbookToFirebase(items) {
  try {
    const clean = Array.isArray(items) ? items : [];
    const docRef = doc(db, 'site_content', DOC_LOOKBOOK);
    await setDoc(docRef, { items: clean, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Firestore lookbook save error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Real-time subscription to Lookbook from Firestore
 */
export function subscribeToLookbook(onUpdate, onError) {
  const docRef = doc(db, 'site_content', DOC_LOOKBOOK);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate(Array.isArray(data.items) ? data.items : []);
      } else {
        onUpdate([]);
      }
    },
    (err) => {
      console.warn('Real-time lookbook subscription warning:', err.message);
      onError?.(err);
    }
  );
}

/**
 * Fetch Brand Partners from Firestore
 */
export async function getPartnersFromFirebase() {
  try {
    const docRef = doc(db, 'site_content', DOC_PARTNERS);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }
    return [];
  } catch (err) {
    console.warn('Firestore partners fetch warning:', err.message);
    return [];
  }
}

/**
 * Save Brand Partners to Firestore
 */
export async function savePartnersToFirebase(items) {
  try {
    const clean = Array.isArray(items) ? items : [];
    const docRef = doc(db, 'site_content', DOC_PARTNERS);
    await setDoc(docRef, { items: clean, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Firestore partners save error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Real-time subscription to Brand Partners from Firestore
 */
export function subscribeToPartners(onUpdate, onError) {
  const docRef = doc(db, 'site_content', DOC_PARTNERS);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate(Array.isArray(data.items) ? data.items : []);
      } else {
        onUpdate([]);
      }
    },
    (err) => {
      console.warn('Real-time partners subscription warning:', err.message);
      onError?.(err);
    }
  );
}

/**
 * Fetch YouTube Videos from Firestore
 */
export async function getVideosFromFirebase() {
  try {
    const docRef = doc(db, 'site_content', DOC_VIDEOS);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }
    return [];
  } catch (err) {
    console.warn('Firestore videos fetch warning:', err.message);
    return [];
  }
}

/**
 * Save YouTube Videos to Firestore
 */
export async function saveVideosToFirebase(items) {
  try {
    const clean = Array.isArray(items) ? items : [];
    const docRef = doc(db, 'site_content', DOC_VIDEOS);
    await setDoc(docRef, { items: clean, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Firestore videos save error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Real-time subscription to YouTube Videos from Firestore
 */
export function subscribeToVideos(onUpdate, onError) {
  const docRef = doc(db, 'site_content', DOC_VIDEOS);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate(Array.isArray(data.items) ? data.items : []);
      } else {
        onUpdate([]);
      }
    },
    (err) => {
      console.warn('Real-time videos subscription warning:', err.message);
      onError?.(err);
    }
  );
}
