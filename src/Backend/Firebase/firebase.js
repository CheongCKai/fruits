// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcmJ1a-_xAO3Ekf4VkN_jr-hIbkUPAOlc",
  authDomain: "raid-fruits.firebaseapp.com",
  projectId: "raid-fruits",
  storageBucket: "raid-fruits.appspot.com",
  messagingSenderId: "944643427141",
  appId: "1:944643427141:web:705b6b9b8bd86b09b4cc2c",
  measurementId: "G-MDD4JWMG4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, doc, updateDoc, deleteDoc, getDoc, setDoc, app };
