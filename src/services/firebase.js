import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAv8fNUa0XQWW5asidnD7BD44sVrAnN3Hg",

  authDomain: "velox-inspecao-anac.firebaseapp.com",

  projectId: "velox-inspecao-anac",

  storageBucket: "velox-inspecao-anac.firebasestorage.app",

  messagingSenderId: "849853067895",

  appId: "1:849853067895:web:0c51d5e61e935085f5cc72",

  measurementId: "G-BC1ESQDEMY",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

// FIREBASE STORAGE
export const storage = getStorage(app);

export default app;