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

const INQUIRIES_COLLECTION = 'inquiries';

/**
 * Save an inquiry / contact note to Firebase Firestore
 */
export async function saveInquiryToFirebase(inquiryData) {
  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiryData,
      createdAt: serverTimestamp(),
      status: 'unread', // unread | replied | archived
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error saving inquiry to Firebase:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all inquiries from Firebase Firestore ordered by creation date
 */
export async function getInquiriesFromFirebase() {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const inquiries = [];
    querySnapshot.forEach((docSnap) => {
      inquiries.push({ id: docSnap.id, ...docSnap.data() });
    });
    return inquiries;
  } catch (error) {
    console.error('Error fetching inquiries from Firebase:', error);
    return [];
  }
}

/**
 * Update an inquiry's status (e.g. 'read', 'replied')
 */
export async function updateInquiryStatusInFirebase(inquiryId, status) {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete an inquiry from Firestore
 */
export async function deleteInquiryFromFirebase(inquiryId) {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return { success: false, error: error.message };
  }
}
