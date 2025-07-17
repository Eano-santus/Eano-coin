import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
    authDomain: "eano-miner.firebaseapp.com",
    databaseURL: "https://eano-miner-default-rtdb.firebaseio.com",
    projectId: "eano-miner",
    storageBucket: "eano-miner.appspot.com", // ✅ fixed: was ".firebasestorage.app" (incorrect)
    messagingSenderId: "50186911438",
    appId: "1:50186911438:web:85410fccc7c5933d761a9f",
    measurementId: "G-NS0W6QSS69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let users = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  await loadLeaderboard();
});

async function loadLeaderboard() {
  const querySnapshot = await getDocs(collection(db, "users"));
  users = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.username) return;
    users.push({
      username: data.username || "Anonymous",
      avatar: data.photoURL || "avatars/default.png",
      trustScore: data.trustScore || 0,
      balance: data.balance || 0,
      level: getLevelName(data.score || 0),
      joinedAt: data.joinedAt || new Date().toISOString()
    });
  });

  renderAllSections("all");
}

function renderAllSections(filterType) {
  const filtered = applyFilter(users, filterType);

  renderTopMiners(filtered);
  renderTopTrustScores(filtered);
  renderTopLevels(filtered);
}

function renderTopMiners(list) {
  const sorted = [...list].sort((a, b) => b.balance - a.balance).slice(0, 10);
  const container = document.getElementById("topMiners");
  container.innerHTML = sorted.map(user => renderUserCard(user, `💰 ${user.balance.toFixed(2)} EANO`)).join("");
}

function renderTopTrustScores(list) {
  const sorted = [...list].sort((a, b) => b.trustScore - a.trustScore).slice(0, 10);
  const container = document.getElementById("topTrust");
  container.innerHTML = sorted.map(user => renderUserCard(user, `🛡️ ${user.trustScore}`)).join("");
}

function renderTopLevels(list) {
  const levelOrder = {
    "🐥 Amateurs": 1,
    "⚔️ Elites": 2,
    "🎯 Professionals": 3,
    "👑 Masters": 4,
    "🌍 Leaders": 5
  };

  const sorted = [...list]
    .sort((a, b) => levelOrder[getLevelNameScore(b.level)] - levelOrder[getLevelNameScore(a.level)])
    .slice(0, 10);

  const container = document.getElementById("topLevels");
  container.innerHTML = sorted.map(user => renderUserCard(user, `${user.level}`)).join("");
}

function renderUserCard(user, stat) {
  return `
    <div class="flex items-center justify-between bg-black/60 rounded-lg px-4 py-2 shadow">
      <div class="flex items-center gap-3">
        <img src="${user.avatar}" class="w-10 h-10 rounded-full border border-yellow-500" />
        <div>
          <p class="font-semibold">${user.username}</p>
          <small class="text-yellow-400">${stat}</small>
        </div>
      </div>
    </div>
  `;
}

function getLevelName(score) {
  if (score >= 10000) return "🌍 Leaders";
  if (score >= 5000) return "👑 Masters";
  if (score >= 1000) return "🎯 Professionals";
  if (score >= 500) return "⚔️ Elites";
  return "🐥 Amateurs";
}

// For comparison sorting
function getLevelNameScore(levelName) {
  if (levelName.includes("Leaders")) return "🌍 Leaders";
  if (levelName.includes("Masters")) return "👑 Masters";
  if (levelName.includes("Professionals")) return "🎯 Professionals";
  if (levelName.includes("Elites")) return "⚔️ Elites";
  return "🐥 Amateurs";
}

// 🧠 Filter users by joinedAt
function applyFilter(data, type) {
  const now = new Date();
  return data.filter((user) => {
    const joined = new Date(user.joinedAt);
    if (type === "weekly") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return joined >= oneWeekAgo;
    }
    if (type === "monthly") {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return joined >= oneMonthAgo;
    }
    return true; // all
  });
}

// 🔄 Bind filter dropdown
window.filterLeaderboard = function (type) {
  renderAllSections(type);
};
