// ui.js

// Update the balance on the dashboard
export function updateBalanceUI(balance) {
  const el = document.getElementById("balance");
  if (el) {
    el.textContent = balance.toFixed(3);
    el.classList.add("fade-in");
  }
}

// Update the mining countdown timer
export function updateTimerUI(remainingSeconds) {
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    timerEl.textContent = `⏳ ${h}h ${m}m ${s}s`;
  }
}

// Update user email
export function updateUserEmailUI(email) {
  const el = document.getElementById("user-email");
  if (el) {
    el.textContent = email;
    el.classList.add("fade-in");
  }
}

// Update referral count
export function updateReferralCountUI(count) {
  const el = document.getElementById("referral-count");
  if (el) {
    el.textContent = count;
    el.classList.add("fade-in");
  }
}

// Get mining level from balance (same logic)
export function getLevelFromBalance(balance) {
  if (balance >= 3000) return "🐘 Elephant";
  if (balance >= 2000) return "🦍 Gorilla";
  if (balance >= 1000) return "🦁 Lion";
  if (balance >= 500) return "🦒 Giraffe";
  if (balance >= 250) return "🐺 Wolf";
  if (balance >= 100) return "🐶 Dog";
  if (balance >= 5) return "🐹 Hamster";
  if (balance >= 1) return "🐥 Chicken";
  return "⛏ Beginner";
}

// Get trust badge from trust score (same logic)
export function getTrustBadge(score) {
  if (score >= 1000) return "✅ Trusted Miner";
  if (score >= 500) return "🛡 Reliable Miner";
  if (score >= 300) return "📈 New Miner";
  return "⚠ Low Trust";
}

// ✅ Show announcement from Firestore
export function showAnnouncement(message) {
  const box = document.getElementById("announcement-box");
  const msg = document.getElementById("latest-announcement");

  if (box && msg && message) {
    box.style.display = "block";
    msg.textContent = message;
    box.classList.add("fade-in");
  } else if (box) {
    box.style.display = "none";
  }
}

// ✅ MENU TOGGLE (Fixes Mine tab being hidden and menu overlay)
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle?.addEventListener("click", () => {
  menu.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

menu?.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => {
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});
