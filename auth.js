document.addEventListener("DOMContentLoaded", () => {
  // Wait for Firebase Auth to load
  firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
      // Not logged in: Redirect to login page
      window.location.href = "signup.html"; // change to your login/signup page
      return;
    }

    const uid = user.uid;
    const userRef = firebase.firestore().collection("users").doc(uid);
    
    try {
      const doc = await userRef.get();

      // If it's a new user, set up default profile
      if (!doc.exists) {
        const referralCode = uid.slice(0, 6); // Auto-generate referral code
        await userRef.set({
          email: user.email || '',
          score: 5, // Initial score
          lastMine: 0,
          referralCode: referralCode,
          referredBy: null, // Can be filled if user used a referral link
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("New user profile created.");
      }
    } catch (error) {
      console.error("Error accessing Firestore user profile:", error);
    }
  });
});
