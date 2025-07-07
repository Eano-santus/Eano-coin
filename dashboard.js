// dashboard.js
import { auth, db } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const balanceEl = document.getElementById('balance');
const timerEl = document.getElementById('timer');
const mineBtn = document.getElementById('mine-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailEl = document.getElementById('user-email');
const referralCountEl = document.getElementById('referral-count');

let timerInterval;

// Trust badge logic
function getTrustBadge(score) {
  if (score >= 1000) return "🟢 Trusted";
  if (score >= 500) return "🟡 Reliable Miner";
  if (score >= 300) return "🔵 New Miner";
  return "🔴 Low";
}

// Mining level logic
function getLevelFromBalance(balance) {
  if (balance >= 3000) return "🐘 Elephant";
  if (balance >= 2000) return "🦍 Gorilla";
  if (balance >= 1000) return "🦁 Lion";
  if (balance >= 500) return "🦒 Giraffe";
  if (balance >= 250) return "🐺 Wolf";
  if (balance >= 100) return "🐶 Dog";
  if (balance >= 5) return "🐹 Hamster";
  if (balance >= 1) return "🐣 Egg";
  return "🪙 New";
}

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const ref = new URLSearchParams(window.location.search).get('ref');
    const defaultData = {
      balance: 2,
      referralCount: 0,
      lastMine: null,
      referredBy: ref || null,
      trustScore: 0,
      createdAt: serverTimestamp(),
      email: user.email
    };

    await setDoc(userRef, defaultData);

    if (ref) {
      const refUser = doc(db, "users", ref);
      await updateDoc(refUser, {
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

  // Update UI
  emailEl.textContent = `Logged in as: ${user.email}`;
  balanceEl.textContent = balance.toFixed(3);
  referralCountEl.textContent = referralCount;

  // Display mining level and badge
  const level = getLevelFromBalance(balance);
  const badge = getTrustBadge(trustScore);
  document.getElementById("referral-info").innerHTML += `
    <p><strong>Mining Level:</strong> ${level}</p>
    <p><strong>Trust Score:</strong> ${trustScore} - ${badge}</p>
  `;

  if (lastMine) {
    startTimer(lastMine);
  }

  // Mining
  mineBtn.onclick = async () => {
    const now = new Date();
    if (lastMine && now - lastMine < 24 * 60 * 60 * 1000) {
      const remaining = 24 * 60 * 60 * 1000 - (now - lastMine);
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      alert(`Please wait ${hrs}h ${mins}m before mining again.`);
      return;
    }

    const reward = 1.0;
    await updateDoc(userRef, {
      balance: balance + reward,
      lastMine: now.toISOString()
    });

    balanceEl.textContent = (balance + reward).toFixed(3);
    startTimer(now);
    alert(`✅ You mined ${reward} EANO! Come back in 24 hours.`);
  };
});

// Logout
logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
};

// Timer
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
