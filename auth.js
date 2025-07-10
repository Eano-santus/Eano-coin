// auth.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-signin");

// ✅ SIGN UP
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const firstname = document.getElementById("signup-firstname").value.trim();
    const lastname = document.getElementById("signup-lastname").value.trim();

    if (username.length < 4 || password.length < 6) {
      alert("Username or password too short.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        username,
        firstname,
        lastname,
        balance: 2,
        referralCount: 0,
        trustScore: 0,
        lastMine: null,
        createdAt: new Date()
      });
      localStorage.setItem("seenWelcome", "true");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}

// ✅ LOGIN
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("seenWelcome", "true");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}

// ✅ GOOGLE LOGIN
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          email: result.user.email,
          username: result.user.displayName || "eano_user",
          balance: 2,
          referralCount: 0,
          trustScore: 0,
          lastMine: null,
          createdAt: new Date()
        });
      }
      localStorage.setItem("seenWelcome", "true");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ Google login failed: " + err.message);
    }
  });
}
