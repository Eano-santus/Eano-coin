import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

const auth = getAuth();
const db = getFirestore();

const miningRate = 0.1;
const miningInterval = 24 * 60 * 60 * 1000; // 24 hours

// Miner level thresholds
const trustLevels = [
  { label: "Trusted Miner", min: 500 },
  { label: "Reliable Miner", min: 200 },
  { label: "New Miner", min: 80 },
  { label: "Needs Trust", min: 0 },
];

const upgradeLevels = [
  { label: "Leader", min: 10000 },
  { label: "Master", min: 5000 },
  { label: "Professional", min: 1000 },
  { label: "Elite", min: 500 },
  { label: "Amateur", min: 50 },
];

let currentUser;

// On login
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create profile
      const urlParams = new URLSearchParams(window.location.search);
      const referral = urlParams.get("ref");

      await setDoc(userRef, {
        email: user.email,
        uid: uid,
        createdAt: new Date(),
        coinBalance: 0,
        lastMine: 0,
        trustScore: 5,
        referredBy: referral || user.email,
      });

      // Reward referrer if exists
      if (referral) {
        const referrerRef = doc(db, "users", referral);
        const refSnap = await getDoc(referrerRef);
        if (refSnap.exists()) {
          await updateDoc(referrerRef, {
            trustScore: increment(5),
          });
        }
      }
    }

    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userUID").textContent = uid;
    document.getElementById("referralCode").textContent = uid;
    document.getElementById("referralLink").textContent = `${window.location.origin}/signup.html?ref=${uid}`;

    await updateUI();
  } else {
    window.location.href = "signup.html"; // redirect to login
  }
});

async function updateUI() {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  // Update balance
  document.getElementById("coinBalance").textContent = data.coinBalance?.toFixed(2) || 0;

  // Countdown
  const lastMine = data.lastMine || 0;
  const now = Date.now();
  const remaining = Math.max(0, miningInterval - (now - lastMine));
  updateCountdown(remaining);

  // Trust Score
  const trust = data.trustScore || 0;
  const trustLabel = trustLevels.find(t => trust >= t.min)?.label || "Unknown";
  document.getElementById("trustStatus").textContent = trustLabel;

  // Upgrade Level
  const level = upgradeLevels.find(l => trust >= l.min)?.label || "Beginner";
  document.getElementById("upgradeLevel").textContent = level;

  // Leaderboard
  await loadLeaderboard();
}

function updateCountdown(ms) {
  const countdownEl = document.getElementById("countdown");
  if (ms <= 0) {
    countdownEl.textContent = "00:00:00";
    return;
  }

  const interval = setInterval(() => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    countdownEl.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    ms -= 1000;
    if (ms <= 0) {
      clearInterval(interval);
      countdownEl.textContent = "00:00:00";
    }
  }, 1000);
}

document.getElementById("mineButton").addEventListener("click", async () => {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  const now = Date.now();
  if (now - (data.lastMine || 0) < miningInterval) {
    alert("You must wait 24 hours before mining again.");
    return;
  }

  await updateDoc(userRef, {
    coinBalance: increment(miningRate),
    lastMine: now,
    trustScore: increment(1),
  });

  await updateUI();
});

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
    document.getElementById("logoutButton").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "signup.html"; // redirect to login/signup
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});
  });
}
