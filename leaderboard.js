import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

let allUsers = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  const users = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    users.push({
      username: data.username || "Anonymous",
      avatar: data.photoURL || "avatars/default.png",
      trustScore: data.trustScore || 0,
      balance: data.balance || 0,
      level: data.level || "🐥 Chicken",
      joinedAt: data.joinedAt || new Date().toISOString(), // required for filter
    });
  });

  allUsers = users;
  filterLeaderboard("all"); // default
});

const getTrustBadge = (score) => {
  if (score >= 5000) return "🟡 O.G";
  if (score >= 1000) return "🟢 Trusted";
  if (score >= 500) return "🟡 Reliable";
  if (score >= 300) return "🔵 New";
  return "🔴 Low";
};

const renderLeaderboard = (list, containerId, type = "balance") => {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  list.forEach((user, index) => {
    const div = document.createElement("div");
    div.className = "feature-card";
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <img src="${user.avatar}" alt="avatar" style="width: 60px; height: 60px; border-radius: 12px;">
        <div>
          <strong>#${index + 1} ${user.username}</strong><br/>
          ${
            type === "trust"
              ? `TrustScore: ${user.trustScore} ${getTrustBadge(user.trustScore)}`
              : type === "level"
              ? `Level: ${user.level}`
              : `Balance: ${user.balance.toFixed(2)} EANO`
          }
        </div>
      </div>
    `;
    container.appendChild(div);
  });
};

window.filterLeaderboard = (range) => {
  const now = new Date();
  let filtered = [...allUsers];

  if (range === "weekly") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    filtered = filtered.filter(u => new Date(u.joinedAt) >= oneWeekAgo);
  } else if (range === "monthly") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    filtered = filtered.filter(u => new Date(u.joinedAt) >= oneMonthAgo);
  }

  renderLeaderboard(
    [...filtered].sort((a, b) => b.balance - a.balance).slice(0, 10),
    "topMiners"
  );

  renderLeaderboard(
    [...filtered].sort((a, b) => b.trustScore - a.trustScore).slice(0, 10),
    "topTrust",
    "trust"
  );

  renderLeaderboard(
    [...filtered].sort((a, b) => b.balance - a.balance).slice(0, 10),
    "topLevels",
    "level"
  );
};
