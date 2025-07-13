// ui.js

// Toggle Dark/Light Theme
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");
  localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
}

// Load saved theme on page load
function loadTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
}

// Setup Language Selector
function setupLanguageSelector() {
  const langSelect = document.getElementById("langSelect");
  const savedLang = localStorage.getItem("language");

  if (savedLang && langSelect) {
    langSelect.value = savedLang;
  }

  langSelect?.addEventListener("change", () => {
    const selected = langSelect.value;
    localStorage.setItem("language", selected);
    alert(`🌐 Language switched to: ${selected}`);
    // Optionally: call loadLanguage(selected); if using lang.js
  });
}

// Logout function (used globally)
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Animate cards and announcement on scroll
function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".feature-card, .announcement").forEach(el => {
    observer.observe(el);
  });
}

// Generic clipboard copy (used in profile)
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("✅ Copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy!"));
}

// Auto-init all utilities when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  setupLanguageSelector();
  animateOnScroll();

  const toggleBtn = document.getElementById("toggle-theme");
  toggleBtn?.addEventListener("click", toggleTheme);

  const logoutBtn = document.querySelector(".btn-danger");
  logoutBtn?.addEventListener("click", logout);
});
