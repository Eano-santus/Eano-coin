// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 🌐 Get Referral Code (if any)
const urlParams = new URLSearchParams(window.location.search);
const refId = urlParams.get("ref");

// 🔧 Utility Functions
function generateReferralCode(username) {
  return `${username}-${Math.floor(Math.random() * 10000)}`;
}

function generateEanoId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "EANO";
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ✅ Google Sign-In (For Existing Users Only)
const googleBtn = document.getElementById("google-signin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await auth.signOut();
        alert("❌ Access denied. This Google account is not registered.");
        return;
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed.");
    }
  });
}

// ✅ Email/Password Login
document.getElementById("login-btn")?.addEventListener("click", async () => {
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

// ✅ Full Signup with Username, Firstname, Lastname
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const username = document.getElementById("signup-username").value.trim().toLowerCase();
  const firstname = document.getElementById("signup-firstname").value.trim();
  const lastname = document.getElementById("signup-lastname").value.trim();

  if (!username || username.length < 4) return alert("Username must be at least 4 characters.");
  if (!firstname || !lastname) return alert("First and Last name are required.");
  if (password.length < 6) return alert("Password must be at least 6 characters.");

  // Check for unique username
  const q = query(collection(db, "users"), where("username", "==", username));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) return alert("Username already taken. Choose another.");

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await handleNewUser(user, username, firstname, lastname);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error("Signup error:", err);
    alert("Signup failed.");
  }
});

// ✅ Save New User to Firestore
async function handleNewUser(user, username, firstname, lastname) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const referralCode = generateReferralCode(username);
    const eanoId = generateEanoId();

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      username,
      firstname,
      lastname,
      referralCode,
      referrals: [],
      referralCount: 0,
      referredBy: refId || null,
      balance: 2,
      trustScore: 0,
      lastMine: null,
      createdAt: new Date().toISOString(),
      level: "🐥 Chicken",
      status: "active",
      eanoId
    });

    // Handle referral bonus
    if (refId) {
      const refUserRef = doc(db, "users", refId);
      const refSnap = await getDoc(refUserRef);
      if (refSnap.exists()) {
        const refData = refSnap.data();
        await updateDoc(refUserRef, {
          balance: (refData.balance || 0) + 2,
          trustScore: (refData.trustScore || 0) + 50,
          referralCount: (refData.referralCount || 0) + 1,
          referrals: [...(refData.referrals || []), user.uid]
        });
      }
    }
  }
}

// ✅ Export for other modules
export { auth, db };
