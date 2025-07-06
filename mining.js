// mining.js

const mineButton = document.getElementById('mineButton');
const countdownDisplay = document.getElementById('countdown');

let countdownInterval;

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "signup.html";
    return;
  }

  const uid = user.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);

  try {
    const doc = await userRef.get();
    if (!doc.exists) return;

    const userData = doc.data();
    const lastMine = userData.lastMine || 0;
    const now = Date.now();
    const timeLeft = 86400000 - (now - lastMine); // 24 hours = 86400000 ms

    if (timeLeft > 0) {
      disableMiningButton(timeLeft);
    } else {
      enableMiningButton();
    }
  } catch (error) {
    console.error("Error loading mining status:", error);
  }

  mineButton.addEventListener('click', async () => {
    try {
      const doc = await userRef.get();
      const userData = doc.data();
      const lastMine = userData.lastMine || 0;
      const now = Date.now();

      if (now - lastMine < 86400000) {
        alert("You can only mine once every 24 hours.");
        return;
      }

      const newScore = (userData.score || 0) + 1;
      await userRef.update({
        score: newScore,
        lastMine: now
      });

      document.getElementById("score").textContent = `Your Score: ${newScore}`;
      alert("Successfully mined 1 EANO!");
      disableMiningButton(86400000); // Start 24h countdown again
    } catch (error) {
      console.error("Mining failed:", error);
      alert("An error occurred. Try again later.");
    }
  });
});

function disableMiningButton(timeLeft) {
  mineButton.disabled = true;
  updateCountdown(timeLeft);
  countdownInterval = setInterval(() => {
    timeLeft -= 1000;
    updateCountdown(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      enableMiningButton();
    }
  }, 1000);
}

function enableMiningButton() {
  mineButton.disabled = false;
  countdownDisplay.textContent = "You can mine now!";
}

function updateCountdown(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  countdownDisplay.textContent = `Next mine available in: ${hours}h ${minutes}m ${seconds}s`;
}
