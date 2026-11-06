import { useState, useEffect } from 'react';
import { normalizeService } from '../constants/services';
import {
  getServicesFromFirebase,
  saveServiceToFirebase,
  deleteServiceFromFirebase,
  subscribeToServices,
  syncAllServicesToFirebase,
  clearAllServicesFromFirebase,
} from './serviceFirebaseService';
import {
  getLookbookFromFirebase,
  saveLookbookToFirebase,
  subscribeToLookbook,
  getPartnersFromFirebase,
  savePartnersToFirebase,
  subscribeToPartners,
  getVideosFromFirebase,
  saveVideosToFirebase,
  subscribeToVideos,
} from './contentFirebaseService';

const STORAGE_KEY_INSPIRED = 'look_and_like_inspired_images_v4';
const STORAGE_KEY_PARTNERS = 'look_and_like_partners_v4';
const STORAGE_KEY_VIDEOS = 'look_and_like_videos_v4';
const STORAGE_KEY_SERVICES = 'look_and_like_services_v4';
const EVENT_NAME = 'look_and_like_content_changed';

// Shared in-memory cache across hook instances
const inMemoryCache = {
  services: [],
  lookbook: [],
  partners: [],
  videos: [],
  servicesSynced: false,
  lookbookSynced: false,
  partnersSynced: false,
  videosSynced: false,
  migrated: false,
};

// Known dummy titles and IDs from seed data to filter out
const DUMMY_SERVICE_NAMES = new Set([
  'skin',
  'hair',
  'nails',
  'spa',
  'skin care',
  'hair care',
  'nail care',
  'spa wellness',
  'glow facial ritual',
  'hydra facial',
  'brightening peel',
  'de-tan & clean-up',
  'signature cut & blow-dry',
  'global colour',
  'balayage & gloss',
  'keratin smoothening',
  'russian manicure',
  'gel polish overlay',
  'nail extensions & art',
  'pedicure spa luxe',
  'swedish relaxing massage',
  'deep tissue therapy',
  'aromatherapy ritual',
  'hot stone therapy',
  'head & shoulder massage',
]);

const DUMMY_PARTNER_NAMES = new Set([
  'kérastase',
  'olaplex',
  'dyson pro',
  "l'oréal",
  'dermalogica',
  'o·p·i',
  'charlotte tilbury',
  'moroccanoil',
  'wella',
  'estée lauder',
]);

const DUMMY_VIDEO_IDS = new Set([
  'atelier-walkthrough',
  'japanese-head-spa',
  'balayage-mastery',
  'hydra-glow-facial',
  'couture-bridal',
  'private-suite-tour',
  'atelier-architecture',
]);

export function isDummyService(svc) {
  if (!svc) return false;
  const name = String(svc.name || '').trim().toLowerCase();
  const id = String(svc.id || '').trim().toLowerCase();
  if (['hair', 'skin', 'nails', 'spa'].includes(id) && DUMMY_SERVICE_NAMES.has(name)) {
    return true;
  }
  if (Array.isArray(svc.plans)) {
    const hasDummyPlan = svc.plans.some((p) =>
      DUMMY_SERVICE_NAMES.has(String(p?.name || '').trim().toLowerCase())
    );
    if (hasDummyPlan) return true;
  }
  return false;
}

export function isDummyPartner(partner) {
  if (!partner) return false;
  if (partner.id && !String(partner.id).startsWith('dummy')) return false;
  const name = String(partner.name || '').trim().toLowerCase();
  return DUMMY_PARTNER_NAMES.has(name);
}

export function isDummyLookbook(look) {
  if (!look) return false;
  const id = String(look.id || '').trim();
  if (/^inspired-[1-6]$/.test(id)) return true;
  const url = String(look.imageUrl || '');
  if (
    url.includes('images.unsplash.com/photo-1610030469983') ||
    url.includes('images.unsplash.com/photo-1595777457583') ||
    url.includes('images.unsplash.com/photo-1583391733956') ||
    url.includes('images.unsplash.com/photo-1534528741775') ||
    url.includes('images.unsplash.com/photo-1617627143750') ||
    url.includes('images.unsplash.com/photo-1519741497674')
  ) {
    return true;
  }
  return false;
}

