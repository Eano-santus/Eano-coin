// invite.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// DOM Elements
const inviteLinkEl = document.getElementById("invite-link");
const copyBtn = document.getElementById("copy-link");
const referralCountEl = document.getElementById("referral-count");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;

  // Generate and show invite link
  const inviteLink = `${window.location.origin}/index.html?ref=${uid}`;
  inviteLinkEl.textContent = inviteLink;

  // Copy logic
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋 Copy Link"), 2000);
    });
  };

  // Query referred users
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("referredBy", "==", uid));
  const snapshot = await getDocs(q);
  referralCountEl.textContent = `You have invited: ${snapshot.size} people`;
});
