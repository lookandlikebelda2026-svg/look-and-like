import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_STORAGE_KEY = 'look_and_like_admin_session_v1';

/**
 * Check if local admin session exists
 */
export function getLocalAdminSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save admin session locally
 */
export function setLocalAdminSession(adminData, remember = true) {
  if (typeof window === 'undefined') return;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
}

/**
 * Clear admin session
 */
export function clearLocalAdminSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

/**
 * Convert Firebase auth error code to human-friendly message
 */
function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/user-not-found':
      return 'No account registered with this email.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to repeated failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return 'Authentication failed. Please verify your credentials and try again.';
  }
}

/**
 * Sign in admin user via Firebase Auth
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function loginAdmin(email, password, remember = true) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  try {
    // Configure session persistence
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );

    // Sign in via Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    const fbUser = userCredential.user;

    // Check / retrieve admin metadata from Firestore if available
    let role = 'admin';
    let displayName = fbUser.displayName || 'Administrator';

    try {
      const adminDocRef = doc(db, 'admins', fbUser.uid);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const data = adminSnap.data();
        role = data.role || 'admin';
        displayName = data.displayName || displayName;
        await setDoc(
          adminDocRef,
          { lastLoginAt: serverTimestamp() },
          { merge: true }
        );
      } else {
        // Record login if doc doesn't exist yet
        await setDoc(
          adminDocRef,
          {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName,
            role: 'admin',
            lastLoginAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (firestoreErr) {
      console.warn('Firestore admin profile check warning:', firestoreErr);
    }

    const sessionUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName,
      role,
      provider: 'firebase',
    };

    setLocalAdminSession(sessionUser, remember);
    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Firebase login error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
}

/**
 * Register a new admin user in Firebase Authentication and Firestore
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function registerAdmin(email, password, displayName = 'Administrator') {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanName = (displayName || '').trim() || 'Administrator';

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    const fbUser = userCredential.user;

    // Update display name in Firebase Auth profile
    try {
      await updateProfile(fbUser, { displayName: cleanName });
    } catch (profileErr) {
      console.warn('Profile name update warning:', profileErr);
    }

    // Persist admin document in Firestore 'admins' collection
    try {
      await setDoc(doc(db, 'admins', fbUser.uid), {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: cleanName,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } catch (fsErr) {
      console.warn('Firestore admin creation warning:', fsErr);
    }

    const sessionUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: cleanName,
      role: 'admin',
      provider: 'firebase',
    };

    setLocalAdminSession(sessionUser, true);
    return { success: true, user: sessionUser };
  } catch (error) {
    console.error('Firebase registration error:', error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
}

/**
 * Logout admin user from Firebase Auth and clear local session
 */
export async function logoutAdmin() {
  clearLocalAdminSession();
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }
}

/**
 * Real-time auth observer with Firebase Auth
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Administrator',
        role: 'admin',
        provider: 'firebase',
      };
      setLocalAdminSession(user, true);
      callback(user);
    } else {
      clearLocalAdminSession();
      callback(null);
    }
  });
}

/**
 * Service to verify credentials and authenticate admin login
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {boolean} [params.remember=true]
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function verifyAdminLogin({ email, password, remember = true }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  return await loginAdmin(cleanEmail, cleanPassword, remember);
}

/**
 * Service to verify inputs and register a new administrator
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.confirmPassword
 * @param {string} params.displayName
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function verifyAdminRegistration({ email, password, confirmPassword, displayName }) {
  const cleanName = (displayName || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanConfirmPassword = (confirmPassword || '').trim();

  if (!cleanName) {
    return { success: false, error: 'Please enter your full name or staff title.' };
  }

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  if (cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  if (cleanPassword !== cleanConfirmPassword) {
    return { success: false, error: 'Passwords do not match. Please verify both passwords.' };
  }

  return await registerAdmin(cleanEmail, cleanPassword, cleanName);
}

