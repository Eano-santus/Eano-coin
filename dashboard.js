// dashboard.js
import { auth, db } from './auth.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  updateBalanceUI,
  updateReferralCountUI,
  updateUserEmailUI,
  getLevelFromBalance,
  getTrustBadge
} from './ui.js';

const balanceEl = document.getElementById('balance');
const timerEl = document.getElementById('timer');
const mineBtn = document.getElementById('mine-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailEl = document.getElementById('user-email');
const referralCountEl = document.getElementById('referral-count');
const announcementBox = document.getElementById('announcement-box');
const announcementText = document.getElementById('latest-announcement');

let timerInterval;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  let userSnap = await getDoc(userRef);

  // Create fallback user if missing
  if (!userSnap.exists()) {
    const ref = new URLSearchParams(window.location.search).get('ref');
    const fallbackData = {
      uid: user.uid,
      email: user.email,
      username: "",
      firstname: "",
      lastname: "",
      balance: 2,
      trustScore: 0,
      referralCount: 0,
      referrals: [],
      referredBy: ref || null,
      lastMine: null,
      createdAt: serverTimestamp(),
      level: "🐥 Chicken",
      status: "active"
    };
    await setDoc(userRef, fallbackData);

    if (ref) {
      const refUserRef = doc(db, "users", ref);
      await updateDoc(refUserRef, {
        balance: increment(2),
        referralCount: increment(1),
        trustScore: increment(50)
      });
    }

    userSnap = await getDoc(userRef);
  }

  const data = userSnap.data();
  const balance = data.balance || 0;
  const lastMine = data.lastMine ? new Date(data.lastMine) : null;
  const referralCount = data.referralCount || 0;
  const trustScore = data.trustScore || 0;
  const email = data.email;

  updateUserEmailUI(email);
  updateBalanceUI(balance);
  updateReferralCountUI(referralCount);

  const level = getLevelFromBalance(balance);
  const badge = getTrustBadge(trustScore);

  document.getElementById("referral-info").innerHTML += `
    <p><strong>Mining Level:</strong> ${level}</p>
    <p><strong>Trust Score:</strong> ${trustScore} – ${badge}</p>
  `;

  if (lastMine) startTimer(lastMine);

  mineBtn.onclick = async () => {
    const now = new Date();
    if (lastMine && now - lastMine < 24 * 60 * 60 * 1000) {
      const remaining = 24 * 60 * 60 * 1000 - (now - lastMine);
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      alert(`⏳ Wait ${hrs}h ${mins}m to mine again.`);
      return;
    }

    const reward = 1;
    await updateDoc(userRef, {
      balance: increment(reward),
      lastMine: now.toISOString()
    });

    updateBalanceUI(balance + reward);
    startTimer(now);
    alert(`✅ You mined ${reward} EANO! Come back in 24 hours.`);
  };
  
    // 🌙 Dark Mode Toggle
const darkToggle = document.getElementById("dark-toggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Optional: persist user preference
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", isDark ? "on" : "off");
  });

  // Apply saved preference
  if (localStorage.getItem("dark-mode") === "on") {
    document.body.classList.add("dark-mode");
  }
  
  // Fetch Announcement
  try {
    const annDoc = await getDoc(doc(db, "announcements", "latest"));
    if (annDoc.exists() && annDoc.data().message) {
      announcementText.textContent = annDoc.data().message;
      announcementBox.style.display = 'block';
    } else {
      announcementBox.style.display = 'none';
    }
  } catch (e) {
    console.error("Announcement error:", e);
    announcementBox.style.display = 'none';
  }
});

logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
};

function startTimer(lastMineTime) {
  clearInterval(timerInterval);
  const nextTime = new Date(lastMineTime.getTime() + 24 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date();
    const diff = nextTime - now;

    if (diff <= 0) {
      timerEl.textContent = "✅ Ready to mine!";
      clearInterval(timerInterval);
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timerEl.textContent = `⏳ ${h}h ${m}m ${s}s`;
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  }
