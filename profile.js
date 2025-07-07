// profile.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config (same as your existing setup)
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const userNameEl = document.getElementById("user-name");
const userEmailEl = document.getElementById("user-email");
const phoneInput = document.getElementById("phone-number");
const referralCodeEl = document.getElementById("referral-code");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  userEmailEl.textContent = user.email;
  referralCodeEl.value = uid;

  const userDocRef = doc(db, "users", uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const data = snap.data();
    userNameEl.textContent = data.username || "Anonymous";
    phoneInput.value = data.phone || "";
  } else {
    // If user data doesn't exist, create a default
    await updateDoc(userDocRef, {
      username: user.email.split("@")[0],
      phone: ""
    });
    userNameEl.textContent = user.email.split("@")[0];
  }
});

// Save Phone Number
window.savePhone = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const phone = phoneInput.value.trim();
  if (!phone) {
    alert("Phone number cannot be empty.");
    return;
  }

  await updateDoc(doc(db, "users", user.uid), { phone });
  alert("✅ Phone number saved.");
};

// Copy Referral Code
window.copyReferral = () => {
  referralCodeEl.select();
  referralCodeEl.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("✅ Referral code copied!");
};

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
}
