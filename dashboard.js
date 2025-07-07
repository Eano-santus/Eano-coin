// dashboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

const balanceEl = document.getElementById("balance"); const timerEl = document.getElementById("timer"); const logoutBtn = document.getElementById("logout-btn"); const mineBtn = document.getElementById("mine-btn"); const userEmailEl = document.getElementById("user-email");

let timerInterval = null;

onAuthStateChanged(auth, async (user) => { if (!user) return (window.location.href = "index.html");

userEmailEl.textContent = user.email; const userRef = doc(db, "users", user.uid); let snap = await getDoc(userRef);

if (!snap.exists()) { const ref = new URLSearchParams(window.location.search).get("ref") || null; await setDoc(userRef, { balance: 2, lastMine: null, email: user.email, trustScore: 0, referrer: ref, username: user.displayName || "New Miner" });

if (ref) {
  const refDoc = doc(db, "users", ref);
  const refSnap = await getDoc(refDoc);
  if (refSnap.exists()) {
    await updateDoc(refDoc, {
      balance: (refSnap.data().balance || 0) + 2
    });
  }
}
snap = await getDoc(userRef);

}

const data = snap.data(); updateUI(data);

if (data.lastMine) startTimer(new Date(data.lastMine));

mineBtn.onclick = async () => { const now = new Date(); const last = data.lastMine ? new Date(data.lastMine) : null; const canMine = !last || (now - last >= 86400000);

if (!canMine) return alert("You can mine once every 24 hours.");

const newBal = (data.balance || 0) + 0.001;
const newTrust = (data.trustScore || 0) + 1;

await updateDoc(userRef, {
  balance: newBal,
  trustScore: newTrust,
  lastMine: now.toISOString()
});

updateUI({ balance: newBal });
startTimer(now);
alert("⛏️ +0.001 EANO mined. Trust +1!");

}; });

function updateUI(data) { if (balanceEl) balanceEl.textContent = (data.balance || 0).toFixed(3); }

function startTimer(startTime) { clearInterval(timerInterval); const nextMine = new Date(startTime.getTime() + 86400000);

function tick() { const now = new Date(); const remaining = nextMine - now; if (remaining <= 0) { clearInterval(timerInterval); timerEl.textContent = "⛏ Ready to mine!"; return; } const h = Math.floor(remaining / 3600000); const m = Math.floor((remaining % 3600000) / 60000); const s = Math.floor((remaining % 60000) / 1000); timerEl.textContent = ${h}h ${m}m ${s}s; }

tick(); timerInterval = setInterval(tick, 1000); }

if (logoutBtn) { logoutBtn.onclick = () => { signOut(auth).then(() => (window.location.href = "index.html")); }; }

