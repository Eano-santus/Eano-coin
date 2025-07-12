// ui.js

// Toggle Dark/Light Theme
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// Setup language selector
function setupLanguageSelector() {
  const langSelect = document.getElementById("langSelect");
  const savedLang = localStorage.getItem("language");

  if (savedLang) langSelect.value = savedLang;

  langSelect.addEventListener("change", () => {
    const selected = langSelect.value;
    localStorage.setItem("language", selected);
    alert("🌐 Language switched to: " + selected);
    // Optionally: load translations via lang.js
  });
}

// Logout handler
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Animate elements on scroll (optional)
function animateOnScroll() {
  const elements = document.querySelectorAll(".feature-card, .announcement");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    observer.observe(el);
  });
}

// Copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("✅ Copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy!"));
}

// Initialize all when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  setupLanguageSelector();

  const toggleBtn = document.getElementById("toggle-theme");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);

  animateOnScroll();

  const logoutBtn = document.querySelector(".btn-danger");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
