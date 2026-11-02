import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const BOOKINGS_COLLECTION = 'bookings';

/**
 * Save an appointment booking to Firebase Firestore
 */
export async function saveBookingToFirebase(bookingData) {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      createdAt: serverTimestamp(),
      status: 'pending', // pending | confirmed | completed | cancelled
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error saving booking to Firebase:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all bookings from Firebase Firestore ordered by creation date
 */
export async function getBookingsFromFirebase() {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((docSnap) => {
      bookings.push({ id: docSnap.id, ...docSnap.data() });
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings from Firebase:', error);
    return [];
  }
}

/**
 * Update a booking's status in Firestore
 */
export async function updateBookingStatusInFirebase(bookingId, status) {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a booking from Firestore
 */
export async function deleteBookingFromFirebase(bookingId) {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { success: false, error: error.message };
  }
}
