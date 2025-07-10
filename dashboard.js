// dashboard.js
import {
  auth,
  db
} from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  updateBalanceUI,
  updateTimerUI,
  updateUserEmailUI,
  updateReferralCountUI,
  getLevelFromBalance,
  getTrustBadge,
  showAnnouncement
} from "./ui.js";

// ✅ Constants
const MINE_RATE = 0.6; // EANO per hour

// ✅ Mining elements
const mineBtn = document.getElementById("mine-btn");
const logoutBtn = document.getElementById("logout-btn");
const referralEl = document.getElementById("referral-count");
const levelEl = document.getElementById("mining-level");
const trustEl = document.getElementById("trust-score");

// ✅ Check login state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("⚠ User not found.");
    await signOut(auth);
    window.location.href = "index.html";
    return;
  }

  const userData = snap.data();
  const balance = userData.balance || 0;
  const referrals = userData.referralCount || 0;
  const trust = userData.trustScore || 0;
  const lastMine = userData.lastMine?.toMillis?.() || 0;

  updateUserEmailUI(user.email);
  updateBalanceUI(balance);
  updateReferralCountUI(referrals);
  levelEl.textContent = getLevelFromBalance(balance);
  trustEl.textContent = `${trust} - ${getTrustBadge(trust)}`;

  // Countdown Logic
  const now = Date.now();
  const secondsSinceMine = Math.floor((now - lastMine) / 1000);
  const remaining = Math.max(86400 - secondsSinceMine, 0);
  updateTimerUI(remaining);

  if (remaining > 0) {
    mineBtn.disabled = true;
    mineBtn.textContent = "⏳ Come Back Later";
    let timer = setInterval(() => {
      const seconds = Math.max(0, Math.floor((86400 - (Date.now() - lastMine) / 1000)));
      updateTimerUI(seconds);
      if (seconds <= 0) {
        mineBtn.disabled = false;
        mineBtn.textContent = "⚡ Start Mining";
        clearInterval(timer);
      }
    }, 1000);
  } else {
    mineBtn.disabled = false;
    mineBtn.textContent = "⚡ Start Mining";
  }

  // Announcement (optional Firestore doc)
  const announceRef = doc(db, "config", "announcement");
  const annSnap = await getDoc(announceRef);
  if (annSnap.exists()) {
    showAnnouncement(annSnap.data().message || "");
  }
});

// ✅ Mining click
if (mineBtn) {
  mineBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const userData = snap.data();
    const lastMine = userData.lastMine?.toMillis?.() || 0;
    const now = Date.now();
    const canMine = now - lastMine >= 86400 * 1000;

    if (!canMine) {
      alert("⛏ You can only mine once every 24 hours.");
      return;
    }

    const newBalance = (userData.balance || 0) + MINE_RATE * 24;

    await updateDoc(userRef, {
      balance: newBalance,
      lastMine: serverTimestamp()
    });

    updateBalanceUI(newBalance);
    levelEl.textContent = getLevelFromBalance(newBalance);
    mineBtn.disabled = true;
    mineBtn.textContent = "⛏ Mined!";
  });
}

// ✅ Logout button
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
      }
