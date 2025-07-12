/* ──────────────────────────────────────────────
   ui.js  •  Presentation helpers for dashboard
   ────────────────────────────────────────────── */

/* =============  Generic helpers  ============= */
function $(id) { return document.getElementById(id); }
function fmt(num, digits = 3) { return Number(num).toFixed(digits); }

// ✅ Coin balance display
export function updateBalanceUI(balance = 0) {
  const el = $("balance");
  if (el) el.textContent = fmt(balance);
}

// ✅ Mining countdown timer
export function updateTimerUI(remainingSeconds) {
  const el = document.getElementById("timer");
  if (el) {
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    el.textContent = `⏳ ${h}h ${m}m ${s}s`;
  }
}

// ✅ Announcement update
export function updateAnnouncementUI(text = "") {
  const box = $("announcement-box");
  if (box) box.textContent = text || "📢 No announcement yet…";
}

// ✅ Sidebar toggle
(function initMenuToggle () {
  const toggleBtn = $("menu-toggle");
  const menu      = $("sidebar-menu");
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
    document.body.classList.toggle("blur");
  });

  menu.querySelectorAll("a, button").forEach(el =>
    el.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("blur");
    })
  );
})();

// ✅ Theme toggle
(function initThemeToggle () {
  const btn  = $("dark-toggle");
  if (!btn) return;

  const stored = localStorage.getItem("theme");
  if (stored === "light") document.body.classList.add("light-mode");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", mode);
  });
})();

// ✅ Exports
export default {
  updateBalanceUI,
  updateTimerUI,
  updateAnnouncementUI
};
