// invite.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const inviteLinkEl = document.getElementById("invite-link");
const copyBtn = document.getElementById("copy-link");
const referralCountEl = document.getElementById("referral-count");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;

  // Generate invite link
  const inviteLink = `${window.location.origin}/index.html?ref=${uid}`;
  inviteLinkEl.textContent = inviteLink;

  // Copy to clipboard
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋 Copy Link"), 2000);
    });
  };

  // Query referred users
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("referrer", "==", uid));
  const snapshot = await getDocs(q);
  referralCountEl.textContent = `You have invited: ${snapshot.size} people`;
});
