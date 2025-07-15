// createUser.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const username = user.email.split("@")[0];
    const now = Date.now();

    await setDoc(userRef, {
      username: username,
      email: user.email,
      avatar: "avatars/default.png",
      balance: 0.00,
      trustScore: 0,
      score: 0,
      miningStart: 0,
      miningEnd: 0,
      miningRate: 0.6,
      miningStatus: "inactive",
      level: "🐥 Chicken",
      referralCode: username,
      referredBy: "",
      referralCount: 0,
      referrals: [],
      firstname: "",
      lastname: "",
      status: "active",
      isKYCVerified: false,
      createdAt: now,
      lastLogin: now,
      language: "en",
      theme: "dark",
      phoneNumber: "",
      emailVerified: user.emailVerified,
      profileLockedUntil: 0
    });

    console.log("✅ New user document created.");
  } else {
    console.log("👤 Existing user found.");
  }
});
