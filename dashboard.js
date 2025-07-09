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

// Global mining config fallback
let MINING_CONFIG = {
  baseRate: 0.500,
  bonusPerReferral: 0.004,
  durationHours: 24
};

// ✅ AUTH LISTENER
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // 🔄 Load mining config from Firestore
  try {
    const configSnap = await getDoc(doc(db, "settings", "mining"));
    if (configSnap.exists()) {
      const data = configSnap.data();
      MINING_CONFIG = {
        baseRate: data.baseRate || 0.500,
        bonusPerReferral: data.bonusPerReferral || 0.004,
        durationHours: data.durationHours || 24
      };
    }
  } catch (e) {
    console.warn("⚠ Failed to load mining config. Using defaults.", e);
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

  const announcementSnap = await getDoc(doc(db, "announcements", "latest"));
  if (announcementSnap.exists()) {
    showAnnouncement(announcementSnap.data().message);
  }

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
  const durationMs = MINING_CONFIG.durationHours * 60 * 60 * 1000;
  const timeDiff = now - lastMine;

  if (timeDiff < durationMs) {
    const remaining = Math.floor((durationMs - timeDiff) / 1000);
    updateTimerUI(remaining);
    alert("⏳ Wait for the 24-hour mining cooldown.");
    return;
  }

  // 🔍 Count active referrals
  const referralQuery = query(
    collection(db, "users"),
    where("referrerId", "==", user.uid)
  );
  const referralSnap = await getDocs(referralQuery);

  let activeReferrals = 0;
  referralSnap.forEach(doc => {
    const lastMine = doc.data().lastMine;
    if (lastMine && now - new Date(lastMine).getTime() < durationMs) {
      activeReferrals++;
    }
  });

  const hourlyRate = MINING_CONFIG.baseRate + (MINING_CONFIG.bonusPerReferral * activeReferrals);
  const earned = parseFloat((hourlyRate * MINING_CONFIG.durationHours).toFixed(4));

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
    const remaining = Math.floor((MINING_CONFIG.durationHours * 60 * 60 * 1000 - (now - last)) / 1000);

    if (remaining > 0) {
      updateTimerUI(remaining);
    } else {
      clearInterval(interval);
      document.getElementById("timer").textContent = "✅ Ready";
    }
  }, 1000);
}

// ✅ Toggle right menu (profile slide-out)
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("open");
});
