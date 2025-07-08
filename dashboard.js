// dashboard.js
import { auth, db } from './auth.js';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  increment
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

let timerInterval;

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
      level: "🐣 Chick",
      status: "active"
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
  const email = data.email;

  updateUserEmailUI(email);
  updateBalanceUI(balance);
  updateReferralCountUI(referralCount);

  const level = getLevelFromBalance(balance);
  const badge = getTrustBadge(trustScore);

  document.getElementById("referral-info").innerHTML += `
    <p><strong>Mining Level:</strong> ${level}</p>
    <p><strong>Trust Score:</strong> ${trustScore} - ${badge}</p>
  `;

  if (lastMine) startTimer(lastMine);

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
      balance: increment(reward),
      lastMine: now.toISOString()
    });

    updateBalanceUI(balance + reward);
    startTimer(now);
    alert(`✅ You mined ${reward} EANO! Come back in 24 hours.`);
  };
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
