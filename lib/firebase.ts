import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
  getDoc,
  DocumentSnapshot,
  Timestamp,
  orderBy,
  FieldValue,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6dosR4VsYGb0WM5SZq03DcSqxYoSz2YM",
  authDomain: "next-fire-c6860.firebaseapp.com",
  projectId: "next-fire-c6860",
  storageBucket: "next-fire-c6860.appspot.com",
  messagingSenderId: "995191916199",
  appId: "1:995191916199:web:fed507405246233e217d82",
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
export const STATE_CHANGED = "state_changed";

// Helpler functions

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const userQuery = query(
    usersRef,
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(userQuery)).docs[0];

  return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    createdAt: (data.createdAt as Timestamp).toMillis(),
    updatedAt: (data.updatedAt as Timestamp).toMillis(),
  };
}

/**
 * Retrieve posts from user document
 * @param userDoc
 * @returns
 */
export async function getPosts(userDoc) {
  const postsQuery = query(
    collection(firestore, `users/${userDoc.id}/posts`),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return posts;
}
