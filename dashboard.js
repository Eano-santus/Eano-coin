// dashboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

const balanceDisplay = document.getElementById("balance"); const timerDisplay = document.getElementById("timer"); const mineBtn = document.getElementById("mine-btn"); const logoutBtn = document.getElementById("logout-btn");

let timerInterval;

onAuthStateChanged(auth, async (user) => { if (!user) return (window.location.href = "index.html");

const userRef = doc(db, "users", user.uid); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) { await setDoc(userRef, { balance: 0, lastMine: null, email: user.email }); }

const userData = (await getDoc(userRef)).data(); balanceDisplay.textContent = userData.balance.toFixed(3);

if (userData.lastMine) { startTimer(new Date(userData.lastMine)); }

mineBtn.addEventListener("click", async () => { const now = new Date(); const lastMine = userData.lastMine ? new Date(userData.lastMine) : null;

if (lastMine && now - lastMine < 86400000) {
  alert("⛏ You can mine only once every 24 hours.");
  return;
}

const reward = 0.001;
const newBalance = userData.balance + reward;

await updateDoc(userRef, {
  balance: newBalance,
  lastMine: now.toISOString()
});

balanceDisplay.textContent = newBalance.toFixed(3);
startTimer(now);
alert(`✅ Mined ${reward} EANO successfully!`);

});

logoutBtn.addEventListener("click", () => { signOut(auth).then(() => { window.location.href = "index.html"; }); }); });

function startTimer(startTime) { clearInterval(timerInterval); const endTime = new Date(startTime.getTime() + 86400000);

function updateTimer() { const now = new Date(); const diff = endTime - now;

if (diff <= 0) {
  timerDisplay.textContent = "⛏ Ready to mine again!";
  clearInterval(timerInterval);
  return;
}

const h = Math.floor(diff / 3600000);
const m = Math.floor((diff % 3600000) / 60000);
const s = Math.floor((diff % 60000) / 1000);

timerDisplay.textContent = `Next mining in: ${h}h ${m}m ${s}s`;

}

updateTimer(); timerInterval = setInterval(updateTimer, 1000); }

