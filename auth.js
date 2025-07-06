// auth.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.firebasestorage.app",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Register new user
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login user
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Google login
export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

// Logout
export function logout() {
  return signOut(auth);
}

// Monitor authentication state
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}
