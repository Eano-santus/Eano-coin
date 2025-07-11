// ✅ Update balance
export function updateBalanceUI(balance) {
  const el = document.getElementById("balance");
  if (el) {
    el.textContent = parseFloat(balance).toFixed(3);
    el.classList.add("fade-in");
  }
}

// ✅ Update mining countdown timer
export function updateTimerUI(seconds) {
  const el = document.getElementById("timer");
  if (el) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    el.textContent = `⏳ ${h}h ${m}m ${s}s`;
  }
}

// ✅ Update user email
export function updateUserEmailUI(email) {
  const el = document.getElementById("user-email");
  if (el) {
    el.textContent = email;
    el.classList.add("fade-in");
  }
}

// ✅ Update referral count
export function updateReferralCountUI(count) {
  const el = document.getElementById("referral-count");
  if (el) {
    el.textContent = count;
    el.classList.add("fade-in");
  }
}

// ✅ Get mining level badge from balance
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

// ✅ Get trust badge from score
export function getTrustBadge(score) {
  if (score >= 1000) return "✅ Trusted Miner";
  if (score >= 500) return "🛡 Reliable Miner";
  if (score >= 300) return "📈 New Miner";
  return "⚠ Low Trust";
}

// ✅ Show announcement
export function showAnnouncement(message) {
  const box = document.getElementById("announcement-box");
  const msg = document.getElementById("latest-announcement");

  if (box && msg && message) {
    msg.textContent = message;
    box.style.display = "block";
    box.classList.add("fade-in");
  } else if (box) {
    box.style.display = "none";
  }
}

// ✅ Sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar-menu");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    sidebar.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        sidebar.classList.remove("open");
      });
    });
  }

  // ✅ Dark mode toggle
  const darkToggle = document.getElementById("dark-toggle");
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });

    // Load saved mode
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.add("dark-mode");
    }
  }
});
