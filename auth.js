// auth.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Sign in with Google
export async function signInWithGoogle(referrerId = null) {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // ⛏ First-time sign-in
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        phone: user.phoneNumber || "",
        balance: 2.0,
        trustScore: 0,
        level: "🐥 Chicken",
        referralCount: 0,
        referrerId: referrerId || null,
        createdAt: new Date().toISOString(),
        lastMine: null
      });

      // Reward the referrer if exists
      if (referrerId) {
        const referrerRef = doc(db, "users", referrerId);
        const referrerSnap = await getDoc(referrerRef);
        if (referrerSnap.exists()) {
          await updateDoc(referrerRef, {
            balance: increment(2.0),
            referralCount: increment(1)
          });
        }
      }
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    alert("❌ Sign-in failed. Try again.");
  }
}

// ✅ Logout
export function logout() {
  signOut(auth)
    .then(() => window.location.href = "index.html")
    .catch(err => console.error("Logout failed", err));
}

// ✅ Export listener
export { onAuthStateChanged };
