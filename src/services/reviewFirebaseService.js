import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const REVIEWS_COLLECTION = 'reviews';
const LOCAL_STORAGE_KEY = 'look_and_like_reviews_v1';

// Empty default reviews list - no dummy seed reviews
export const DEFAULT_REVIEWS = [];

/**
 * Load cached reviews from localStorage (purging any legacy dummy/seed reviews)
 */
function getCachedReviews() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any legacy dummy reviews
    const cleaned = parsed.filter((r) => !String(r.id || '').startsWith('seed-review'));
    return cleaned;
  } catch (e) {
    return [];
  }
}

/**
 * Cache reviews in localStorage
 */
function setCachedReviews(reviews) {
  if (typeof window === 'undefined') return;
  try {
    // Filter out any dummy reviews before saving
    const cleaned = (Array.isArray(reviews) ? reviews : []).filter(
      (r) => !String(r.id || '').startsWith('seed-review')
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
  } catch (e) {
    // ignore quota errors
  }
}

// Auto-purge legacy dummy reviews from browser localStorage on load
if (typeof window !== 'undefined') {
  try {
    const cached = getCachedReviews();
    setCachedReviews(cached);
  } catch (e) {
    // ignore
  }
}

/**
 * Add a new client review.
 * Always created in an UNVERIFIED state (verified: false).
 */
export async function addReviewToFirebase({ name, rating, comment }) {
  const cleanName = String(name || '').trim();
  const cleanComment = String(comment || '').trim();
  const cleanRating = Math.min(5, Math.max(1, Number(rating) || 5));

  if (!cleanName || !cleanComment) {
    return { success: false, error: 'Name and review text are required.' };
  }

  const newReviewData = {
    name: cleanName,
    rating: cleanRating,
    comment: cleanComment,
    verified: false, // New reviews always start unverified!
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...newReviewData,
      createdAtServer: serverTimestamp(),
    });

    const createdReview = { ...newReviewData, id: docRef.id };

    // Update local cache
    const current = getCachedReviews();
    const updated = [createdReview, ...current.filter((r) => r.id !== createdReview.id)];
    setCachedReviews(updated);

    return { success: true, id: docRef.id, review: createdReview };
  } catch (error) {
    console.warn('Firestore addReview notice (saving to local cache):', error.message);
    // Offline/fallback handling
    const fallbackId = `local_rev_${Date.now()}`;
    const fallbackReview = { ...newReviewData, id: fallbackId };
    const current = getCachedReviews();
    const updated = [fallbackReview, ...current];
    setCachedReviews(updated);
    return { success: true, id: fallbackId, review: fallbackReview };
  }
}

/**
 * Update verification status of a review (admin action)
 */
export async function updateReviewVerificationInFirebase(reviewId, verified = true) {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(docRef, {
      verified: Boolean(verified),
      verifiedAt: serverTimestamp(),
    });

    // Update local cache
    const current = getCachedReviews();
    const updated = current.map((r) =>
      r.id === reviewId ? { ...r, verified: Boolean(verified) } : r
    );
    setCachedReviews(updated);

    return { success: true };
  } catch (error) {
    console.warn('Firestore updateReview error (updating local cache):', error.message);
    const current = getCachedReviews();
    const updated = current.map((r) =>
      r.id === reviewId ? { ...r, verified: Boolean(verified) } : r
    );
    setCachedReviews(updated);
    return { success: true };
  }
}

/**
 * Delete a review (admin action)
 */
export async function deleteReviewFromFirebase(reviewId) {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(docRef);

    const current = getCachedReviews();
    const updated = current.filter((r) => r.id !== reviewId);
    setCachedReviews(updated);

    return { success: true };
  } catch (error) {
    console.warn('Firestore deleteReview error (updating local cache):', error.message);
    const current = getCachedReviews();
    const updated = current.filter((r) => r.id !== reviewId);
    setCachedReviews(updated);
    return { success: true };
  }
}

/**
 * Real-time subscription to all reviews (no dummy seed reviews included)
 */
export function subscribeToReviews(onUpdate, onError) {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach((snapDoc) => {
            // Ignore any dummy reviews if they were stored
            if (String(snapDoc.id).startsWith('seed-review')) return;

            const data = snapDoc.data();
            list.push({
              id: snapDoc.id,
              ...data,
              createdAt:
                data.createdAt ||
                (data.createdAtServer?.toDate
                  ? data.createdAtServer.toDate().toISOString()
                  : new Date().toISOString()),
            });
          });

          // Sort by creation date descending
          list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

          setCachedReviews(list);
          onUpdate(list);
        } else {
          setCachedReviews([]);
          onUpdate([]);
        }
      },
      (error) => {
        console.warn('Real-time reviews subscription warning:', error.message);
        onUpdate(getCachedReviews());
        onError?.(error);
      }
    );
  } catch (error) {
    console.warn('Failed to subscribe to reviews:', error);
    onUpdate(getCachedReviews());
    return () => {};
  }
}

let reviewsSynced = false;

/**
 * Custom React Hook for accessing and managing reviews across both Client and Admin
 */
export function useReviews() {
  const [reviews, setReviews] = useState(() => getCachedReviews());
  const [loading, setLoading] = useState(!reviewsSynced);

  useEffect(() => {
    const unsubscribe = subscribeToReviews((updatedList) => {
      reviewsSynced = true;
      setReviews(updatedList);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filter only verified reviews for public UI
  const verifiedReviews = reviews.filter((r) => Boolean(r.verified));

  // Count unverified reviews for admin notification badge
  const pendingCount = reviews.filter((r) => !r.verified).length;

  const addReview = useCallback(async (data) => {
    const res = await addReviewToFirebase(data);
    if (res.success && res.review) {
      setReviews((prev) => [res.review, ...prev.filter((r) => r.id !== res.review.id)]);
    }
    return res;
  }, []);

  const verifyReview = useCallback(async (id, verified = true) => {
    const res = await updateReviewVerificationInFirebase(id, verified);
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, verified: Boolean(verified) } : r))
      );
    }
    return res;
  }, []);

  const deleteReview = useCallback(async (id) => {
    const res = await deleteReviewFromFirebase(id);
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    return res;
  }, []);

  return {
    reviews,
    verifiedReviews,
    pendingCount,
    loading,
    addReview,
    verifyReview,
    deleteReview,
  };
}
