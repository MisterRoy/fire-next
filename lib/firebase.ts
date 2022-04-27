import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB6dosR4VsYGb0WM5SZq03DcSqxYoSz2YM",
  authDomain: "next-fire-c6860.firebaseapp.com",
  projectId: "next-fire-c6860",
  storageBucket: "next-fire-c6860.appspot.com",
  messagingSenderId: "995191916199",
  appId: "1:995191916199:web:fed507405246233e217d82"
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);


// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