export function isDummyVideo(vid) {
  if (!vid) return false;
  const id = String(vid.id || '').trim().toLowerCase();
  return DUMMY_VIDEO_IDS.has(id);
}

/**
 * Clean up legacy storage keys
 */
export function purgeAllLegacyStorage() {
  if (typeof window === 'undefined') return;
  try {
    const oldKeys = [
      'look_and_like_inspired_images_v1',
      'look_and_like_partners_v1',
      'look_and_like_videos_v1',
      'look_and_like_services_v1',
      'look_and_like_inspired_images_v2',
      'look_and_like_partners_v2',
      'look_and_like_videos_v2',
      'look_and_like_services_v2',
      'look_and_like_inspired_images_v3',
      'look_and_like_partners_v3',
      'look_and_like_videos_v3',
      'look_and_like_services_v3',
    ];
    oldKeys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    // ignore
  }
}

// Run purge on module execution
if (typeof window !== 'undefined') {
  purgeAllLegacyStorage();
}

/**
 * Fallback memory readers for non-hook consumers
 */
export function getStoredInspiredImages() {
  return inMemoryCache.lookbook;
}

export function saveStoredInspiredImages(images) {
  const list = Array.isArray(images) ? images.filter((l) => !isDummyLookbook(l)) : [];
  inMemoryCache.lookbook = list;
  saveLookbookToFirebase(list).catch((err) => console.warn('Lookbook save warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: list } }));
  }
}

export function resetStoredInspiredImages() {
  inMemoryCache.lookbook = [];
  saveLookbookToFirebase([]).catch((err) => console.warn('Lookbook reset warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: [] } }));
  }
  return [];
}

export function getStoredPartners() {
  return inMemoryCache.partners;
}

export function saveStoredPartners(partners) {
  const list = Array.isArray(partners) ? partners.filter((p) => !isDummyPartner(p)) : [];
  inMemoryCache.partners = list;
  savePartnersToFirebase(list).catch((err) => console.warn('Partners save warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: list } }));
  }
}

export function resetStoredPartners() {
  inMemoryCache.partners = [];
  savePartnersToFirebase([]).catch((err) => console.warn('Partners reset warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: [] } }));
  }
  return [];
}

export function getStoredVideos() {
  return inMemoryCache.videos;
}

export function saveStoredVideos(videos) {
  const list = Array.isArray(videos) ? videos.filter((v) => !isDummyVideo(v)) : [];
  inMemoryCache.videos = list;
  saveVideosToFirebase(list).catch((err) => console.warn('Videos save warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: list } }));
  }
}

export function resetStoredVideos() {
  inMemoryCache.videos = [];
  saveVideosToFirebase([]).catch((err) => console.warn('Videos reset warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: [] } }));
  }
  return [];
}

export function getStoredServicesData() {
  return inMemoryCache.services;
}

export function saveStoredServicesData(servicesData) {
  const list = Array.isArray(servicesData)
    ? servicesData
        .filter((s) => !isDummyService(s))
        .map((s, idx) => normalizeService(s, idx))
        .filter(Boolean)
    : [];
  inMemoryCache.services = list;
  syncAllServicesToFirebase(list).catch((err) => console.warn('Services sync warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: list } }));
  }
}

export function resetStoredServicesData() {
  inMemoryCache.services = [];
  clearAllServicesFromFirebase().catch((err) => console.warn('Services clear warning:', err));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: [] } }));
  }
  return [];
}

/**
 * One-time migration: If this browser has legacy data in localStorage from previous admin edits,
 * push it directly to Firestore so all devices (phone, laptop, ngrok) immediately get it.
 */
async function tryAutoMigrateLegacyData() {
  if (typeof window === 'undefined') return;
  try {
    // 1. Lookbook
    const localLookbookRaw = localStorage.getItem(STORAGE_KEY_INSPIRED);
    if (localLookbookRaw) {
      const parsed = JSON.parse(localLookbookRaw);
      const cleanLocal = Array.isArray(parsed) ? parsed.filter((l) => !isDummyLookbook(l)) : [];
      if (cleanLocal.length > 0) {
        const remote = await getLookbookFromFirebase();
        if (!remote || remote.length === 0) {
          console.log('[Cross-Device Sync] Migrating local lookbook to Firestore:', cleanLocal.length);
          await saveLookbookToFirebase(cleanLocal);
        }
      }
      localStorage.removeItem(STORAGE_KEY_INSPIRED);
    }

    // 2. Partners
    const localPartnersRaw = localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (localPartnersRaw) {
      const parsed = JSON.parse(localPartnersRaw);
      const cleanLocal = Array.isArray(parsed) ? parsed.filter((p) => !isDummyPartner(p)) : [];
      if (cleanLocal.length > 0) {
        const remote = await getPartnersFromFirebase();
        if (!remote || remote.length === 0) {
          console.log('[Cross-Device Sync] Migrating local partners to Firestore:', cleanLocal.length);
          await savePartnersToFirebase(cleanLocal);
        }
      }
      localStorage.removeItem(STORAGE_KEY_PARTNERS);
    }

    // 3. Services
    const localServicesRaw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (localServicesRaw) {
      const parsed = JSON.parse(localServicesRaw);
      const cleanLocal = Array.isArray(parsed) ? parsed.filter((s) => !isDummyService(s)) : [];
      if (cleanLocal.length > 0) {
        const remote = await getServicesFromFirebase();
        if (!remote || remote.length === 0) {
          console.log('[Cross-Device Sync] Migrating local services to Firestore:', cleanLocal.length);
          await syncAllServicesToFirebase(cleanLocal);
        }
      }
      localStorage.removeItem(STORAGE_KEY_SERVICES);
    }

    // 4. Videos
    const localVideosRaw = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (localVideosRaw) {
      const parsed = JSON.parse(localVideosRaw);
      const cleanLocal = Array.isArray(parsed) ? parsed.filter((v) => !isDummyVideo(v)) : [];
      if (cleanLocal.length > 0) {
        const remote = await getVideosFromFirebase();
        if (!remote || remote.length === 0) {
          await saveVideosToFirebase(cleanLocal);
        }
      }
      localStorage.removeItem(STORAGE_KEY_VIDEOS);
    }
  } catch (err) {
    console.warn('Auto-migration warning:', err);
  }
}

/**
 * Reactive React hook for components consuming or managing live cloud content.
 * Real-time Firestore synchronization ensures instant updates across all devices (mobile, laptop, ngrok).
 */
export function useContentStorage() {
  const [inspiredImages, setInspiredImages] = useState(inMemoryCache.lookbook);
  const [partners, setPartners] = useState(inMemoryCache.partners);
  const [videos, setVideos] = useState(inMemoryCache.videos);
  const [servicesData, setServicesData] = useState(inMemoryCache.services);

  const [loadingServices, setLoadingServices] = useState(!inMemoryCache.servicesSynced);
  const [loadingLookbook, setLoadingLookbook] = useState(!inMemoryCache.lookbookSynced);
  const [loadingPartners, setLoadingPartners] = useState(!inMemoryCache.partnersSynced);
  const [loadingVideos, setLoadingVideos] = useState(!inMemoryCache.videosSynced);

  useEffect(() => {
    let isMounted = true;

    // 1. Real-time subscription to Services from Firestore
    const unsubscribeServices = subscribeToServices((services) => {
      if (!isMounted) return;
      const clean = (services || []).filter((s) => !isDummyService(s));
      inMemoryCache.services = clean;
      inMemoryCache.servicesSynced = true;
      setServicesData(clean);
      setLoadingServices(false);
    });

    // 2. Real-time subscription to Lookbook from Firestore
    const unsubscribeLookbook = subscribeToLookbook((items) => {
      if (!isMounted) return;
      const clean = (items || []).filter((l) => !isDummyLookbook(l));
      inMemoryCache.lookbook = clean;
      inMemoryCache.lookbookSynced = true;
      setInspiredImages(clean);
      setLoadingLookbook(false);
    });

    // 3. Real-time subscription to Brand Partners from Firestore
    const unsubscribePartners = subscribeToPartners((items) => {
      if (!isMounted) return;
      const clean = (items || []).filter((p) => !isDummyPartner(p));
      inMemoryCache.partners = clean;
      inMemoryCache.partnersSynced = true;
      setPartners(clean);
      setLoadingPartners(false);
    });

    // 4. Real-time subscription to YouTube Videos from Firestore
    const unsubscribeVideos = subscribeToVideos((items) => {
      if (!isMounted) return;
      const clean = (items || []).filter((v) => !isDummyVideo(v));
      inMemoryCache.videos = clean;
      inMemoryCache.videosSynced = true;
      setVideos(clean);
      setLoadingVideos(false);
    });

    // 5. One-time check for legacy local data to migrate to Firestore
    if (!inMemoryCache.migrated) {
      inMemoryCache.migrated = true;
      tryAutoMigrateLegacyData();
    }

    // 6. Listen for local events across tabs in same browser
    const handleLocalEvent = (e) => {
      if (!isMounted) return;
      const type = e.detail?.type;
      if (type === 'inspired') setInspiredImages(inMemoryCache.lookbook);
      if (type === 'partners') setPartners(inMemoryCache.partners);
      if (type === 'videos') setVideos(inMemoryCache.videos);
      if (type === 'services') setServicesData(inMemoryCache.services);
    };

    window.addEventListener(EVENT_NAME, handleLocalEvent);

    return () => {
      isMounted = false;
      window.removeEventListener(EVENT_NAME, handleLocalEvent);
      if (typeof unsubscribeServices === 'function') unsubscribeServices();
      if (typeof unsubscribeLookbook === 'function') unsubscribeLookbook();
      if (typeof unsubscribePartners === 'function') unsubscribePartners();
      if (typeof unsubscribeVideos === 'function') unsubscribeVideos();
    };
  }, []);

  const loading = loadingServices || loadingLookbook || loadingPartners || loadingVideos;

  return {
    loading,
    loadingServices,
    loadingLookbook,
    loadingPartners,
    loadingVideos,
    inspiredImages,
    partners,
    videos,
    servicesData,
    saveInspiredImages: (imgs) => {
      const clean = Array.isArray(imgs) ? imgs.filter((l) => !isDummyLookbook(l)) : [];
      inMemoryCache.lookbook = clean;
      setInspiredImages(clean);
      saveLookbookToFirebase(clean).catch((err) =>
        console.error('Lookbook sync to Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: clean } }));
      }
    },
    resetInspiredImages: () => {
      inMemoryCache.lookbook = [];
      setInspiredImages([]);
      saveLookbookToFirebase([]).catch((err) =>
        console.error('Lookbook reset in Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'inspired', data: [] } }));
      }
    },
    savePartners: (pts) => {
      const clean = Array.isArray(pts) ? pts.filter((p) => !isDummyPartner(p)) : [];
      inMemoryCache.partners = clean;
      setPartners(clean);
      savePartnersToFirebase(clean).catch((err) =>
        console.error('Partners sync to Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: clean } }));
      }
    },
    resetPartners: () => {
      inMemoryCache.partners = [];
      setPartners([]);
      savePartnersToFirebase([]).catch((err) =>
        console.error('Partners reset in Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'partners', data: [] } }));
      }
    },
    saveVideos: (vids) => {
      const clean = Array.isArray(vids) ? vids.filter((v) => !isDummyVideo(v)) : [];
      inMemoryCache.videos = clean;
      setVideos(clean);
      saveVideosToFirebase(clean).catch((err) =>
        console.error('Videos sync to Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: clean } }));
      }
    },
    resetVideos: () => {
      inMemoryCache.videos = [];
      setVideos([]);
      saveVideosToFirebase([]).catch((err) =>
        console.error('Videos reset in Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'videos', data: [] } }));
      }
    },
    saveServicesData: (data) => {
      const clean = Array.isArray(data)
        ? data
            .filter((s) => !isDummyService(s))
            .map((s, idx) => normalizeService(s, idx))
            .filter(Boolean)
        : [];
      inMemoryCache.services = clean;
      setServicesData(clean);
      syncAllServicesToFirebase(clean).catch((err) =>
        console.error('Services sync to Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: clean } }));
      }
    },
    resetServicesData: () => {
      inMemoryCache.services = [];
      setServicesData([]);
      clearAllServicesFromFirebase().catch((err) =>
        console.error('Services reset in Firestore failed:', err)
      );
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { type: 'services', data: [] } }));
      }
    },
  };
}

export default useContentStorage;
