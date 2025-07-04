// signup.js

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-coin.firebaseapp.com",
  projectId: "eano-coin",
  storageBucket: "eano-coin.appspot.com",
  messagingSenderId: "98972385091",
  appId: "1:98972385091:web:85410fccc7c5933d761a9f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Generate random referral code
function generateReferralCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Main signup function (called on button click)
async function signup() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const referralInput = document.getElementById('referral').value.trim();

  if (!email || !password) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    // Create user
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;
    const referralCode = generateReferralCode();

    // User data
    const userData = {
      uid: uid,
      email: email,
      score: 5,
      trust: "New Miner",
      level: "Amateurs",
      referralCode: referralCode,
      referredBy: referralInput || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Handle referral
    if (referralInput !== "") {
      const querySnapshot = await db.collection("users")
        .where("referralCode", "==", referralInput)
        .get();

      if (!querySnapshot.empty) {
        const referrerDoc = querySnapshot.docs[0];
        const referrerId = referrerDoc.id;

        await db.collection("users").doc(referrerId).update({
          score: firebase.firestore.FieldValue.increment(5)
        });
      } else {
        alert("Invalid referral code entered.");
        return;
      }
    }

    // Save user data
    await db.collection("users").doc(uid).set(userData);

    alert("Signup successful!");
    window.location.href = "index.html";

  } catch (error) {
    alert("Signup failed: " + error.message);
    console.error(error);
  }
}
