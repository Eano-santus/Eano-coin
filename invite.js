import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
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
  storageBucket: "eano-miner.firebasestorage.app",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const inviteLinkEl = document.getElementById("invite-link");
const copyBtn = document.getElementById("copy-link");
const referralCountEl = document.getElementById("referral-count");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const inviteLink = `${window.location.origin}/index.html?ref=${uid}`;
  inviteLinkEl.textContent = inviteLink;

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋 Copy Link"), 2000);
    });
  };

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("referredBy", "==", uid));
  const snapshot = await getDocs(q);
  referralCountEl.textContent = `You have invited: ${snapshot.size} people`;
});
