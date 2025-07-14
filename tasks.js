import { auth, db } from "./auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "index.html");
  currentUser = user;
  loadReferralLink();
  checkCheckInStatus();
});

// Daily Check-In Handler
document.getElementById("checkInBtn").addEventListener("click", async () => {
  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const now = Date.now();

  if (!data.lastCheckIn || now - data.lastCheckIn > 86400000) {
    const bonus = (data.balance || 0) + 0.2;
    await updateDoc(ref, {
      balance: bonus,
      lastCheckIn: now
    });
    document.getElementById("checkInStatus").textContent = "🎉 You've checked in!";
  } else {
    document.getElementById("checkInStatus").textContent = "⏳ Already checked in today.";
  }
});

// Referral Link
function loadReferralLink() {
  const username = currentUser.displayName || currentUser.email.split("@")[0];
  const refLink = `https://eano-santus.github.io/eano-coin/?ref=${username}`;
  document.getElementById("referralLink").value = refLink;
}

function copyReferral() {
  const input = document.getElementById("referralLink");
  input.select();
  document.execCommand("copy");
  alert("✅ Referral link copied!");
}

// Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
