// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI Elements
const balanceEl = document.getElementById("balance");
const timerEl = document.getElementById("timer");
const logoutBtn = document.getElementById("logout-btn");
const mineBtn = document.getElementById("mine-btn");
const userEmailEl = document.getElementById("user-email");

let timerInterval = null;

// Monitor auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  userEmailEl.textContent = `Logged in as: ${user.email}`;

  const userRef = doc(db, "users", user.uid);
  let userSnap = await getDoc(userRef);

  // If new user, initialize profile
  if (!userSnap.exists()) {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get("ref") || null;

    await setDoc(userRef, {
      balance: 2,
      lastMine: null,
      email: user.email,
      trustScore: 0,
      referrer: referrer
    });

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

    userSnap = await getDoc(userRef); // Refresh user data
  }

  const userData = userSnap.data();
  updateUI(userData);

  if (userData.lastMine) {
    startTimer(new Date(userData.lastMine));
  } else {
    timerEl.textContent = "⛏ Ready to mine!";
  }

  // Mining Handler
  mineBtn.addEventListener("click", async () => {
    const now = new Date();
    const lastMine = userData.lastMine ? new Date(userData.lastMine) : null;
    const canMine = !lastMine || now - lastMine >= 24 * 60 * 60 * 1000;

    if (!canMine) {
      alert("⏳ You can only mine once every 24 hours.");
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

    updateUI({ balance: newBalance, trustScore: newTrust });
    startTimer(now);
    alert(`✅ You mined ${reward} EANO and gained +1 Trust!`);
  });

  // Logout handler
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
});

// Update UI
function updateUI(data) {
  if (balanceEl && data.balance !== undefined) {
    balanceEl.textContent = data.balance.toFixed(3);
  }
  if (timerEl && !data.lastMine) {
    timerEl.textContent = "⛏ Ready to mine!";
  }
}

// Mining cooldown countdown
function startTimer(startTime) {
  clearInterval(timerInterval);

  const nextMineTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

  function updateTimer() {
    const now = new Date();
    const diff = nextMineTime - now;

    if (diff <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "⛏ Ready to mine!";
      return;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    timerEl.textContent = `${h}h ${m}m ${s}s`;
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
