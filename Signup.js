// signup.js
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  setDoc,
  doc,
  getDoc,
  updateDoc
} from "./firebase.js";

const signupForm = document.getElementById("signupForm");
const errorMsg = document.getElementById("errorMsg");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const referralCode = document.getElementById("referralCode").value.trim();

  errorMsg.textContent = "";

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Send email verification
    await sendEmailVerification(newUser);

    // Handle referral code logic
    if (referralCode) {
      // Check if referrer exists
      const referrerDocRef = doc(db, "users", referralCode);
      const referrerDocSnap = await getDoc(referrerDocRef);

      if (referrerDocSnap.exists()) {
        // Increment referrer's referral count
        await updateDoc(referrerDocRef, {
          referrals: (referrerDocSnap.data().referrals || 0) + 1,
        });

        // Create new user doc with referral info
        await setDoc(doc(db, "users", newUser.uid), {
          email: newUser.email,
          referrals: 0,
          referralCode: referralCode,
          balance: 0,
          lastMined: 0,
        });
      } else {
        // Referrer not found — just create user doc without referral
        await setDoc(doc(db, "users", newUser.uid), {
          email: newUser.email,
          referrals: 0,
          balance: 0,
          lastMined: 0,
        });
      }
    } else {
      // No referral code — create user doc normally
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        referrals: 0,
        balance: 0,
        lastMined: 0,
      });
    }

    alert("Account created! Please check your email to verify your account.");
    signupForm.reset();
    window.location.href = "login.html";
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
