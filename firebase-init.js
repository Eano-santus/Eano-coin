import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const username = user.email.split("@")[0];
    const now = Date.now();

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified || false,
      phoneNumber: "",

      username: username,
      firstname: "",
      lastname: "",
      avatar: "avatars/default.png",

      score: 0,
      trustScore: 0,
      balance: 0,
      level: "🐥 Chicken",

      miningStart: 0,
      miningEnd: 0,
      miningRate: 0.6,
      miningStatus: "inactive",

      referredBy: "",
      referralCode: username,
      referralCount: 0,
      referrals: [],

      status: "active",
      isKYCVerified: false,
      theme: "dark",
      language: "en",

      createdAt: now,
      lastLogin: now,
      profileLockedUntil: 0
    });

    console.log("✅ User initialized in Firestore.");
  } else {
    console.log("👤 User already exists.");
  }
});
