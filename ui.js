/* ──────────────────────────────────────────────
   ui.js  •  Presentation helpers for dashboard
   ────────────────────────────────────────────── */

/* =============  Generic helpers  ============= */
function $(id) { return document.getElementById(id); }
function fmt(num, digits = 3) { return Number(num).toFixed(digits); }

/* =============  Live-updating fields  ============= */

/** Update the coin balance box */
export function updateBalanceUI(balance = 0) {
  const el = $("balance");
  if (el) el.textContent = fmt(balance);
}

/** Update the HHh MMm SSs countdown below the Mine button */
export function updateTimerUI(secondsLeft = 0) {
  const t = $("timer");
  if (!t) return;
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  t.textContent = `⏳ ${h}h ${m}m ${s}s`;
}

/** Drop a headline-style announcement in the centre block */
export function updateAnnouncementUI(text = "") {
  const box = $("announcement-box");
  if (box) box.textContent = text || "📢 No announcement yet…";
}

/* =============  Slide-out left menu  ============= */
(function initMenuToggle () {
  const toggleBtn = $("menu-toggle");
  const menu      = $("sidebar-menu");
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("open");          // slide in / out
    document.body.classList.toggle("blur")  // optional backdrop blur
  });

  // Close the menu when any link inside it is clicked
  menu.querySelectorAll("a, button").forEach(el =>
    el.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("blur");
    })
  );
})();

/* =============  Theme (dark / light)  ============= */
(function initThemeToggle () {
  const btn  = $("dark-toggle");
  if (!btn) return;

  // Apply stored preference on load
  const stored = localStorage.getItem("theme");
  if (stored === "light") document.body.classList.add("light-mode");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", mode);
  });
})();

/* =============  Exports for other modules  ============= */
export default {
  updateBalanceUI,
  updateTimerUI,
  updateAnnouncementUI
};
