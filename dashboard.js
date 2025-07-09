// dashboard.js

import { auth, db } from "./auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  updateBalanceUI,
  updateTimerUI,
  updateUserEmailUI,
  updateReferralCountUI,
  getLevelFromBalance,
  getTrustBadge,
  showAnnouncement
} from "./ui.js";

// ✅ AUTH LISTENER
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    alert("User data not found.");
    return;
  }

  const userData = docSnap.data();

  updateUserEmailUI(user.email);
  updateBalanceUI(userData.balance || 0);
  updateReferralCountUI(userData.referralCount || 0);
  document.getElementById("level").textContent = getLevelFromBalance(userData.balance || 0);
  document.getElementById("trust-score").textContent = userData.trustScore || 0;
  document.getElementById("trust-badge").textContent = getTrustBadge(userData.trustScore || 0);

  // Load announcement
  const announcementSnap = await getDoc(doc(db, "announcements", "latest"));
  if (announcementSnap.exists()) {
    showAnnouncement(announcementSnap.data().message);
  }

  // Start countdown
  startCountdown(userData.lastMine);
});

// ✅ MINE BUTTON
document.getElementById("mine-btn")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  const userData = docSnap.data();

  const now = Date.now();
  const lastMine = userData.lastMine ? new Date(userData.lastMine).getTime() : 0;
  const hours24 = 24 * 60 * 60 * 1000;
  const timeDiff = now - lastMine;

  if (timeDiff < hours24) {
    const remaining = Math.floor((hours24 - timeDiff) / 1000);
    updateTimerUI(remaining);
    alert("⏳ Wait for the 24-hour mining cooldown.");
    return;
  }

  // 🔢 Mining Rate Logic
  const baseRate = 0.500; // EANO per hour
  const bonusPerReferral = 0.004; // EANO/hr per active referral

  // 🔍 Count active referrals (lastMine within last 24h)
  const referralQuery = query(
    collection(db, "users"),
    where("referrerId", "==", user.uid)
  );
  const referralSnap = await getDocs(referralQuery);

  let activeReferrals = 0;
  const nowTime = Date.now();
  referralSnap.forEach(doc => {
    const refLastMine = doc.data().lastMine;
    if (refLastMine && nowTime - new Date(refLastMine).getTime() < hours24) {
      activeReferrals++;
    }
  });

  const totalHourlyRate = baseRate + (bonusPerReferral * activeReferrals);
  const earned = parseFloat((totalHourlyRate * 24).toFixed(4));

  const currentBalance = userData.balance || 0;
  const trust = userData.trustScore || 0;

  await updateDoc(userRef, {
    balance: currentBalance + earned,
    trustScore: trust + 10,
    lastMine: new Date().toISOString()
  });

  updateBalanceUI(currentBalance + earned);
  document.getElementById("trust-score").textContent = trust + 10;
  document.getElementById("trust-badge").textContent = getTrustBadge(trust + 10);
  document.getElementById("level").textContent = getLevelFromBalance(currentBalance + earned);

  alert(`✅ Mined ${earned} EANO successfully!`);
  startCountdown(new Date().toISOString());
});

// ✅ LOGOUT
document.getElementById("logout-btn")?.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});

// ⏳ START COUNTDOWN
function startCountdown(lastMineTime) {
  const interval = setInterval(() => {
    const now = Date.now();
    const last = new Date(lastMineTime).getTime();
    const remaining = Math.floor((24 * 60 * 60 * 1000 - (now - last)) / 1000);

    if (remaining > 0) {
      updateTimerUI(remaining);
    } else {
      clearInterval(interval);
      document.getElementById("timer").textContent = "✅ Ready";
    }
  }, 1000);
}
