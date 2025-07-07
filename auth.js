// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 🔁 Get referral ID from URL if available
const urlParams = new URLSearchParams(window.location.search);
const refId = urlParams.get("ref");

// ✅ Google Sign-In
const googleBtn = document.getElementById("google-signin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await handleNewUser(user);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed.");
    }
  });
}

// ✅ Email Login
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials.");
    }
  });
}

// ✅ Email Signup
const signupBtn = document.getElementById("signup-btn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await handleNewUser(user);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed.");
    }
  });
}

// ✅ Handle new user creation and referral logic
async function handleNewUser(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    // Give new user 2 EANO
    await setDoc(userRef, {
      email: user.email,
      balance: 2,
      lastMine: null,
      trustScore: 0,
      referrals: [],
      referredBy: refId || null
    });

    // Give 2 EANO to referrer if valid
    if (refId) {
      const refUserRef = doc(db, "users", refId);
      const refSnap = await getDoc(refUserRef);
      if (refSnap.exists()) {
        const refData = refSnap.data();
        await updateDoc(refUserRef, {
          balance: (refData.balance || 0) + 2,
          referrals: [...(refData.referrals || []), user.uid]
        });
      }
    }
  }
}
