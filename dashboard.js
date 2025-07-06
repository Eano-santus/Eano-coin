// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-coin.firebaseapp.com",
  projectId: "eano-coin",
  storageBucket: "eano-coin.appspot.com",
  messagingSenderId: "1083676735191",
  appId: "1:1083676735191:web:0aa1fd34a0e9866145f14e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let countdownTimer = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        coinBalance: 0,
        lastMined: Date.now() - 86400000,
        trustScore: 5,
        referralCode: generateReferralCode(),
        referredBy: null,
        isAdmin: false
      });
    }

    // Show admin link if user is admin
    if (docSnap.exists() && docSnap.data().isAdmin === true) {
      document.getElementById("adminLink").style.display = "block";
    }

    updateUI(userRef);
    setupMining(userRef);
    loadLeaderboard();

  } else {
    window.location.href = "signup.html";
  }
});

// Utility Functions

function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function updateUI(userRef) {
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) return;

  const data = docSnap.data();
  const balance = data.coinBalance || 0;
  const trust = typeof data.trustScore === "number" ? data.trustScore : 0;
  const referralCode = data.referralCode || "";
  const referredBy = data.referredBy || "";

  document.getElementById("coinBalance").textContent = balance.toFixed(2);
  document.getElementById("trustScore").textContent = trust;

  const trustLevels = [
    { min: 500, label: "Trusted Miner" },
    { min: 200, label: "Reliable Miner" },
    { min: 80, label: "New Miner" },
    { min: 0, label: "Needs Trust" }
  ];
  const trustLabel = trustLevels.find(t => trust >= t.min)?.label || "Unknown";
  document.getElementById("trustLabel").textContent = trustLabel;

  const upgradeLevels = [
    { min: 10000, label: "Leaders" },
    { min: 5000, label: "Masters" },
    { min: 1000, label: "Professionals" },
    { min: 500, label: "Elites" },
    { min: 50, label: "Amateurs" },
    { min: 0, label: "Beginner" }
  ];
  const level = upgradeLevels.find(l => trust >= l.min)?.label || "Beginner";
  document.getElementById("upgradeLabel").textContent = level;

  document.getElementById("referralCode").textContent = referralCode;
  document.getElementById("referredBy").textContent = referredBy;

  const lastMined = data.lastMined || 0;
  const msSinceLastMine = Date.now() - lastMined;
  const msRemaining = Math.max(0, 86400000 - msSinceLastMine);
  updateCountdown(msRemaining);
}

function updateCountdown(ms) {
  clearInterval(countdownTimer);
  const countdownEl = document.getElementById("countdown");

  if (ms <= 0) {
    countdownEl.textContent = "00:00:00";
    return;
  }

  countdownTimer = setInterval(() => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    countdownEl.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    ms -= 1000;
    if (ms <= 0) {
      clearInterval(countdownTimer);
      countdownEl.textContent = "00:00:00";
    }
  }, 1000);
}

function setupMining(userRef) {
  document.getElementById("mineButton").addEventListener("click", async () => {
    const docSnap = await getDoc(userRef);
    const data = docSnap.data();
    const now = Date.now();

    if (now - data.lastMined < 86400000) {
      alert("You can only mine once every 24 hours.");
      return;
    }

    const earned = calculateEarnings(data.trustScore || 0);
    await updateDoc(userRef, {
      coinBalance: (data.coinBalance || 0) + earned,
      lastMined: now
    });

    alert(`You mined ${earned.toFixed(2)} EANO coins!`);
    updateUI(userRef);
  });
}

function calculateEarnings(trust) {
  if (trust >= 500) return 5;
  if (trust >= 200) return 3;
  if (trust >= 80) return 2;
  return 1;
}

async function loadLeaderboard() {
  const leaderboardEl = document.getElementById("topMiners");
  leaderboardEl.innerHTML = "";

  const q = query(collection(db, "users"), orderBy("coinBalance", "desc"), limit(20));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc, index) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${data.email || "Anonymous"} — ${data.coinBalance?.toFixed(2)} EANO`;
    leaderboardEl.appendChild(li);
  });
}

document.getElementById("logoutButton").addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to log out?");
  if (confirmed) {
    signOut(auth)
      .then(() => {
        window.location.href = "signup.html"; // or "login.html"
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }
});
function storeOfflineMining() {
  const now = new Date().toISOString();
  let actions = JSON.parse(localStorage.getItem('offlineMines')) || [];
  actions.push({ timestamp: now });
  localStorage.setItem('offlineMines', JSON.stringify(actions));
  console.log('[Offline] Mining stored');
}

// Called when mine button is clicked
function handleMineClick() {
  if (!navigator.onLine) {
    storeOfflineMining();
  } else {
    // Normal Firebase mining logic here
    // Example: updateUserMiningScoreInFirebase();
  }
}

// Auto sync when back online
window.addEventListener('online', () => {
  const actions = JSON.parse(localStorage.getItem('offlineMines')) || [];
  if (actions.length > 0) {
    actions.forEach(action => {
      // Replace this with your actual mining sync logic
      console.log('Syncing offline mining:', action.timestamp);
      // updateUserMiningScoreInFirebase();
    });
    localStorage.removeItem('offlineMines');
  }
});
