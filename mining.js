// mining.js

import { db, auth } from './firebase-config.js';
import {
  doc, getDoc, setDoc, updateDoc, collection, getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

let countdownInterval;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    let userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const referralCode = generateReferralCode();
      const referredBy = localStorage.getItem("referredBy");
      await setDoc(userRef, {
        username: user.email.split('@')[0],
        coinBalance: 0,
        lastMined: 0,
        trustScore: 5,
        referralCode,
        referredBy,
        isAdmin: false
      });

      if (referredBy) {
        const allUsers = await getDocs(collection(db, "users"));
        allUsers.forEach(async docSnap => {
          const data = docSnap.data();
          if (data.referralCode === referredBy) {
            await updateDoc(doc(db, "users", docSnap.id), {
              trustScore: (data.trustScore || 0) + 5
            });
          }
        });
      }

      userDoc = await getDoc(userRef);
    }

    const userData = userDoc.data();
    document.getElementById("username").textContent = userData.username || "Miner";
    document.getElementById("trustScore").textContent = userData.trustScore || 0;
    document.getElementById("referralCode").textContent = userData.referralCode || "N/A";
    document.getElementById("coinBalance").textContent = userData.coinBalance || 0;
    document.getElementById("referredBy").textContent = userData.referredBy || "None";

    showUpgradeLevel(userData.trustScore);

    if (userData.isAdmin) {
      document.getElementById("adminPanel").style.display = "block";
    }

    setupMining(userRef, userData);
    showLeaderboard();
    syncOfflineMining(userRef, userData);
  } else {
    window.location.href = "login.html";
  }
});

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function calculateEarnings(trustScore) {
  if (trustScore >= 500) return 5;
  if (trustScore >= 200) return 3;
  if (trustScore >= 80) return 2;
  return 1;
}

function showUpgradeLevel(score) {
  let level = "Newbie";
  if (score >= 10000) level = "Leader";
  else if (score >= 5000) level = "Master";
  else if (score >= 1000) level = "Professional";
  else if (score >= 500) level = "Elite";
  else if (score >= 50) level = "Amateur";

  document.getElementById("upgradeLevel").textContent = level;
}

function setupMining(userRef, userData) {
  const mineBtn = document.getElementById("mineButton");

  const now = Date.now();
  const lastMined = userData.lastMined || 0;
  const cooldown = 86400000; // 24 hours

  if (now - lastMined >= cooldown) {
    mineBtn.disabled = false;
    mineBtn.textContent = "Mine Now";
  } else {
    mineBtn.disabled = true;
    const timeLeft = cooldown - (now - lastMined);
    startCountdown(timeLeft);
  }

  mineBtn.addEventListener("click", async () => {
    const latestSnap = await getDoc(userRef);
    const user = latestSnap.data();
    const now = Date.now();

    if (now - (user.lastMined || 0) < cooldown) return;

    const earned = calculateEarnings(user.trustScore);
    await updateDoc(userRef, {
      coinBalance: (user.coinBalance || 0) + earned,
      lastMined: now
    });

    mineBtn.disabled = true;
    startCountdown(cooldown);
    document.getElementById("coinBalance").textContent = (user.coinBalance || 0) + earned;
    console.log(`Mined ${earned} EANO successfully.`);
  });
}

function startCountdown(msLeft) {
  const mineBtn = document.getElementById("mineButton");
  let endTime = Date.now() + msLeft;

  countdownInterval = setInterval(() => {
    const now = Date.now();
    let diff = endTime - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      mineBtn.disabled = false;
      mineBtn.textContent = "Mine Now";
      return;
    }

    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    mineBtn.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

async function syncOfflineMining(userRef, userData) {
  const offlineMines = JSON.parse(localStorage.getItem("offlineMines") || "[]");
  if (!offlineMines.length || !navigator.onLine) return;

  const now = Date.now();
  const lastMined = userData.lastMined || 0;
  const cooldown = 86400000;

  if (now - lastMined < cooldown) return;

  const earned = calculateEarnings(userData.trustScore || 0);
  await updateDoc(userRef, {
    coinBalance: (userData.coinBalance || 0) + earned,
    lastMined: now
  });

  console.log(`Synced offline mining: +${earned} coins`);
  localStorage.removeItem("offlineMines");
}

window.addEventListener('offline', () => {
  console.warn("Offline. Queuing mining...");
});

window.addEventListener('online', async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  syncOfflineMining(userRef, userSnap.data());
});

document.getElementById("mineButton").addEventListener("click", () => {
  if (!navigator.onLine) {
    const queue = JSON.parse(localStorage.getItem("offlineMines") || "[]");
    queue.push({ timestamp: Date.now() });
    localStorage.setItem("offlineMines", JSON.stringify(queue));
    alert("You're offline. Mining has been queued.");
  }
});

document.getElementById("logout").addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

async function showLeaderboard() {
  const snapshot = await getDocs(collection(db, "users"));
  let users = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    users.push({ username: data.username, coinBalance: data.coinBalance || 0 });
  });

  users.sort((a, b) => b.coinBalance - a.coinBalance);
  const top5 = users.slice(0, 5);

  const leaderboard = document.getElementById("leaderboardList");
  leaderboard.innerHTML = top5.map((u, i) =>
    `<li>#${i + 1} - ${u.username} (${u.coinBalance} coins)</li>`
  ).join("");
}
