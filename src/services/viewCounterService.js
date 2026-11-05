import { useState, useEffect } from 'react';
import { db } from './firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

const STORAGE_VIEW_COUNT_KEY = 'look_and_like_site_views_v2';
const SESSION_VISIT_FLAG = 'look_and_like_view_counted_v2';
const ANALYTICS_DOC_REF = 'analytics';
const ANALYTICS_DOC_ID = 'siteViews';
const DEFAULT_BASELINE_VIEWS = 0; // Starts strictly from 0

/**
 * Get current stored view count from local cache (defaults to 0)
 */
function getCachedViewCount() {
  if (typeof window === 'undefined') return DEFAULT_BASELINE_VIEWS;
  try {
    // Clean up any legacy baseline storage keys
    localStorage.removeItem('look_and_like_view_count');
    const val = localStorage.getItem(STORAGE_VIEW_COUNT_KEY);
    return val ? Math.max(0, parseInt(val, 10) || 0) : DEFAULT_BASELINE_VIEWS;
  } catch (err) {
    return DEFAULT_BASELINE_VIEWS;
  }
}

/**
 * Save view count to local cache
 */
function setCachedViewCount(count) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_VIEW_COUNT_KEY, String(count));
  } catch (err) {
    // Ignore storage errors
  }
}

/**
 * Increment and retrieve the aggregate view count starting from 0.
 * Automatically saves to Firestore with local cache fallback.
 * Only increments once per browser session so reloads don't create false counts.
 * 
 * @returns {Promise<number>} Current total views
 */
export async function recordAndFetchPageView() {
  const isFirstVisitInSession = typeof window !== 'undefined' && !sessionStorage.getItem(SESSION_VISIT_FLAG);
  let currentCount = getCachedViewCount();

  // Mark session as counted
  if (isFirstVisitInSession && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SESSION_VISIT_FLAG, 'true');
    } catch (e) {
      // Ignore sessionStorage errors
    }
  }

  // Attempt Firestore sync
  try {
    if (db) {
      const pageViewDocRef = doc(db, ANALYTICS_DOC_REF, ANALYTICS_DOC_ID);

      if (isFirstVisitInSession) {
        // Increment in Firestore
        try {
          await updateDoc(pageViewDocRef, {
            count: increment(1),
            lastVisitedAt: serverTimestamp(),
          });
        } catch (updateErr) {
          // If document doesn't exist yet, initialize it starting from 1 (0 + 1)
          const initialCount = 1;
          await setDoc(pageViewDocRef, {
            count: initialCount,
            createdAt: serverTimestamp(),
            lastVisitedAt: serverTimestamp(),
          }, { merge: true });
        }
      }

      // Fetch latest value
      const snapshot = await getDoc(pageViewDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (typeof data.count === 'number') {
          currentCount = data.count;
          setCachedViewCount(currentCount);
          return currentCount;
        }
      }
    }
  } catch (firebaseErr) {
    // Firebase not reachable or permission denied; proceed with local cache
    console.warn('View counter using local persistence:', firebaseErr.message || firebaseErr);
  }

  // Fallback to local storage increment
  if (isFirstVisitInSession) {
    currentCount += 1;
    setCachedViewCount(currentCount);
  }

  return currentCount;
}

/**
 * Reactive React hook to display and track studio views starting from 0.
 * Listens to Firestore in real-time so live visits appear immediately.
 */
export function useViewCount() {
  const [views, setViews] = useState(getCachedViewCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Record this viewer's visit (once per session) and fetch initial count
    recordAndFetchPageView()
      .then((count) => {
        if (isMounted) {
          setViews(count);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // 2. Subscribe to real-time changes so the count updates live as new viewers visit
    let unsubscribe = null;
    try {
      if (db) {
        const pageViewDocRef = doc(db, ANALYTICS_DOC_REF, ANALYTICS_DOC_ID);
        unsubscribe = onSnapshot(
          pageViewDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              if (typeof data.count === 'number' && isMounted) {
                setViews(data.count);
                setCachedViewCount(data.count);
              }
            }
          },
          (error) => {
            console.warn('Real-time view listener notice:', error.message);
          }
        );
      }
    } catch (err) {
      console.warn('Real-time listener setup notice:', err);
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { views, isLoading };
}

export default {
  recordAndFetchPageView,
  useViewCount,
};
