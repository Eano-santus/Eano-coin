// mine.js

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMinerStatus } from "./trustLevel.js";

// DOM elements
const mineButton = document.getElementById("mineButton");
const countdown = document.getElementById("countdown");
const scoreDisplay = document.getElementById("score");
const trustStatus = document.getElementById("trustScore");
const upgradeLevel = document.getElementById("minerLevel");
const referralCode = document.getElementById("codeDisplay");
const referralLink = document.getElementById("linkDisplay");

let countdownInterval;

// Format milliseconds to hh:mm:ss
function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

// Countdown logic
async function startCountdown(uid) {
  const userRef = doc(db, "miners", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    const lastMined = data.lastMined?.toDate();
    const now = new Date();
    const diff = now - lastMined;
    const timeLeft = 24 * 60 * 60 * 1000 - diff + 1000;

    if (timeLeft > 0) {
      countdown.textContent = formatCountdown(timeLeft);
      mineButton.disabled = true;

      countdownInterval = setInterval(() => {
        const remaining = new Date(lastMined.getTime() + 86400000 + 1000) - new Date();
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

    updateUI(uid, data.score || 0, data.referralCode || "");
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
  let referral = "";

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
    referral = data.referralCode || "";
  }

  // Save updated mining data
  await setDoc(
    userRef,
    {
      uid: user.uid,
      score,
      lastMined: serverTimestamp(),
      email: user.email || null,
    },
    { merge: true }
  );

  updateUI(user.uid, score, referral);
  startCountdown(user.uid);
}

// Update UI with score, trust level, and miner level
function updateUI(uid, score, referral) {
  const { trust, level } = getMinerStatus(score);
  scoreDisplay.textContent = `Your Score: ${score}`;
  trustStatus.textContent = `Trust Status: ${trust}`;
  upgradeLevel.textContent = `Miner Level: ${level}`;

  const userReferralCode = uid.slice(0, 6); // OR store referralCode in DB
  referralCode.textContent = userReferralCode;
  referralLink.href = `${window.location.origin}/signup.html?ref=${userReferralCode}`;
  referralLink.textContent = referralLink.href;
}

// Initialize on login
auth.onAuthStateChanged((user) => {
  if (user) {
    startCountdown(user.uid);
  } else {
    // Redirect if not logged in
    window.location.href = "login.html";
  }
});

// Mine button action
mineButton.addEventListener("click", mineCoin);
