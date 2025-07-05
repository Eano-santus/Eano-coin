// referral.js

import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Utility: Get referral ID from URL
function getReferralIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

// Handle referral logic
async function handleReferral(newUserUid) {
  const referrerUid = getReferralIdFromURL();
  if (!referrerUid || referrerUid === newUserUid) return;

  const newUserRef = doc(db, "miners", newUserUid);
  const newUserSnap = await getDoc(newUserRef);

  // Only process if referral not already assigned
  if (!newUserSnap.exists() || !newUserSnap.data().referredBy) {
    // Update new user with referredBy
    await setDoc(newUserRef, {
      referredBy: referrerUid,
      score: 5, // Start with bonus 5 scores
      lastMined: null,
      createdAt: serverTimestamp(),
      uid: newUserUid
    }, { merge: true });

    // Update referrer’s score
    const referrerRef = doc(db, "miners", referrerUid);
    const referrerSnap = await getDoc(referrerRef);

    if (referrerSnap.exists()) {
      const currentScore = referrerSnap.data().score || 0;
      await updateDoc(referrerRef, {
        score: currentScore + 5
      });
    } else {
      // Referrer does not exist in DB yet — create them
      await setDoc(referrerRef, {
        uid: referrerUid,
        score: 5,
        lastMined: null,
        createdAt: serverTimestamp()
      });
    }

    console.log("Referral bonus granted!");
  }
}

// Monitor auth and process referral
auth.onAuthStateChanged((user) => {
  if (user) {
    handleReferral(user.uid);
  }
});
