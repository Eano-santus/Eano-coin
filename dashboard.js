// dashboard.js import { auth, db } from "./firebase.js"; import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const MINE_RATE = 0.6; const MINE_DURATION = 24 * 60 * 60 * 1000;

function updateUI(data) { const balance = data.balance?.toFixed(3) || "0.000"; const trustScore = data.trustScore || 0; const score = data.score || 0;

let level = "🐥 Chicken"; if (score >= 10000) level = "🐉 Dragon"; else if (score >= 5000) level = "🐘 Elephant"; else if (score >= 2500) level = "🦍 Gorilla"; else if (score >= 1200) level = "🐻 Bear"; else if (score >= 600) level = "🐯 Lion"; else if (score >= 300) level = "🐼 Panda"; else if (score >= 150) level = "🐺 Wolf"; else if (score >= 50) level = "🐹 Hamster";

let trust = "🔴 Low Trust"; if (trustScore >= 5000) trust = "🌟 O.G"; else if (trustScore >= 1000) trust = "🟢 Trusted Miner"; else if (trustScore >= 500) trust = "🟡 Reliable Miner"; else if (trustScore >= 300) trust = "🔵 New Miner";

document.getElementById("balance").textContent = balance; document.getElementById("balance-display").textContent = Balance: ${balance} EANO; document.getElementById("mining-status").textContent = ✅ Active: ${level} • ${trust}; }

async function startMiningSession(userId) { const userRef = doc(db, "users", userId); const snap = await getDoc(userRef); const now = Date.now(); const data = snap.exists() ? snap.data() : {};

if (!data.miningEnd || now >= data.miningEnd) { const newEnd = now + MINE_DURATION; await setDoc(userRef, { balance: data.balance || 0, miningStart: now, miningEnd: newEnd, lastUpdate: now, score: data.score || 0, trustScore: data.trustScore || 0 }, { merge: true }); }

runMining(userId); }

function runMining(userId) { const userRef = doc(db, "users", userId); setInterval(async () => { const snap = await getDoc(userRef); const data = snap.data(); const now = Date.now();

if (!data || now >= data.miningEnd) {
  document.getElementById("mining-status").textContent = "⛏️ Mining ended.";
  return;
}

const earned = ((now - (data.lastUpdate || now)) / 3600000) * MINE_RATE;
const newBalance = (data.balance || 0) + earned;

await updateDoc(userRef, {
  balance: newBalance,
  lastUpdate: now
});

updateUI({ ...data, balance: newBalance });

}, 60000); }

function setupThemeToggle() { const toggle = document.getElementById("toggle-theme"); if (toggle) { toggle.addEventListener("click", () => { document.body.classList.toggle("light-mode"); }); } }

function setupLogout() { const logoutBtn = document.querySelector(".btn-danger"); if (logoutBtn) { logoutBtn.addEventListener("click", async () => { await signOut(auth); localStorage.clear(); window.location.href = "index.html"; }); } }

onAuthStateChanged(auth, async (user) => { if (user) { await startMiningSession(user.uid); } else { window.location.href = "index.html"; } });

setupThemeToggle(); setupLogout();

