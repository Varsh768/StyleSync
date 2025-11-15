// FIREBASE COMMENTED OUT FOR TESTING
// import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
// import { getAuth, Auth } from 'firebase/auth';
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - replace with your actual config
// For now, using placeholder values that need to be replaced
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'your-app-id',
// };

// let app: FirebaseApp;
// let auth: Auth;
// let db: Firestore;
// let storage: FirebaseStorage;

// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);
//   auth = getAuth(app);
//   db = getFirestore(app);
//   storage = getStorage(app);
// } else {
//   app = getApps()[0];
//   auth = getAuth(app);
//   db = getFirestore(app);
//   storage = getStorage(app);
// }

// Mock implementations for testing
export const auth = {
  currentUser: null,
  signOut: async () => {},
} as any;

export const db = {} as any;

export const storage = {} as any;

export default {};

