import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config (use same one as dashboard.js)
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.firebasestorage.app",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailEl = document.getElementById("email");
const balanceEl = document.getElementById("balance");
const trustScoreEl = document.getElementById("trustScore");
const levelEl = document.getElementById("level");
const refLinkEl = document.getElementById("refLink");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  emailEl.textContent = user.email;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const balance = data.balance || 0;
  const trust = data.trustScore || 0;

  balanceEl.textContent = balance.toFixed(3);
  trustScoreEl.textContent = trust;

  // Miner level logic
  let level = "Beginner";
  if (balance >= 5000) level = "Grandmaster";
  else if (balance >= 3000) level = "Master";
  else if (balance >= 1500) level = "Elite";
  else if (balance >= 800) level = "Amateur";
  else if (balance >= 200) level = "Rookie";

  levelEl.textContent = level;

  // Referral Link
  const refLink = `${window.location.origin}/index.html?ref=${user.uid}`;
  refLinkEl.textContent = refLink;
  refLinkEl.href = refLink;
});
