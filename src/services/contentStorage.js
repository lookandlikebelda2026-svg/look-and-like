import { useState, useEffect } from 'react';
import { GET_INSPIRED_IMAGES } from '../constants/inspiration';
import { PARTNERS } from '../constants/partners';
import { COLLECTION_VIDEOS } from '../constants/videos';
import { DEFAULT_SERVICES_DATA, normalizeService } from '../constants/services';
import {
  getServicesFromFirebase,
  saveServiceToFirebase,
  deleteServiceFromFirebase,
} from './serviceFirebaseService';

const STORAGE_KEY_INSPIRED = 'look_and_like_inspired_images_v2';
const STORAGE_KEY_PARTNERS = 'look_and_like_partners_v2';
const STORAGE_KEY_VIDEOS = 'look_and_like_videos_v2';
const STORAGE_KEY_SERVICES = 'look_and_like_services_v2';
const EVENT_NAME = 'look_and_like_content_changed';

/**
 * Clean up legacy v1 storage keys
 */
function cleanupLegacyKeys() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('look_and_like_inspired_images_v1');
    localStorage.removeItem('look_and_like_partners_v1');
    localStorage.removeItem('look_and_like_videos_v1');
    localStorage.removeItem('look_and_like_services_v1');
  } catch (e) {
    // ignore
  }
}

/**
 * Get stored or empty Get Inspired Images
 */
export function getStoredInspiredImages() {
  if (typeof window === 'undefined') return [];
  cleanupLegacyKeys();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSPIRED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse stored inspired images:', err);
    return [];
  }
}

/**
 * Save Get Inspired Images to localStorage and notify listeners
 */
export function saveStoredInspiredImages(images) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(images) ? images : [];
    localStorage.setItem(STORAGE_KEY_INSPIRED, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: list } }));
  } catch (err) {
    console.error('Failed to save inspired images to localStorage:', err);
  }
}

/**
 * Reset / Clear Get Inspired Images
 */
export function resetStoredInspiredImages() {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.removeItem(STORAGE_KEY_INSPIRED);
    localStorage.removeItem('look_and_like_inspired_images_v1');
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: [] } }));
    return [];
  } catch (err) {
    console.error('Failed to reset inspired images:', err);
    return [];
  }
}

/**
 * Get stored or empty Partners
 */
export function getStoredPartners() {
  if (typeof window === 'undefined') return [];
  cleanupLegacyKeys();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse stored partners:', err);
    return [];
  }
}

/**
 * Save Partners to localStorage and notify listeners
 */
export function saveStoredPartners(partners) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(partners) ? partners : [];
    localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: list } }));
  } catch (err) {
    console.error('Failed to save partners to localStorage:', err);
  }
}

/**
 * Reset / Clear Partners
 */
export function resetStoredPartners() {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.removeItem(STORAGE_KEY_PARTNERS);
    localStorage.removeItem('look_and_like_partners_v1');
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: [] } }));
    return [];
  } catch (err) {
    console.error('Failed to reset partners:', err);
    return [];
  }
}

/**
 * Get stored or empty Videos
 */
export function getStoredVideos() {
  if (typeof window === 'undefined') return [];
  cleanupLegacyKeys();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse stored videos:', err);
    return [];
  }
}

/**
 * Save Videos to localStorage and notify listeners
 */
export function saveStoredVideos(videos) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(videos) ? videos : [];
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: list } }));
  } catch (err) {
    console.error('Failed to save videos to localStorage:', err);
  }
}

/**
 * Reset / Clear Videos
 */
export function resetStoredVideos() {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem('look_and_like_videos_v1');
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: [] } }));
    return [];
  } catch (err) {
    console.error('Failed to reset videos:', err);
    return [];
  }
}

/**
 * Get stored Salon Services & Price Plans.
 * Defaults to DEFAULT_SERVICES_DATA matching the atelier service design.
 */
export function getStoredServicesData() {
  if (typeof window === 'undefined') return DEFAULT_SERVICES_DATA;
  cleanupLegacyKeys();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(DEFAULT_SERVICES_DATA));
      return DEFAULT_SERVICES_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s, idx) => normalizeService(s, idx));
    }
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(DEFAULT_SERVICES_DATA));
    return DEFAULT_SERVICES_DATA;
  } catch (err) {
    console.warn('Failed to parse stored services:', err);
    return DEFAULT_SERVICES_DATA;
  }
}

/**
 * Save Salon Services to localStorage, sync to Firestore, and notify listeners
 */
export function saveStoredServicesData(servicesData) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(servicesData)
      ? servicesData.map((s, idx) => normalizeService(s, idx)).filter(Boolean)
      : [];
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: list } }));

    // Asynchronously synchronize with Firestore
    list.forEach((svc) => {
      saveServiceToFirebase(svc).catch((err) => {
        console.warn('Background sync to Firestore failed:', err.message);
      });
    });
  } catch (err) {
    console.error('Failed to save services to localStorage:', err);
  }
}

/**
 * Reset / Clear all Salon Services
 */
export function resetStoredServicesData() {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem('look_and_like_services_v1');
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: [] } }));
    return [];
  } catch (err) {
    console.error('Failed to reset services:', err);
    return [];
  }
}

/**
 * Reactive React hook for components consuming or managing live content
 */
export function useContentStorage() {
  const [inspiredImages, setInspiredImages] = useState(getStoredInspiredImages);
  const [partners, setPartners] = useState(getStoredPartners);
  const [videos, setVideos] = useState(getStoredVideos);
  const [servicesData, setServicesData] = useState(getStoredServicesData);

  useEffect(() => {
    // Background sync with Firestore without blocking immediate UI rendering
    getServicesFromFirebase()
      .then((remoteServices) => {
        if (Array.isArray(remoteServices) && remoteServices.length > 0) {
          setServicesData(remoteServices);
          try {
            localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(remoteServices));
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.warn('Initial Firestore services background sync:', err.message);
      });

    const handleUpdate = () => {
      setInspiredImages(getStoredInspiredImages());
      setPartners(getStoredPartners());
      setVideos(getStoredVideos());
      setServicesData(getStoredServicesData());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    inspiredImages,
    partners,
    videos,
    servicesData,
    saveInspiredImages: (imgs) => {
      saveStoredInspiredImages(imgs);
      setInspiredImages(imgs);
    },
    resetInspiredImages: () => {
      const def = resetStoredInspiredImages();
      setInspiredImages(def);
    },
    savePartners: (pts) => {
      saveStoredPartners(pts);
      setPartners(pts);
    },
    resetPartners: () => {
      const def = resetStoredPartners();
      setPartners(def);
    },
    saveVideos: (vids) => {
      saveStoredVideos(vids);
      setVideos(vids);
    },
    resetVideos: () => {
      const def = resetStoredVideos();
      setVideos(def);
    },
    saveServicesData: (data) => {
      saveStoredServicesData(data);
      setServicesData(data);
    },
    resetServicesData: () => {
      const def = resetStoredServicesData();
      setServicesData(def);
    }
  };
}

export default useContentStorage;
