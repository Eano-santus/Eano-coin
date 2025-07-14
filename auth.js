// auth.js — Handles login session + Firestore user document creation

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ✅ Handle Sign-In with Google
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔐 Check if user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // 🆕 Create user in Firestore
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        balance: 0,
        score: 0,
        trustScore: 0,
        referredBy: null,
        miningStart: null,
        miningEnd: null,
        lastUpdate: null,
        joinedAt: new Date().toISOString()
      });
    }

    // ✅ Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("❌ Sign-in error:", error);
    alert("Google sign-in failed. Please try again.");
  }
}

// ✅ Logout handler
function logoutUser() {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("❌ Sign-out failed:", error);
  });
}

// ✅ Auth state listener (if needed elsewhere)
function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// ✅ Exports
export {
  auth,
  db,
  signInWithGoogle,
  logoutUser,
  watchAuth
};
