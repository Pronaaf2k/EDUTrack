// client/src/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Paste your actual configuration from the Firebase Console here
const firebaseConfig = {
  apiKey: "AIzaSyBBiL-CT8UQ3pK8UtwYqxnoO4uLIVgaBuE",
  authDomain: "edutrack-931c5.firebaseapp.com",
  projectId: "edutrack-931c5",
  storageBucket: "edutrack-931c5.firebasestorage.app",
  messagingSenderId: "629914554329",
  appId: "1:629914554329:web:511d35db70257bfcb553c8",
  measurementId: "G-NB135Y49JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);