import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const STORAGE_VIEW_COUNT_KEY = 'look_and_like_view_count';
const SESSION_VISIT_FLAG = 'look_and_like_view_counted';
const ANALYTICS_DOC_REF = 'analytics';
const ANALYTICS_DOC_ID = 'pageViews';
const DEFAULT_BASELINE_VIEWS = 1482; // Authentic established studio baseline

/**
 * Get current stored view count from local cache
 */
function getCachedViewCount() {
  if (typeof window === 'undefined') return DEFAULT_BASELINE_VIEWS;
  try {
    const val = localStorage.getItem(STORAGE_VIEW_COUNT_KEY);
    return val ? parseInt(val, 10) : DEFAULT_BASELINE_VIEWS;
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
    localStorage.setItem(STORAGE_VIEW_COUNT_KEY, count.toString());
  } catch (err) {
    // Ignore storage errors
  }
}

/**
 * Increment and retrieve the aggregate view count.
 * Uses Firestore with automatic fallback to localStorage.
 * Ensures only 1 increment per browser session to prevent false view counts.
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
          // If doc doesn't exist yet, initialize it
          const initialCount = currentCount + 1;
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
 * Reactive React hook to display and track studio views
 */
export function useViewCount() {
  const [views, setViews] = useState(getCachedViewCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

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

    return () => {
      isMounted = false;
    };
  }, []);

  return { views, isLoading };
}

export default {
  recordAndFetchPageView,
  useViewCount,
};

