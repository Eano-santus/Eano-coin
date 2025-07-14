import {
  getFirestore, collection, query, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

function getTrustBadge(score) {
  if (score >= 5000) return "🌟 O.G";
  if (score >= 1000) return "🟢 Trusted Miner";
  if (score >= 500) return "🟡 Reliable Miner";
  if (score >= 300) return "🔵 New Miner";
  return "🔴 Low Trust";
}

function getLevel(balance) {
  if (balance >= 10000) return "🐉 Dragon";
  if (balance >= 5000) return "🐘 Elephant";
  if (balance >= 2500) return "🦍 Gorilla";
  if (balance >= 1200) return "🐻 Bear";
  if (balance >= 600) return "🐯 Lion";
  if (balance >= 300) return "🐼 Panda";
  if (balance >= 150) return "🐺 Wolf";
  if (balance >= 50) return "🐹 Hamster";
  return "🐥 Chicken";
}

onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  const topRef = query(collection(db, "users"), orderBy("trustScore", "desc"), limit(10));
  const snapshot = await getDocs(topRef);
  const container = document.getElementById("top-users");

  container.innerHTML = "";

  let rank = 1;
  snapshot.forEach(doc => {
    const d = doc.data();
    const trust = getTrustBadge(d.trustScore ?? 0);
    const level = getLevel(d.balance ?? 0);
    const name = d.username || d.email;

    container.innerHTML += `
      <div class="feature-card">
        <h3>#${rank} — ${name}</h3>
        <p>Level: ${level} | Score: ${d.trustScore ?? 0} ${trust}</p>
        <p>Balance: ${d.balance?.toFixed(2) || 0} EANO</p>
      </div>
    `;
    rank++;
  });
});

// Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
