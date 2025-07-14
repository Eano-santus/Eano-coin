import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

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

  const refLink = `https://eano-santus.github.io/eano-coin/?ref=${user.displayName || user.email}`;
  document.getElementById("ref-link").value = refLink;

  const q = query(collection(db, "users"), where("refBy", "==", user.uid));
  const snap = await getDocs(q);

  const container = document.getElementById("referrals-list");
  container.innerHTML = "";

  if (snap.empty) {
    container.innerHTML = `<p>You have no referrals yet.</p>`;
    return;
  }

  snap.forEach(doc => {
    const d = doc.data();
    const trustBadge = getTrustBadge(d.trustScore ?? 0);
    const level = getLevel(d.balance ?? 0);

    container.innerHTML += `
      <div class="feature-card">
        <p><strong>${d.username || d.email}</strong> • ${level}</p>
        <p>Score: ${d.trustScore ?? 0} • ${trustBadge}</p>
        <p>Balance: ${d.balance?.toFixed(2) || 0} EANO</p>
      </div>
    `;
  });
});

window.copyRef = function () {
  const refInput = document.getElementById("ref-link");
  refInput.select();
  document.execCommand("copy");
  alert("✅ Referral link copied!");
};

// Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
