// leaderboard.js

import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Element where leaderboard will be injected
const leaderboardList = document.getElementById("referral-leaderboard");

// Badge logic based on trust score
function getTrustBadge(trustScore) {
  if (trustScore >= 1000) return "🟢 Trusted Miner";
  if (trustScore >= 500) return "🟡 Reliable Miner";
  if (trustScore >= 300) return "🔵 New Miner";
  return "🔴 Low Trust";
}
}

// Mining Level based on EANO balance
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

// Load and display top 10 referrers
async function loadLeaderboard() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("referralCount", "desc"),
      limit(10)
    );

    const snapshot = await getDocs(q);
    leaderboardList.innerHTML = ""; // Clear previous content

    if (snapshot.empty) {
      leaderboardList.innerHTML = `<li class="list-group-item text-center text-muted">No referral data available.</li>`;
      return;
    }

    snapshot.forEach((doc, index) => {
      const user = doc.data();
      const name = user.name || `User-${doc.id.slice(0, 6)}`;
      const referralCount = user.referralCount || 0;
      const trustScore = user.trustScore || 0;
      const balance = user.balance || 0;

      const badge = getTrustBadge(trustScore);
      const level = getLevelFromBalance(balance);

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>#${index + 1} ${name}</strong><br/>
          <small>${level} | ${badge}</small>
        </div>
        <span class="badge bg-primary rounded-pill">${referralCount} Refs</span>
      `;

      leaderboardList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    leaderboardList.innerHTML = `<li class="list-group-item text-danger text-center">Failed to load leaderboard.</li>`;
  }
}

// Init on page load
document.addEventListener("DOMContentLoaded", loadLeaderboard);
