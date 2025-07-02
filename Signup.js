// signup.js
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "./firebase.js";

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;
  const referralCode = signupForm.referral.value.trim(); // New referral field

  try {
    // Create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      createdAt: new Date(),
      referralCount: 0,
      referredBy: null,
    });

    // Handle referral if provided
    if (referralCode) {
      await handleReferral(referralCode, user.uid);
    }

    alert("Signup successful! Please verify your email before logging in.");
    signupForm.reset();

  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message);
  }
});

// Function to handle referral logic
async function handleReferral(referralCode, newUserUid) {
  try {
    // Search for referrer by referralCode in 'users' collection, assuming referralCode == user.uid for simplicity
    const referrerDocRef = doc(db, "users", referralCode);
    const referrerDocSnap = await getDoc(referrerDocRef);

    if (referrerDocSnap.exists()) {
      // Increment referralCount of referrer
      await updateDoc(referrerDocRef, {
        referralCount: (referrerDocSnap.data().referralCount || 0) + 1,
      });

      // Update new user's referredBy field
      const newUserDocRef = doc(db, "users", newUserUid);
      await updateDoc(newUserDocRef, {
        referredBy: referralCode,
      });

      console.log(`Referral registered: ${referralCode} referred ${newUserUid}`);
    } else {
      console.log("Referral code not found.");
    }
  } catch (error) {
    console.error("Referral handling error:", error);
  }
}
