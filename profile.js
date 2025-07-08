// profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Elements
const userNameEl = document.getElementById("user-name");
const userEmailEl = document.getElementById("user-email");
const phoneInput = document.getElementById("phone-number");
const referralCodeEl = document.getElementById("referral-code");
const trustBadgeEl = document.getElementById("trust-badge");
const miningLevelEl = document.getElementById("mining-level");

// ✅ Badge Calculations
function getTrustBadge(score) {
  if (score >= 1000) return "🔰 GetTrusted";
  if (score >= 500) return "✅ Reliable Miner";
  if (score >= 300) return "🟡 New Miner";
  return "🔴 Low";
}

function getLevelFromBalance(balance) {
  if (balance >= 3000) return "🐘 Elephant";
  if (balance >= 2000) return "🦍 Gorilla";
  if (balance >= 1000) return "🦁 Lion";
  if (balance >= 500) return "🦒 Giraffe";
  if (balance >= 250) return "🐺 Wolf";
  if (balance >= 100) return "🐶 Dog";
  if (balance >= 5) return "🐹 Hamster";
  if (balance >= 1) return "🐥 Chicken";
  return "❌ Not Started";
}

// ✅ Auth Check and Load Profile
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  userEmailEl.textContent = user.email;
  referralCodeEl.value = uid;

  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    userNameEl.textContent = data.username || "Anonymous";
    phoneInput.value = data.phone || "";
    trustBadgeEl.textContent = getTrustBadge(data.trustScore || 0);
    miningLevelEl.textContent = getLevelFromBalance(data.balance || 0);
  } else {
    const defaultData = {
      username: user.email.split("@")[0],
      phone: "",
      trustScore: 0,
      balance: 0
    };
    await setDoc(userRef, defaultData);
    userNameEl.textContent = defaultData.username;
    trustBadgeEl.textContent = getTrustBadge(0);
    miningLevelEl.textContent = getLevelFromBalance(0);
  }
});

// ✅ Save Phone Number
window.savePhone = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const phone = phoneInput.value.trim();
  if (!phone) {
    alert("❌ Phone number cannot be empty.");
    return;
  }

  await updateDoc(doc(db, "users", user.uid), { phone });
  alert("✅ Phone number saved!");
};

// ✅ Copy Referral Code
window.copyReferral = () => {
  referralCodeEl.select();
  referralCodeEl.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("✅ Referral code copied!");
};

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
