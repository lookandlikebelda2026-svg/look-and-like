import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase.js';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const FIRESTORE_DOC = 'banner_media';

// Clean up any legacy localStorage entries
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('look_and_like_banner_media_v1');
    localStorage.removeItem('look_and_like_banner_media_v2');
  } catch (e) {
    // ignore
  }
}

/**
 * Fetch hero banner and about photos directly from Firebase Firestore
 */
export async function getBannerMediaFromFirebase() {
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        heroBannerUrl: data.heroBannerUrl || '',
        aboutPhotos: Array.isArray(data.aboutPhotos) ? data.aboutPhotos : [],
      };
    }
  } catch (err) {
    console.warn('Error fetching banner media from Firestore:', err.message);
  }

  return {
    heroBannerUrl: '',
    aboutPhotos: [],
  };
}

/**
 * Save hero banner and about photos directly to Firebase Firestore
 */
export async function saveBannerMediaToFirebase(media) {
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC);
    const payload = {
      heroBannerUrl: media.heroBannerUrl || '',
      aboutPhotos: Array.isArray(media.aboutPhotos) ? media.aboutPhotos : [],
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('Firestore banner media save error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Real-time listener for hero banner and about photos from Firebase Firestore
 */
export function subscribeToBannerMedia(onUpdate, onError) {
  try {
    const docRef = doc(db, 'site_content', FIRESTORE_DOC);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          onUpdate({
            heroBannerUrl: data.heroBannerUrl || '',
            aboutPhotos: Array.isArray(data.aboutPhotos) ? data.aboutPhotos : [],
          });
        } else {
          onUpdate({
            heroBannerUrl: '',
            aboutPhotos: [],
          });
        }
      },
      (err) => {
        console.warn('Firestore real-time banner subscription error:', err.message);
        onError?.(err);
      }
    );
  } catch (e) {
    console.warn('Failed to listen to banner media from Firestore:', e);
    return () => {};
  }
}

// In-memory cache across hook instances
const bannerCache = {
  heroBannerUrl: '',
  aboutPhotos: [],
  synced: false,
};

/**
 * Custom React Hook that loads and syncs hero and about images directly from Firebase
 */
export function useBannerMedia() {
  const [media, setMedia] = useState({
    heroBannerUrl: bannerCache.heroBannerUrl,
    aboutPhotos: bannerCache.aboutPhotos,
  });
  const [loading, setLoading] = useState(!bannerCache.synced);

  useEffect(() => {
    // Listen directly to Firebase Firestore in real-time
    const unsubscribe = subscribeToBannerMedia((updated) => {
      bannerCache.heroBannerUrl = updated.heroBannerUrl;
      bannerCache.aboutPhotos = updated.aboutPhotos;
      bannerCache.synced = true;
      setMedia(updated);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const saveHeroBanner = useCallback(
    async (imageUrl) => {
      setMedia((prev) => ({ ...prev, heroBannerUrl: imageUrl }));
      return await saveBannerMediaToFirebase({ ...media, heroBannerUrl: imageUrl });
    },
    [media]
  );

  const saveAboutPhotos = useCallback(
    async (photos) => {
      setMedia((prev) => ({ ...prev, aboutPhotos: photos }));
      return await saveBannerMediaToFirebase({ ...media, aboutPhotos: photos });
    },
    [media]
  );

  return {
    heroBannerUrl: media.heroBannerUrl,
    aboutPhotos: media.aboutPhotos,
    loading,
    saveHeroBanner,
    saveAboutPhotos,
  };
}
