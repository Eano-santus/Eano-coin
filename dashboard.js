// dashboard.js (Final Updated Version)

import { auth, db } from "./firebase.js"; import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; import { updateBalanceUI, updateTimerUI, updateReferralCountUI, getLevelFromBalance, getTrustBadge, showAnnouncement, } from "./ui.js"; import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let miningRatePerHour = 0.6; const miningInterval = 24 * 60 * 60 * 1000; // 24 hours

// Get user and setup dashboard onAuthStateChanged(auth, async (user) => { if (!user) return (window.location.href = "index.html");

const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef); if (!snap.exists()) return;

const data = snap.data(); const balance = data.balance || 0; const lastMine = data.lastMine?.toMillis?.() || 0; const now = Date.now(); const canMine = now - lastMine >= miningInterval;

updateBalanceUI(balance); updateReferralCount(user.uid); updateMiningLevel(balance); updateTrustBadge(data.trustScore || 0);

if (!canMine) { const remaining = Math.floor((miningInterval - (now - lastMine)) / 1000); updateTimerUI(remaining); startTimer(remaining); disableMiningButton(); }

fetchAnnouncement(); });

// 🧠 Start Mining const mineBtn = document.getElementById("mine-btn"); mineBtn?.addEventListener("click", async () => { const user = auth.currentUser; if (!user) return;

const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef); if (!snap.exists()) return;

const data = snap.data(); const lastMine = data.lastMine?.toMillis?.() || 0; const now = Date.now(); if (now - lastMine < miningInterval) return;

const newBalance = (data.balance || 0) + miningRatePerHour; const newTrust = (data.trustScore || 0) + 1;

await updateDoc(userRef, { balance: newBalance, trustScore: newTrust, lastMine: serverTimestamp(), });

updateBalanceUI(newBalance); updateTrustBadge(newTrust); updateMiningLevel(newBalance); startTimer(miningInterval / 1000); disableMiningButton(); });

// 🧮 Countdown Timer function startTimer(seconds) { let remaining = seconds; const interval = setInterval(() => { if (remaining <= 0) return clearInterval(interval); updateTimerUI(remaining); remaining--; }, 1000); }

function disableMiningButton() { mineBtn.disabled = true; mineBtn.textContent = "⏳ Come back in 24h"; }

function updateMiningLevel(balance) { const el = document.getElementById("level"); if (el) el.textContent = getLevelFromBalance(balance); }

function updateTrustBadge(score) { const badgeEl = document.getElementById("trust-badge"); const scoreEl = document.getElementById("trust-score"); if (badgeEl && scoreEl) { badgeEl.textContent = getTrustBadge(score); scoreEl.textContent = score; } }

async function updateReferralCount(uid) { const usersRef = collection(db, "users"); const q = query(usersRef, where("referrer", "==", uid)); const snapshot = await getDocs(q); updateReferralCountUI(snapshot.size); }

// 🔔 Announcement async function fetchAnnouncement() { try { const docRef = doc(db, "config", "announcement"); const snap = await getDoc(docRef); if (snap.exists()) { const data = snap.data(); showAnnouncement(data.message); } } catch (err) { console.error("Announcement fetch error:", err); } }

// 🔓 Logout const logoutBtn = document.getElementById("logout-btn"); logoutBtn?.addEventListener("click", async () => { await signOut(auth); window.location.href = "index.html"; });

