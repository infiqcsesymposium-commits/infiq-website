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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
