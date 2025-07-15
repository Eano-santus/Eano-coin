import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const avatarGallery = [
  "avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png",
  "avatar5.png", "avatar6.png", "avatar7.png", "avatar8.png"
];

function updateAvatarUI(selectedUrl) {
  document.getElementById("current-avatar").src = selectedUrl;
}

function displayAvatarGallery(uid) {
  const container = document.getElementById("avatar-gallery");
  container.innerHTML = ""; // Clear previous avatars
  avatarGallery.forEach(name => {
    const url = `avatars/${name}`;
    const img = document.createElement("img");
    img.src = url;
    img.alt = name;
    img.className = "avatar-option";
    img.onclick = async () => {
      updateAvatarUI(url);
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { avatar: url });
    };
    container.appendChild(img);
  });
}

function determineMiningLevel(balance) {
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

function getTrustBadge(score) {
  if (score >= 5000) return '<span class="trust-badge OG">O.G</span>';
  if (score >= 1000) return '<span class="trust-badge green">🟢 Trusted Miner</span>';
  if (score >= 500)  return '<span class="trust-badge yellow">🟡 Reliable Miner</span>';
  if (score >= 300)  return '<span class="trust-badge blue">🔵 New Miner</span>';
  return '<span class="trust-badge red">🔴 Low Trust</span>';
}

onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) return;
  console.log("User Data:", data);

  const data = docSnap.data();
console.log("Loaded Firebase User Data:", data); // Debug

const username = data.username || user.email;
const trustScore = data.trustScore ?? data.trustscore ?? 0;
const balance = typeof data.balance === "number" ? data.balance.toFixed(2) : "0.00";
const avatar = data.avatar || "avatars/default.png";

document.getElementById("username").textContent = username;
document.getElementById("trustScore").innerHTML = `${trustScore} ${getTrustBadge(trustScore)}`;
document.getElementById("balance").textContent = balance;
document.getElementById("miningLevel").textContent = determineMiningLevel(data.balance || 0);
updateAvatarUI(avatar);

  displayAvatarGallery(user.uid);
});

// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
