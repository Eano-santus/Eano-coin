// leaderboard.js

import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const leaderboardList = document.getElementById("referral-leaderboard");
const balanceSpan = document.getElementById("balance");

// 🎖️ Trust badge logic
function getTrustBadge(trustScore) {
  if (trustScore >= 1000) return "🟢 Trusted Miner";
  if (trustScore >= 500) return "🟡 Reliable Miner";
  if (trustScore >= 300) return "🔵 New Miner";
  return "🔴 Low Trust";
}

// 🏅 Mining level logic
function getLevelFromBalance(balance) {
  if (balance >= 3000) return "🐘 Elephant";
  if (balance >= 2000) return "🦍 Gorilla";
  if (balance >= 1000) return "🦁 Lion";
  if (balance >= 500) return "🦒 Giraffe";
  if (balance >= 250) return "🐺 Wolf";
  if (balance >= 100) return "🐶 Dog";
  if (balance >= 25) return "🐹 Hamster";
  if (balance >= 5) return "🐥 Chicken";
  return "🥚 Unhatched";
}

// 🏆 Load Top 10 Leaderboard
async function loadLeaderboard() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("referralCount", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);
    leaderboardList.innerHTML = "";

    if (snapshot.empty) {
      leaderboardList.innerHTML = `<li class="list-group-item text-center text-muted">No leaderboard data yet.</li>`;
      return;
    }

    snapshot.forEach((docSnap, index) => {
      const user = docSnap.data();
      const username = user.username || `User-${docSnap.id.slice(0, 6)}`;
      const referralCount = user.referralCount || 0;
      const trustScore = user.trustScore || 0;
      const balance = user.balance || 0;

      const badge = getTrustBadge(trustScore);
      const level = getLevelFromBalance(balance);

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>#${index + 1} ${username}</strong><br/>
          <small>${level} | ${badge}</small>
        </div>
        <span class="badge bg-primary rounded-pill">${referralCount} Refs</span>
      `;
      leaderboardList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    leaderboardList.innerHTML = `<li class="list-group-item text-danger text-center">Error loading leaderboard.</li>`;
  }
}

// 🔐 Load balance of current user
function loadUserBalance(user) {
  const userRef = doc(db, "users", user.uid);
  getDoc(userRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      balanceSpan.textContent = (data.balance || 0).toFixed(3);
    }
  });
}

// 🔁 Start
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  loadLeaderboard();
  loadUserBalance(user);
});
