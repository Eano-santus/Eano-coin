document.addEventListener("DOMContentLoaded", () => {
  const mineButton = document.getElementById("mineButton");
  const countdownEl = document.getElementById("countdown");
  const scoreEl = document.getElementById("score");
  const trustEl = document.getElementById("trustScore");
  const levelEl = document.getElementById("minerLevel");
  const codeDisplay = document.getElementById("codeDisplay");
  const linkDisplay = document.getElementById("linkDisplay");

  let userId, userRef;
  const miningRate = 10;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      userId = user.uid;
      userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        const referralCode = generateReferralCode();
        const referredBy = getReferralFromURL();
        await userRef.set({
          uid: userId,
          email: user.email,
          score: 5,
          lastMined: null,
          referralCode,
          referredBy
        });

        if (referredBy) {
          rewardReferrer(referredBy);
        }
      }

      loadUserData();
    } else {
      window.location.href = "login.html";
    }
  });

  function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function getReferralFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  }

  async function rewardReferrer(code) {
    const refSnapshot = await db.collection("users").where("referralCode", "==", code).get();
    if (!refSnapshot.empty) {
      const refDoc = refSnapshot.docs[0];
      const refData = refDoc.data();
      await refDoc.ref.update({
        score: (refData.score || 0) + 5
      });
    }
  }

  async function loadUserData() {
    const doc = await userRef.get();
    const data = doc.data();

    scoreEl.textContent = "Your Score: " + (data.score || 0);
    updateTrustAndLevel(data.score || 0);

    const lastMined = data.lastMined ? new Date(data.lastMined.toDate()) : null;
    handleCountdown(lastMined);

    codeDisplay.textContent = data.referralCode || "N/A";
    linkDisplay.href = `${window.location.origin}/signup.html?ref=${data.referralCode}`;
    linkDisplay.textContent = linkDisplay.href;
  }

  mineButton.addEventListener("click", async () => {
    const doc = await userRef.get();
    const data = doc.data();
    const now = new Date();
    const lastMined = data.lastMined ? new Date(data.lastMined.toDate()) : null;
    const hoursPassed = lastMined ? (now - lastMined) / 3600000 : 25;

    if (hoursPassed >= 24) {
      const newScore = (data.score || 0) + miningRate;
      await userRef.update({
        score: newScore,
        lastMined: now
      });
      scoreEl.textContent = "Your Score: " + newScore;
      updateTrustAndLevel(newScore);
      handleCountdown(now);
    } else {
      alert("⏳ You can only mine once every 24 hours.");
    }
  });

  function updateTrustAndLevel(score) {
    let trust = "Needs Trust";
    if (score >= 500) trust = "Trusted Miner";
    else if (score >= 200) trust = "Reliable Miner";
    else if (score >= 5) trust = "New Miner";

    let level = "Amateurs";
    if (score >= 10000) level = "Leaders";
    else if (score >= 5000) level = "Masters";
    else if (score >= 1000) level = "Professionals";
    else if (score >= 500) level = "Elites";

    trustEl.textContent = "Trust Status: " + trust;
    levelEl.textContent = "Miner Level: " + level;
  }

  function handleCountdown(lastMined) {
    const interval = setInterval(() => {
      if (!lastMined) {
        countdownEl.textContent = "Next mine available now!";
        mineButton.disabled = false;
        return;
      }

      const now = new Date();
      const nextMine = new Date(lastMined.getTime() + 24 * 60 * 60 * 1000);
      const remaining = nextMine - now;

      if (remaining <= 0) {
        countdownEl.textContent = "Next mine available now!";
        mineButton.disabled = false;
        clearInterval(interval);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        countdownEl.textContent = `Next mine in: ${hours}h ${minutes}m ${seconds}s`;
        mineButton.disabled = true;
      }
    }, 1000);
  }
});
