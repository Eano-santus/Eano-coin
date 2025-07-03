// signup.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  if (!form) {
    alert("Signup form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    const referralCode = document.getElementById("referralCode").value || null;

    if (!email || !password || !username) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        email,
        username,
        referralCode,
        referredBy: referralCode || null,
        createdAt: serverTimestamp(),
      };

      const minerData = {
        coins: 0,
        trustScore: 5,
        level: "New Miner",
        lastMine: null,
        referralCount: 0,
      };

      await setDoc(doc(db, "users", uid), userData);
      await setDoc(doc(db, "miners", uid), minerData);

      alert("Signup successful! Redirecting...");
      window.location.href = "index.html";
    } catch (error) {
      alert("Signup failed: " + error.message);
      console.error(error);
    }
  });
});
