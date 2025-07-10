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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔗 DOM Elements
const inviteLinkEl = document.getElementById("invite-link");
const copyBtn = document.getElementById("copy-link");
const referralCountEl = document.getElementById("referral-count");

// 📲 Sharing buttons
const shareWhatsapp = document.getElementById("whatsapp-share");
const shareTelegram = document.getElementById("telegram-share");
const shareFacebook = document.getElementById("facebook-share");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const inviteLink = `${window.location.origin}/index.html?ref=${uid}`;
  inviteLinkEl.textContent = inviteLink;

  // ✅ Copy to Clipboard
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋 Copy Link"), 2000);
    });
  };

  // ✅ Share Buttons
  shareWhatsapp.onclick = () => {
    window.open(`https://wa.me/?text=Join me on EANO & earn crypto: ${inviteLink}`, "_blank");
  };
  shareTelegram.onclick = () => {
    window.open(`https://t.me/share/url?url=${inviteLink}&text=Join me on EANO and start mining`, "_blank");
  };
  shareFacebook.onclick = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${inviteLink}`, "_blank");
  };

  // 🔍 Count referrals
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("referredBy", "==", uid)); // ✅ Note: 'referredBy' not 'referrer'
  const snapshot = await getDocs(q);
  referralCountEl.textContent = `Invited: ${snapshot.size} people`;
});
