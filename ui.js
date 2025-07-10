// ui.js

// ✅ Update the balance on the dashboard
export function updateBalanceUI(balance) {
  const el = document.getElementById("balance");
  if (el) {
    el.textContent = balance.toFixed(3);
    el.classList.add("fade-in");
  }
}

// ✅ Update the mining countdown timer
export function updateTimerUI(remainingSeconds) {
  const timerEl = document.getElementById("timer");
  if (timerEl) {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    timerEl.textContent = `⏳ ${h}h ${m}m ${s}s`;
  }
}

// ✅ Update user email on UI
export function updateUserEmailUI(email) {
  const el = document.getElementById("user-email");
  if (el) {
    el.textContent = email;
    el.classList.add("fade-in");
  }
}

// ✅ Update referral count on UI
export function updateReferralCountUI(count) {
  const el = document.getElementById("referral-count");
  if (el) {
    el.textContent = count;
    el.classList.add("fade-in");
  }
}

// ✅ Determine mining level from balance
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

// ✅ Determine trust badge from trust score
export function getTrustBadge(score) {
  if (score >= 1000) return "✅ Trusted Miner";
  if (score >= 500) return "🛡 Reliable Miner";
  if (score >= 300) return "📈 New Miner";
  return "⚠ Low Trust";
}

// ✅ Show announcement message in box
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

// ✅ Sidebar Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebarMenu = document.getElementById("sidebar-menu");

  if (toggleBtn && sidebarMenu) {
    toggleBtn.addEventListener("click", () => {
      sidebarMenu.classList.toggle("open");
    });

    sidebarMenu.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        sidebarMenu.classList.remove("open");
      });
    });
  }
});

// ✅ Dark/Light Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("eanoTheme", isDark ? "dark" : "light");
    });

    const savedTheme = localStorage.getItem("eanoTheme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }
});
