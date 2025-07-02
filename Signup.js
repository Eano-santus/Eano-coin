// signup.js
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db, auth } from "./firebase.js"; // adjust path if needed

// Generate random referral code for new users
function generateReferralCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Handle referral code logic: increment referrer count and link new user
async function handleReferral(referralCodeInput, newUserUid) {
  if (!referralCodeInput) return;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", referralCodeInput));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data();

      await updateDoc(referrerDoc.ref, {
        referralCount: (referrerData.referralCount || 0) + 1,
      });

      const newUserDocRef = doc(db, "users", newUserUid);
      await updateDoc(newUserDocRef, {
        referredBy: referralCodeInput,
      });

      console.log(`Referral recorded: ${referralCodeInput} referred ${newUserUid}`);
    } else {
      console.log("Invalid referral code.");
    }
  } catch (error) {
    console.error("Referral handling error:", error);
  }
}

// Signup function
export async function signup(email, password, referralCodeInput) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const newUserReferralCode = generateReferralCode();

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      referralCode: newUserReferralCode,
      referralCount: 0,
      createdAt: new Date(),
      referredBy: null,
    });

    if (referralCodeInput) {
      await handleReferral(referralCodeInput, user.uid);
    }

    return { success: true, message: "Signup successful! Please check your email to verify your account." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Form submission handler
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.email.value.trim();
  const password = signupForm.password.value.trim();
  const referralCode = signupForm.referralCode.value.trim();

  const result = await signup(email, password, referralCode);

  if (result.success) {
    alert(result.message);
    window.location.href = "login.html"; // redirect to login page
  } else {
    alert("Error: " + result.message);
  }
});
