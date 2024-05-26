// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const auth = getAuth();
// export const db = getFirestore(app);
export const db = getFirestore(app); // firebase.firestore(); if do the other way
export const storage = getStorage(app); // firebase.storage();
export { doc, updateDoc, deleteDoc };