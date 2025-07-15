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

// 🧑 Update main avatar image
function updateAvatarUI(selectedUrl) {
  document.getElementById("current-avatar").src = selectedUrl;
}

// 📸 Render avatar grid
function displayAvatarGallery(uid) {
  const container = document.getElementById("avatar-gallery");
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

// 🐲 Determine level based on balance
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

// 👤 Load user profile
onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) return;

  const data = docSnap.data();

  document.getElementById("username").textContent = data.username || user.email;
  document.getElementById("trustScore").textContent = data.trustScore ?? 0;
  document.getElementById("balance").textContent = data.balance?.toFixed(2) ?? "0.00";
  document.getElementById("miningLevel").textContent = determineMiningLevel(data.balance || 0);
  updateAvatarUI(data.avatar || "avatars/default.png");

  displayAvatarGallery(user.uid);
});

// 🌗 Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
