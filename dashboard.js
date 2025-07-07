// dashboard.js 
import { auth, db } from './firebase.js'; import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const balanceEl = document.getElementById("balance"); const timerEl = document.getElementById("timer"); const logoutBtn = document.getElementById("logout-btn"); const mineBtn = document.getElementById("mine-btn"); const userEmailEl = document.getElementById("user-email");

let userRef; let timerInterval = null;

onAuthStateChanged(auth, async (user) => { if (!user) { window.location.href = "index.html"; return; }

userEmailEl.textContent = Logged in as: ${user.email}; userRef = doc(db, "users", user.uid); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) { const ref = new URLSearchParams(window.location.search).get("ref") || null; await setDoc(userRef, { balance: 2, lastMine: null, email: user.email, trustScore: 0, referrer: ref });

if (ref) {
  const refUserRef = doc(db, "users", ref);
  const refSnap = await getDoc(refUserRef);
  if (refSnap.exists()) {
    await updateDoc(refUserRef, {
      balance: (refSnap.data().balance || 0) + 2
    });
  }
}

}

const data = (await getDoc(userRef)).data(); updateUI(data);

if (data.lastMine) { startTimer(new Date(data.lastMine)); }

mineBtn.onclick = async () => { const now = new Date(); const fresh = await getDoc(userRef); const userData = fresh.data(); const lastMine = userData.lastMine ? new Date(userData.lastMine) : null; const canMine = !lastMine || (now - lastMine >= 24 * 60 * 60 * 1000);

if (!canMine) {
  alert("You can mine only once every 24 hours.");
  return;
}

const reward = 0.001;
const newBalance = (userData.balance || 0) + reward;
const newTrust = (userData.trustScore || 0) + 1;

await updateDoc(userRef, {
  balance: newBalance,
  lastMine: now.toISOString(),
  trustScore: newTrust
});

updateUI({ balance: newBalance });
startTimer(now);
alert(`You earned ${reward} EANO and +1 trust!`);

}; });

function updateUI(data) { if (balanceEl && data.balance !== undefined) { balanceEl.textContent = data.balance.toFixed(3); } }

function startTimer(startTime) { clearInterval(timerInterval); const nextMine = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

function tick() { const now = new Date(); const remaining = nextMine - now;

if (remaining <= 0) {
  timerEl.textContent = "⛏ Ready to mine!";
  clearInterval(timerInterval);
  return;
}

const h = Math.floor(remaining / (1000 * 60 * 60));
const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
const s = Math.floor((remaining % (1000 * 60)) / 1000);
timerEl.textContent = `${h}h ${m}m ${s}s`;

}

tick(); timerInterval = setInterval(tick, 1000); }

if (logoutBtn) { logoutBtn.addEventListener("click", () => { signOut(auth).then(() => { window.location.href = "index.html"; }); }); }

