// dashboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

const emailDisplay = document.getElementById("user-email"); const balanceDisplay = document.getElementById("balance"); const mineBtn = document.getElementById("mine-btn"); const logoutBtn = document.getElementById("logout-btn"); const timerDisplay = document.getElementById("timer"); const leaderboardList = document.getElementById("leaderboard");

let timerInterval;

onAuthStateChanged(auth, async (user) => { if (!user) { window.location.href = "index.html"; return; }

emailDisplay.textContent = Logged in as: ${user.email}; const uid = user.uid;

const userRef = doc(db, "users", uid); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) { await setDoc(userRef, { balance: 0, lastMine: null, email: user.email }); }

const data = (await getDoc(userRef)).data(); balanceDisplay.textContent = data.balance.toFixed(3);

if (data.lastMine) { startTimer(new Date(data.lastMine)); }

mineBtn.onclick = async () => { const now = new Date(); const lastMineTime = data.lastMine ? new Date(data.lastMine) : null; if (lastMineTime && now - lastMineTime < 24 * 60 * 60 * 1000) { alert("You can mine only once every 24 hours."); return; }

const reward = 0.001;
const newBalance = data.balance + reward;
await updateDoc(userRef, {
  balance: newBalance,
  lastMine: now.toISOString()
});

balanceDisplay.textContent = newBalance.toFixed(3);
startTimer(now);
alert(`You've successfully mined ${reward} EANO!`);

loadLeaderboard();

};

loadLeaderboard(); });

logoutBtn.onclick = () => { signOut(auth).then(() => { window.location.href = "index.html"; }); };

function startTimer(startTime) { clearInterval(timerInterval);

const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

function updateTimer() { const now = new Date(); const diff = endTime - now;

if (diff <= 0) {
  timerDisplay.textContent = "⛏ Ready to mine again!";
  clearInterval(timerInterval);
  return;
}

const hours = Math.floor(diff / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

timerDisplay.textContent = `Next mining in: ${hours}h ${minutes}m ${seconds}s`;

}

updateTimer(); timerInterval = setInterval(updateTimer, 1000); }

async function loadLeaderboard() { if (!leaderboardList) return;

leaderboardList.innerHTML = "<li>Loading...</li>"; const usersQuery = query(collection(db, "users"), orderBy("balance", "desc"), limit(10)); const snapshot = await getDocs(usersQuery);

leaderboardList.innerHTML = ""; snapshot.forEach((doc) => { const user = doc.data(); const li = document.createElement("li"); li.textContent = ${user.email || "Anonymous"}: ${user.balance.toFixed(3)} EANO; leaderboardList.appendChild(li); }); }

