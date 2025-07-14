// auth.js — Handles login session + Firestore user document creation

import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// 🔁 Extract referral code from URL
function getReferralCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("ref");
}

// ✅ Sign-In with Google and Initialize Firestore User
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const referralCode = getReferralCode();

    if (!userSnap.exists()) {
      // 🆕 Create new user
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || "avatars/default.png",
        emailVerified: user.emailVerified || false,
        balance: 0,
        score: referralCode ? 5 : 0,
        trustScore: referralCode ? 5 : 0,
        referredBy: referralCode || null,
        miningStart: null,
        miningEnd: null,
        lastUpdate: null,
        joinedAt: new Date().toISOString()
      });

      // 🎁 Give bonus to referrer
      if (referralCode) {
        const referrerQuery = doc(db, "users", referralCode);
        const refSnap = await getDoc(referrerQuery);
        if (refSnap.exists()) {
          await updateDoc(referrerQuery, {
            score: increment(5),
            trustScore: increment(5)
          });
        }
      }
    }

    // ✅ Redirect
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("❌ Sign-in failed:", err);
    alert("Login failed. Please try again.");
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

// ✅ Auth state listener (global access)
function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// ✅ Export all
export {
  signInWithGoogle,
  logoutUser,
  watchAuth
};
