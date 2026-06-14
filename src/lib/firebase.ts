import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
  getFirestore as getFirestoreBase
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * EcoSense AI - Firebase Production Singleton
 * Implements a fail-safe for IndexedDB corruption and lazy-loading for services.
 */

const getFirebaseConfig = () => {
  const env = import.meta.env;
  return {
    apiKey: String(env.VITE_FIREBASE_API_KEY || '').trim(),
    authDomain: String(env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    projectId: String(env.VITE_FIREBASE_PROJECT_ID || '').trim(),
    storageBucket: String(env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
    messagingSenderId: String(env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    appId: String(env.VITE_FIREBASE_APP_ID || '').trim(),
    measurementId: String(env.VITE_FIREBASE_MEASUREMENT_ID || '').trim(),
  };
};

const isConfigValid = () => {
  const config = getFirebaseConfig();
  return config.apiKey.startsWith('AIza') && config.apiKey.length > 20;
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

export const getAppInstance = (): FirebaseApp | null => {
  if (appInstance) return appInstance;
  if (!isConfigValid()) return null;

  try {
    appInstance = getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApp();
    return appInstance;
  } catch (e) {
    console.error("Firebase init failed", e);
    return null;
  }
};

export const getFirebaseAuth = (): Auth | null => {
  const app = getAppInstance();
  if (!app) return null;
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
};

export const getFirestore = (): Firestore | null => {
  const app = getAppInstance();
  if (!app) return null;

  if (!dbInstance) {
    try {
      // Attempt to initialize with persistent local cache
      dbInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (e) {
      // Fallback to standard Firestore if persistence fails (common on corruption)
      console.warn("Firestore persistence failed, falling back to default:", e);
      dbInstance = getFirestoreBase(app);
    }
  }
  return dbInstance;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  const app = getAppInstance();
  if (!app) return null;
  if (!storageInstance) storageInstance = getStorage(app);
  return storageInstance;
};

export const getGoogleProvider = () => new GoogleAuthProvider();
