// referralLeaderboard.js

import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// HTML element where leaderboard will be displayed
const leaderboardList = document.getElementById("referral-leaderboard");

// Load and display top 10 users by referral count
async function loadReferralLeaderboard() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("referralCount", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);

    leaderboardList.innerHTML = ""; // Clear previous content

    if (querySnapshot.empty) {
      leaderboardList.innerHTML = `<li class="text-center text-gray-500">No referral data yet.</li>`;
      return;
    }

    querySnapshot.forEach((doc, index) => {
      const user = doc.data();
      const name = user.name || "Anonymous Miner";
      const referralCount = user.referralCount || 0;

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="flex justify-between p-2 border-b border-gray-300">
          <span class="font-semibold text-sm">#${index + 1} ${name}</span>
          <span class="text-yellow-600 font-bold text-sm">${referralCount} referrals</span>
        </div>
      `;
      leaderboardList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load referral leaderboard:", error);
    leaderboardList.innerHTML = `<li class="text-red-600">Error loading leaderboard.</li>`;
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", loadReferralLeaderboard);
