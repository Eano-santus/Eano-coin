// auth.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

// Google Sign-In const googleBtn = document.getElementById("google-signin"); if (googleBtn) { googleBtn.addEventListener("click", async () => { try { const provider = new GoogleAuthProvider(); const result = await signInWithPopup(auth, provider); const user = result.user; const userRef = doc(db, "users", user.uid); const snap = await getDoc(userRef);

if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      balance: 2,
      lastMine: null,
      referrals: 0,
      invitedBy: null
    });
  }
  window.location.href = "dashboard.html";
} catch (err) {
  alert("Google Sign-in failed: " + err.message);
}

}); }

// Email/Password Login const loginBtn = document.getElementById("login-btn"); if (loginBtn) { loginBtn.addEventListener("click", async () => { const email = document.getElementById("login-email").value; const password = document.getElementById("login-password").value;

try {
  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "dashboard.html";
} catch (err) {
  alert("Login failed: " + err.message);
}

}); }

// Email/Password Sign Up const signupBtn = document.getElementById("signup-btn"); if (signupBtn) { signupBtn.addEventListener("click", async () => { const email = document.getElementById("signup-email").value; const password = document.getElementById("signup-password").value; const urlParams = new URLSearchParams(window.location.search); const invitedBy = urlParams.get("ref") || null;

if (password.length < 6) {
  alert("Password must be at least 6 characters.");
  return;
}

try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Add user data to Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    balance: 2,
    lastMine: null,
    referrals: 0,
    invitedBy: invitedBy
  });

  // Give referral bonus
  if (invitedBy) {
    const inviterRef = doc(db, "users", invitedBy);
    const inviterSnap = await getDoc(inviterRef);
    if (inviterSnap.exists()) {
      await updateDoc(inviterRef, {
        balance: increment(2),
        referrals: increment(1)
      });
    }
  }

  window.location.href = "dashboard.html";
} catch (err) {
  alert("Signup failed: " + err.message);
}

}); }

