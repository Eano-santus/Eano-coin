// signup.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-coin.firebaseapp.com",
  projectId: "eano-coin",
  storageBucket: "eano-coin.appspot.com",
  messagingSenderId: "1083676735191",
  appId: "1:1083676735191:web:0aa1fd34a0e9866145f14e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle sign-up form
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const referralCode = new URLSearchParams(window.location.search).get("ref");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    let referredBy = null;

    // Check referral code
    if (referralCode) {
      const refQuery = query(collection(db, "users"), where("referralCode", "==", referralCode));
      const refSnap = await getDocs(refQuery);

      if (!refSnap.empty) {
        const refDoc = refSnap.docs[0];
        referredBy = refDoc.data().email;

        // Give referrer +5 trust score
        const refUserRef = doc(db, "users", refDoc.id);
        await updateDoc(refUserRef, {
          trustScore: (refDoc.data().trustScore || 0) + 5
        });
      }
    }

    // Generate referral code for this new user
    const newReferralCode = generateReferralCode();

    // Save user info in Firestore
    await setDoc(doc(db, "users", uid), {
      email: email,
      coinBalance: 0,
      trustScore: 5, // starting score
      referralCode: newReferralCode,
      referredBy: referredBy,
      lastMined: Date.now() - 86400000, // allow instant mining
      isAdmin: false
    });

    alert("Account created successfully!");
    window.location.href = "index.html";

  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed: " + error.message);
  }
});

function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
