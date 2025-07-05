// mine.js

import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMinerStatus } from "./trustLevel.js";

const mineButton = document.getElementById("mineButton");
const countdown = document.getElementById("countdown");
const coinBalance = document.getElementById("coinBalance");
const trustStatus = document.getElementById("trustStatus");
const upgradeLevel = document.getElementById("upgradeLevel");

let countdownInterval;

// Utility: Format milliseconds to hh:mm:ss
function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Start countdown from last mined timestamp
async function startCountdown(uid) {
  const userRef = doc(db, "miners", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastMined = data.lastMined?.toDate();
    const now = new Date();
    const diff = now - lastMined;
    const timeLeft = 24 * 60 * 60 * 1000 - diff;

    if (timeLeft > 0) {
      countdown.textContent = formatCountdown(timeLeft);
      mineButton.disabled = true;
      countdownInterval = setInterval(() => {
        const remaining = new Date(lastMined.getTime() + 86400000) - new Date();
        if (remaining <= 0) {
          clearInterval(countdownInterval);
          countdown.textContent = "00:00:00";
          mineButton.disabled = false;
        } else {
          countdown.textContent = formatCountdown(remaining);
        }
      }, 1000);
    } else {
      countdown.textContent = "00:00:00";
      mineButton.disabled = false;
    }

    updateUI(data.score || 0);
  }
}

// Handle mining
async function mineCoin() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "miners", user.uid);
  const userSnap = await getDoc(userRef);
  const now = new Date();

  let score = 5;
  let minedToday = false;

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastMined = data.lastMined?.toDate();

    if (lastMined && now - lastMined < 86400000) {
      minedToday = true;
    }

    if (minedToday) {
      alert("You have already mined today. Try again later.");
      return;
    }

    score += data.score || 0;
  }

  await setDoc(userRef, {
    uid: user.uid,
    score,
    lastMined: serverTimestamp(),
    email: user.email || null
  }, { merge: true });

  updateUI(score);
  startCountdown(user.uid);
}

// Update miner status & display
function updateUI(score) {
  const { trust, level } = getMinerStatus(score);
  coinBalance.textContent = score;
  trustStatus.textContent = trust;
  upgradeLevel.textContent = level;
}

// Initialize
auth.onAuthStateChanged((user) => {
  if (user) {
    startCountdown(user.uid);
  }
});

mineButton.addEventListener("click", mineCoin);
