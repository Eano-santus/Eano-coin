// dashboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

let timerInterval;

onAuthStateChanged(auth, async (user) => { if (!user) { window.location.href = "index.html"; return; }

document.getElementById("user-email").textContent = Logged in as: ${user.email};

const uid = user.uid; const userRef = doc(db, "users", uid); let userSnap = await getDoc(userRef);

if (!userSnap.exists()) { await setDoc(userRef, { balance: 0, lastMine: null, email: user.email }); userSnap = await getDoc(userRef); }

const data = userSnap.data(); updateBalanceUI(data.balance);

if (data.lastMine) { startTimer(new Date(data.lastMine)); }

document.getElementById("mine-btn").onclick = async () => { const now = new Date(); const lastMineTime = data.lastMine ? new Date(data.lastMine) : null;

if (lastMineTime && now - lastMineTime < 24 * 60 * 60 * 1000) {
  alert("⏱ You can only mine once every 24 hours.");
  return;
}

const reward = 0.001;
const newBalance = data.balance + reward;

await updateDoc(userRef, {
  balance: newBalance,
  lastMine: now.toISOString()
});

updateBalanceUI(newBalance);
startTimer(now);
alert(`✅ You've mined ${reward} EANO!`);

};

document.getElementById("logout-btn").onclick = async () => { await signOut(auth); window.location.href = "index.html"; }; });

function updateBalanceUI(balance) { document.getElementById("balance").textContent = balance.toFixed(3); }

function startTimer(startTime) { clearInterval(timerInterval); const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

function updateTimer() { const now = new Date(); const diff = endTime - now;

if (diff <= 0) {
  document.getElementById("timer").textContent = "⛏ Ready to mine again!";
  clearInterval(timerInterval);
  return;
}

const hours = Math.floor(diff / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

document.getElementById("timer").textContent = `Next mine: ${hours}h ${minutes}m ${seconds}s`;

}

updateTimer(); timerInterval = setInterval(updateTimer, 1000); }

