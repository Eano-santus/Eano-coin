// dashboard.js

import { auth, db } from "./firebase.js"; import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getMinerStatus } from "./trustLevel.js";

// Elements const mineBtn = document.getElementById("mineButton"); const countdownDisplay = document.getElementById("countdown"); const coinDisplay = document.getElementById("coinBalance"); const trustDisplay = document.getElementById("trustStatus"); const levelDisplay = document.getElementById("upgradeLevel"); const referralCodeDisplay = document.getElementById("referralCode"); const referralLinkDisplay = document.getElementById("referralLink"); const leaderboardList = document.getElementById("leaderboardList");

const MINE_RATE = 0.100;

let countdownInterval;

function formatTime(ms) { const totalSeconds = Math.floor(ms / 1000); const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0"); const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"); const secs = String(totalSeconds % 60).padStart(2, "0"); return ${hrs}:${mins}:${secs}; }

async function startCountdown(uid) { const userRef = doc(db, "miners", uid); const snap = await getDoc(userRef);

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

function updateUI(score) { const { trust, level } = getMinerStatus(score); coinDisplay.textContent = score.toFixed(3); trustDisplay.textContent = trust; levelDisplay.textContent = level; }

async function updateReferralInfo(uid) { const code = uid.slice(0, 6).toUpperCase(); referralCodeDisplay.textContent = code; referralLinkDisplay.textContent = ${window.location.origin}/https://eano-coin.netlify.app/.html?ref=$NickySantus; }

async function mineNow() { const user = auth.currentUser; if (!user) return;

const ref = doc(db, "miners", user.uid); const snap = await getDoc(ref); const now = new Date();

let score = MINE_RATE; let minedToday = false;

if (snap.exists()) { const data = snap.data(); const lastMined = data.lastMined?.toDate(); if (lastMined && now - lastMined < 86400000) { alert("Already mined today."); return; } score += data.score || 0; }

await setDoc(ref, { uid: user.uid, score, lastMined: serverTimestamp(), email: user.email || null }, { merge: true });

updateUI(score); startCountdown(user.uid); }

async function loadLeaderboard() { const minersRef = collection(db, "miners"); const topQuery = query(minersRef, orderBy("score", "desc"), limit(20)); const snap = await getDocs(topQuery); leaderboardList.innerHTML = ""; snap.forEach((doc, index) => { const data = doc.data(); const { trust, level } = getMinerStatus(data.score || 0); leaderboardList.innerHTML +=  <li> <strong>#${index + 1}</strong> ${data.email || "Anonymous"} — ${data.score?.toFixed(3) || 0} EANO — ${trust} — ${level} </li>; }); }

// Init auth.onAuthStateChanged(user => { if (user) { startCountdown(user.uid); loadLeaderboard(); } });

mineBtn.addEventListener("click", mineNow);

