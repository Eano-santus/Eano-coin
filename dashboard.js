// dashboard.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const MINE_RATE = 0.600; // EANO per hour
const MINE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

const balanceDisplay = document.getElementById("balance");
const miningStatus = document.getElementById("mining-status");
const userStats = document.getElementById("user-stats");

function updateUserStats(data) {
  const score = data.score || 0;
  const trustScore = data.trustScore || 0;
  const active = data.miningEnd && Date.now() < data.miningEnd;

  // Score Level (Mining Level)
  let level = '🐥 Chicken';
  if (score >= 10000) level = '🐉 Dragon';
  else if (score >= 5000) level = '🐘 Elephant';
  else if (score >= 2500) level = '🦍 Gorilla';
  else if (score >= 1200) level = '🐻 Bear';
  else if (score >= 600) level = '🐯 Lion';
  else if (score >= 300) level = '🐼 Panda';
  else if (score >= 150) level = '🐺 Wolf';
  else if (score >= 50) level = '🐹 Hamster';

  // TrustScore Badge
  let trustBadge = '<span class="trust-badge red">🔴 Low Trust</span>';
  if (trustScore >= 5000) trustBadge = '<span class="trust-badge OG">O.G</span>';
  else if (trustScore >= 1000) trustBadge = '<span class="trust-badge green">🟢 Trusted Miner</span>';
  else if (trustScore >= 500) trustBadge = '<span class="trust-badge yellow">🟡 Reliable Miner</span>';
  else if (trustScore >= 300) trustBadge = '<span class="trust-badge blue">🔵 New Miner</span>';

  userStats.innerHTML = `
    <p>Active: <strong>${active ? "✅ Yes" : "❌ No"}</strong></p>
    <p>Score Level: <strong>${level}</strong></p>
    <p>Trust Score: ${trustScore} ${trustBadge}</p>
  `;
}

async function startMiningSession(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  const now = Date.now();
  const data = snap.exists() ? snap.data() : {};

  // If expired or new, start fresh mining session
  if (!data.miningEnd || now >= data.miningEnd) {
    const newEnd = now + MINE_DURATION;
    await setDoc(userRef, {
      balance: data.balance || 0,
      miningStart: now,
      miningEnd: newEnd,
      lastUpdate: now,
      score: data.score || 0,
      trustScore: data.trustScore || 0
    }, { merge: true });
  }

  updateUserStats(data);
  runMining(userId);
}

function runMining(userId) {
  const userRef = doc(db, "users", userId);

  setInterval(async () => {
    const snap = await getDoc(userRef);
    const data = snap.data();
    const now = Date.now();

    if (!data || now >= data.miningEnd) {
      miningStatus.textContent = "⛏️ Mining session ended.";
      return;
    }

    const lastUpdate = data.lastUpdate || now;
    const earned = ((now - lastUpdate) / 3600000) * MINE_RATE;
    const newBalance = (data.balance || 0) + earned;

    await updateDoc(userRef, {
      balance: newBalance,
      lastUpdate: now
    });

    miningStatus.textContent = `⛏️ Mining... +${earned.toFixed(3)} EANO`;
    balanceDisplay.textContent = newBalance.toFixed(3);
    document.getElementById("balance-display").textContent = `Balance: ${newBalance.toFixed(3)} EANO`;

    // Also update user stats in case mining end changes
    updateUserStats(data);
  }, 60000); // update every 1 minute
}

function initThemeToggle() {
  const btn = document.getElementById("toggle-theme");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }
}

function initLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
}

// ✅ Init on Auth Load
onAuthStateChanged(auth, (user) => {
  if (user) {
    startMiningSession(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

// ✅ DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initLogout();
});
