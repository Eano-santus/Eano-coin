// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.firebasestorage.app",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const balanceEl = document.getElementById("balance");
const timerEl = document.getElementById("timer");
const logoutBtn = document.getElementById("logout-btn");
const mineBtn = document.getElementById("mine-btn");
const userEmailEl = document.getElementById("user-email");

let timerInterval = null;

// Listen for auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userEmailEl.textContent = `Logged in as: ${user.email}`;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // New user
  if (!snap.exists()) {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get("ref") || null;

    await setDoc(userRef, {
      balance: 2,
      lastMine: null,
      email: user.email,
      trustScore: 0,
      referrer: referrer
    });

    // Reward referrer
    if (referrer) {
      const refUserRef = doc(db, "users", referrer);
      const refSnap = await getDoc(refUserRef);
      if (refSnap.exists()) {
        const refData = refSnap.data();
        await updateDoc(refUserRef, {
          balance: (refData.balance || 0) + 2
        });
      }
    }
  }

  // Load user data
  const userData = (await getDoc(userRef)).data();
  updateUI(userData);
  if (userData.lastMine) startTimer(new Date(userData.lastMine));
  
  mineBtn.onclick = async () => {
    const now = new Date();
    const lastMine = userData.lastMine ? new Date(userData.lastMine) : null;
    const canMine = !lastMine || (now - lastMine >= 24 * 60 * 60 * 1000);

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
  };
});

// Update UI
function updateUI(data) {
  if (balanceEl && data.balance !== undefined) {
    balanceEl.textContent = data.balance.toFixed(3);
  }
}

// Timer logic
function startTimer(startTime) {
  clearInterval(timerInterval);
  const nextTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

  function tick() {
    const now = new Date();
    const remaining = nextTime - now;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "⛏ Ready to mine!";
      return;
    }

    const h = Math.floor(remaining / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remaining % (1000 * 60)) / 1000);
    timerEl.textContent = `${h}h ${m}m ${s}s`;
  }

  tick();
  timerInterval = setInterval(tick, 1000);
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
}
