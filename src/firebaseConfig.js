import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsle-u4nwxFo8I39liEKvLBd67Kl0VWqM",
  authDomain: "cse-infiq.firebaseapp.com",
  projectId: "cse-infiq",
  storageBucket: "cse-infiq.firebasestorage.app",
  messagingSenderId: "961200505118",
  appId: "1:961200505118:web:753a07fdb8723357cb490f",
  measurementId: "G-6TEL36T9K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
try {
  // Only attempt analytics if measurementId exists and we are in a browser
  if (firebaseConfig.measurementId && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn("Firebase Analytics could not be initialized (likely blocked or offline):", error.message);
}

const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
