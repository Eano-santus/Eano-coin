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
  const avatarImg = document.getElementById("current-avatar");
  if (avatarImg) {
    avatarImg.src = selectedUrl;
  }
}

function displayAvatarGallery(uid) {
  const container = document.getElementById("avatar-gallery");
  container.innerHTML = ""; // clear previous
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

onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) return;

  const data = docSnap.data();
  const username = data.username || user.email;
  const trustScore = data.trustScore ?? 0;
  const balance = data.balance?.toFixed(2) ?? "0.00";
  const miningLevel = determineMiningLevel(data.balance || 0);

  document.getElementById("username").textContent = username;
  document.getElementById("trustScore").textContent = trustScore;
  document.getElementById("balance").textContent = balance;
  document.getElementById("miningLevel").textContent = miningLevel;

  let avatarPath = data.avatar || "avatars/default.png";

  // ✅ Validate that avatar is from the approved list
  const validAvatars = avatarGallery.map(name => `avatars/${name}`);
  if (!validAvatars.includes(avatarPath)) {
    avatarPath = "avatars/default.png";
    await updateDoc(userRef, { avatar: avatarPath });
  }

  updateAvatarUI(avatarPath);
  displayAvatarGallery(user.uid);
});

// 🌓 Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
