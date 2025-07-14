import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { firebaseConfig } from "./firebase.js";

// 🔥 Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🎯 DOM Elements
const refCodeEl = document.getElementById("ref-code");
const refLinkEl = document.getElementById("ref-link");
const referralsList = document.getElementById("referrals");
const summary = document.getElementById("bonus-summary");
const copyBtn = document.getElementById("copy-btn");
const shareBtn = document.getElementById("share-btn");

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const data = userDoc.data();
  const username = data.username || user.email.split("@")[0];
  const refLink = `https://eano-santus.github.io/eano-coin/?ref=${username}`;
  const userTrust = data.trustScore || 0;

  refCodeEl.textContent = username;
  refLinkEl.textContent = refLink;

  // ✂️ Copy + 📤 Share
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(refLink);
    alert("✅ Referral link copied!");
  };

  shareBtn.onclick = () => {
    const message = `🚀 Join EANO now and start earning daily!\n🔗 ${refLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  // 👥 Get Referred Users
  const q = query(collection(db, "users"), where("referredBy", "==", username));
  const snapshot = await getDocs(q);
  let totalBonus = 0;

  referralsList.innerHTML = "";
  if (snapshot.empty) {
    referralsList.innerHTML = "<li>No referrals yet. Invite your friends! 👇</li>";
    summary.textContent = "⏳ 0 referrals, 0 TrustScore earned";
    return;
  }

  snapshot.forEach(docSnap => {
    const r = docSnap.data();
    totalBonus += 5;

    const li = document.createElement("li");
    const joined = new Date(r.joinedAt).toLocaleDateString();
    const trustBadge = getTrustBadge(r.trustScore || 0);
    const miningLevel = getMiningLevel(r.balance || 0);

    li.innerHTML = `👤 <strong>${r.username || r.name}</strong> (${miningLevel}) – joined <em>${joined}</em> ${trustBadge}`;
    referralsList.appendChild(li);
  });

  summary.textContent = `✅ ${snapshot.size} referrals = +${totalBonus} TrustScore earned 🎯`;
});

// 🎖 Trust Badge
function getTrustBadge(score) {
  if (score >= 5000) return "🌟 O.G";
  if (score >= 1000) return "🟢 Trusted";
  if (score >= 500) return "🟡 Reliable";
  if (score >= 300) return "🔵 New Miner";
  return "🔴";
}

// 🐾 Mining Level
function getMiningLevel(balance) {
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
