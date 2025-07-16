// auth.js — Handles login session + Firestore user document creation
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, query, where, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

async function signupWithReferral(email, password, referralCodeInput) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Generate a unique referral code for this new user
    const referralCode = uid.slice(0, 6); // or use random string/username

    let referredBy = null;
    if (referralCodeInput) {
      // Check if referral code is valid
      const q = query(collection(db, "users"), where("referralCode", "==", referralCodeInput));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const refDoc = querySnapshot.docs[0];
        referredBy = referralCodeInput;

        // Update referrer’s trust score and referral count
        const refUID = refDoc.id;
        await updateDoc(doc(db, "users", refUID), {
          trustScore: refDoc.data().trustScore + 5,
          referralCount: (refDoc.data().referralCount || 0) + 1
        });
      }
    }

    alert("Signup successful!");
  } catch (err) {
    console.error("Signup error:", err.message);
  }
}

// ✅ Sign-In with Google and Initialize Firestore User
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const referralCode = getReferralCode();

    if (!userSnap.exists()) {
      // 🆕 Create new user
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || "avatars/default.png",
        emailVerified: user.emailVerified || false,
        balance: 0,
        score: referralCode ? 5 : 0,
        trustScore: referralCode ? 5 : 0,
        referredBy: referralCode || null,
        miningStart: null,
        miningEnd: null,
        lastUpdate: null,
        joinedAt: new Date().toISOString()
      });

      // 🎁 Give bonus to referrer
      if (referralCode) {
        const referrerQuery = doc(db, "users", referralCode);
        const refSnap = await getDoc(referrerQuery);
        if (refSnap.exists()) {
          await updateDoc(referrerQuery, {
            score: increment(5),
            trustScore: increment(5)
          });
        }
      }
    }

    // ✅ Redirect
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("❌ Sign-in failed:", err);
    alert("Login failed. Please try again.");
  }
}

// ✅ Logout handler
function logoutUser() {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("❌ Sign-out failed:", error);
  });
}

// ✅ Auth state listener (global access)
function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// ✅ Export all
export {
  signInWithGoogle,
  logoutUser,
  watchAuth
};
