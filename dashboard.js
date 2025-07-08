// dashboard.js
import { auth, db } from './auth.js';
import {
  doc,
  getDoc,
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
const darkToggle = document.getElementById('dark-toggle');
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const levelEl = document.getElementById('level');
const trustScoreEl = document.getElementById('trust-score');
const trustBadgeEl = document.getElementById('trust-badge');

let timerInterval;

// 🔐 Auth State Check
auth.onAuthStateChanged(async (user) => {
  if (!user) return (window.location.href = 'index.html');

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const balance = data.balance || 0;
  const trustScore = data.trustScore || 0;
  const lastMine = data.lastMine ? new Date(data.lastMine) : null;

  updateUserEmailUI(data.email);
  updateBalanceUI(balance);
  updateReferralCountUI(data.referralCount || 0);

  levelEl.textContent = getLevelFromBalance(balance);
  trustScoreEl.textContent = trustScore;
  trustBadgeEl.textContent = getTrustBadge(trustScore);

  if (lastMine) startTimer(lastMine);

  // ⛏ Mining Logic
  mineBtn.onclick = async () => {
    const now = new Date();
    if (lastMine && now - lastMine < 24 * 60 * 60 * 1000) {
      const remaining = 24 * 60 * 60 * 1000 - (now - lastMine);
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      return alert(`⏳ Wait ${hrs}h ${mins}m to mine again.`);
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

  // 🌗 Dark Mode Toggle
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      document.body.classList.remove("light-mode");

      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // Load preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
    if (savedTheme === "light") document.body.classList.add("light-mode");
  }

  // 📣 Fetch Announcement
  try {
    const annDoc = await getDoc(doc(db, "announcements", "latest"));
    if (annDoc.exists()) {
      announcementText.textContent = annDoc.data().message || "";
      announcementBox.style.display = 'block';
    } else {
      announcementBox.style.display = 'none';
    }
  } catch (err) {
    console.error("Announcement error:", err);
    announcementBox.style.display = 'none';
  }

  // ☰ Menu Toggle
  menuToggle?.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  // 🚪 Logout
  logoutBtn?.addEventListener("click", async () => {
    await auth.signOut();
    window.location.href = "index.html";
  });
});

// ⏰ Timer Setup
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
