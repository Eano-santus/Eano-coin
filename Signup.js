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
import { db, auth } from "../firebase.js"; // Adjust path based on file location

// Generate random referral code
function generateReferralCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Handle referral logic
async function handleReferral(referralCodeInput, newUserUid) {
  if (!referralCodeInput) return;

  try {
    const usersRef = collection(db, "miners"); // Changed to miners
    const q = query(usersRef, where("referralCode", "==", referralCodeInput));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0];
      const referrerData = referrerDoc.data();
      await updateDoc(referrerDoc.ref, {
        referralCount: (referrerData.referralCount || 0) + 1,
      });
      const newUserDocRef = doc(db, "miners", newUserUid);
      await updateDoc(newUserDocRef, { referredBy: referralCodeInput });
      console.log(`Referral recorded: ${referralCodeInput} referred ${newUserUid}`);
    } else {
      console.log("Invalid referral code.");
    }
  } catch (error) {
    console.error("Referral error:", error);
  }
}

// Signup function
export async function signup(email, password, referralCodeInput) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const newUserReferralCode = generateReferralCode();
    await setDoc(doc(db, "miners", user.uid), { // Changed to miners
      email: user.email,
      referralCode: newUserReferralCode,
      referralCount: 0,
      createdAt: new Date(),
      referredBy: referralCodeInput || null,
    });

    if (referralCodeInput) await handleReferral(referralCodeInput, user.uid);

    return { success: true, message: "Signup successful! Verify your email before logging in." };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Form submission handler
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const referralCode = document.getElementById("referralCode").value.trim();

    const result = await signup(email, password, referralCode);
    alert(result.message);
    if (result.success) window.location.href = "login.html";
  });
}
