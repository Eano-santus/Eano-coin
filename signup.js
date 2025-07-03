// signup.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const referralCode = document.getElementById("referralCode").value.trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      referralCode: referralCode,
      score: 5,  // Starting score
      level: "Amateur", // Starting level
      trustScore: 5
    });

    alert("Signup successful!");
    window.location.href = "index.html"; // Or dashboard.html
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed: " + error.message);
  }
});
