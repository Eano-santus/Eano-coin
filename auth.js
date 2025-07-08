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
  updateDoc,
  collection,
  query,
  where,
  getDocs
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

// 🔧 Generate 8-char EANO ID
function generateEanoId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "EANO";
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ✅ Google Sign-In
const googleBtn = document.getElementById("google-signin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await handleNewUser(user, null); // Google does not collect username
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
    const username = document.getElementById("signup-username").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;

    if (!username || username.length < 4) {
      alert("Username must be at least 4 characters.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Check for duplicate username
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Username is already taken. Choose another.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await handleNewUser(user, username);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed.");
    }
  });
}

// ✅ Handle new user creation and referral logic
async function handleNewUser(user, username) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const eanoId = generateEanoId();

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username,
      eanoId,
      balance: 2,
      trustScore: 0,
      referralCount: 0,
      referrals: [],
      referredBy: refId || null,
      lastMine: null,
      createdAt: new Date().toISOString(),
      status: "active"
    });

    // Give 2 EANO to referrer if valid
    if (refId) {
      const refUserRef = doc(db, "users", refId);
      const refSnap = await getDoc(refUserRef);
      if (refSnap.exists()) {
        const refData = refSnap.data();
        await updateDoc(refUserRef, {
          balance: (refData.balance || 0) + 2,
          referralCount: (refData.referralCount || 0) + 1,
          referrals: [...(refData.referrals || []), user.uid],
          trustScore: (refData.trustScore || 0) + 50
        });
      }
    }
  }
}

export { auth, db };
