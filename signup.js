// signup.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const referralCode = document.getElementById("referralCode").value.trim();

  try {
    // Step 1: Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Prepare user object
    const userData = {
      username: username,
      email: email,
      referralCode: referralCode || null,
      trustScore: 5,
      score: 5,
      level: "Amateur",
      uid: user.uid,
      createdAt: new Date().toISOString()
    };

    // Step 3: Save user to Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    // Step 4: If referralCode is used, find referrer and reward
    if (referralCode) {
      const refQuery = await getDoc(doc(db, "users", referralCode));
      if (refQuery.exists()) {
        const refData = refQuery.data();
        const refScore = (refData.trustScore || 0) + 5;
        await updateDoc(doc(db, "users", referralCode), {
          trustScore: refScore
        });
      }
    }

    alert("Signup successful!");
    window.location.href = "index.html"; // Redirect after signup
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed: " + error.message);
  }
});<script type="module">
  import('./signup.js');
</script>
