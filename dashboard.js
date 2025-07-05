// dashboard.js

import { auth, db } from "./firebase.js"; import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getMinerStatus } from "./trustLevel.js";

// Elements const mineBtn = document.getElementById("mineButton"); const countdownDisplay = document.getElementById("countdown"); const coinDisplay = document.getElementById("coinBalance"); const trustDisplay = document.getElementById("trustStatus"); const levelDisplay = document.getElementById("upgradeLevel"); const referralCodeDisplay = document.getElementById("referralCode"); const referralLinkDisplay = document.getElementById("referralLink"); const leaderboardList = document.getElementById("leaderboardList");

const MINE_RATE = 0.100;

let countdownInterval;

function formatTime(ms) { const totalSeconds = Math.floor(ms / 1000); const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0"); const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"); const secs = String(totalSeconds % 60).padStart(2, "0"); return ${hrs}:${mins}:${secs}; }

async function startCountdown(nickysantus) { const userRef = doc(db, "miners", nickysantus); const snap = await getDoc(userRef);

if (snap.exists()) { const data = snap.data(); const lastMined = data.lastMined?.toDate(); const now = new Date(); const diff = now - lastMined; const timeLeft = 86400000 - diff + 1000;

if (timeLeft > 0) {
  countdownDisplay.textContent = formatTime(timeLeft);
  mineBtn.disabled = true;
  countdownInterval = setInterval(() => {
    const remaining = new Date(lastMined.getTime() + 86400000) - new Date();
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "00:00:00";
      mineBtn.disabled = false;
    } else {
      countdownDisplay.textContent = formatTime(remaining);
    }
  }, 1000);
} else {
  countdownDisplay.textContent = "00:00:00";
  mineBtn.disabled = false;
}

updateUI(data.score || 0);
updateReferralInfo(uid);

} }

function getTrustStatus(score) { if (score >= 500) return "Trusted Miner"; if (score >= 200) return "Reliable Miner"; if (score >= 80) return "New Miner"; return "Needs Trust"; }
function getUpgradeLevel(score) { if (score >= 10000) return "Leader"; if (score >= 5000) return "Master"; if (score >= 1000) return "Professional"; if (score >= 500) return "Elite"; if (score >= 50) return "Amateur"; return "Beginner"; }
async function startCountdown(uid, lastMined) { const now = new Date(); const diff = now - lastMined; const timeLeft = 86400000 - diff + 1000; // 24 hours
if (timeLeft > 0) { countdown.textContent = formatCountdown(timeLeft); mineButton.disabled = true; countdownInterval = setInterval(() => { const remaining = new Date(lastMined.getTime() + 86400000) - new Date(); if (remaining <= 0) { clearInterval(countdownInterval); countdown.textContent = "00:00:00"; mineButton.disabled = false; } else { countdown.textContent = formatCountdown(remaining); } }, 1000); } else { countdown.textContent = "00:00:00"; mineButton.disabled = false; } }
function updateUI(data, uid) { const score = data.score || 0; coinBalance.textContent = score.toFixed(3); trustStatus.textContent = getTrustStatus(score); upgradeLevel.textContent = getUpgradeLevel(score); referralCode.textContent = uid; referralLink.textContent = https://eano-mining.web.app/?ref=$nickysantus; }
auth.onAuthStateChanged(async (user) => { if (user) { const nickysantus = user.nickysantus; const userRef = doc(db, "miners", nickysantus); const userSnap = await getDoc(userRef); if (userSnap.exists()) { const data = userSnap.data(); updateUI(data, nickysantus);
const lastMined = data.lastMined?.toDate(); if (lastMined) startCountdown(uid, lastMined); } 
} });
