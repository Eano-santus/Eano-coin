// auth.js

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    // Not logged in — redirect to login/signup
    window.location.href = "signup.html";
    return;
  }

  const uid = user.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);

  try {
    const doc = await userRef.get();

    if (!doc.exists) {
      // First-time user: set default values
      const defaultData = {
        score: 5,
        trust: 5,
        referrals: 0,
        lastMine: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await userRef.set(defaultData);
    }

    const userData = (await userRef.get()).data();

    // Display score
    document.getElementById("score").textContent = `Your Score: ${userData.score || 0}`;

    // Trust Level Logic
    let trustLabel = "Needs Trust";
    const trust = userData.trust || 0;
    if (trust >= 500) trustLabel = "Trusted Miner";
    else if (trust >= 200) trustLabel = "Reliable Miner";
    else if (trust >= 80) trustLabel = "New Miner";
    document.getElementById("trustScore").textContent = `Trust Status: ${trustLabel}`;

    // Miner Level Logic
    let level = "Amateur";
    const score = userData.score || 0;
    if (score >= 10000) level = "Leader";
    else if (score >= 5000) level = "Master";
    else if (score >= 1000) level = "Professional";
    else if (score >= 500) level = "Elite";
    else if (score >= 50) level = "Amateur";
    document.getElementById("minerLevel").textContent = `Miner Level: ${level}`;

    // Referral Code = UID
    document.getElementById("codeDisplay").textContent = uid;
    document.getElementById("linkDisplay").href = `https://your-netlify-domain.netlify.app/signup.html?ref=${uid}`;
    document.getElementById("linkDisplay").textContent = `https://your-netlify-domain.netlify.app/signup.html?ref=${uid}`;

  } catch (error) {
    console.error("Auth error:", error);
    alert("Error loading user data. Please try again.");
  }
});
