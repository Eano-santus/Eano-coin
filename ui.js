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

// Language Selector
function setupLanguageSelector() {
  const langSelect = document.getElementById("langSelect");
  if (!langSelect) return;

  const savedLang = localStorage.getItem("language");
  if (savedLang) langSelect.value = savedLang;

  langSelect.addEventListener("change", () => {
    const selected = langSelect.value;
    localStorage.setItem("language", selected);
    alert("🌐 Language switched to: " + selected);
    // Optionally load translations via lang.js
  });
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Scroll animation
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

// Clipboard Copy
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("✅ Copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy!"));
}

// TrustScore Badge (can be reused)
function getTrustBadge(score) {
  if (score >= 5000) return "🌟 O.G";
  if (score >= 1000) return "🟢 Trusted Miner";
  if (score >= 500) return "🟡 Reliable Miner";
  if (score >= 300) return "🔵 New Miner";
  return "🔴 Low Trust";
}

// Mining Level (reusable)
function getMiningLevel(balance) {
  if (balance >= 10000) return "🐉 Dragon";
  if (balance >= 5000) return "🐘 Elephant";
  if (balance >= 2500) return "🦍 Gorilla";
  if (balance >= 1200) return "🐻 Bear";
  if (balance >= 600) return "🐯 Lion";
  if (balance >= 300) return "🐼 Panda";
  if (balance >= 150) return "🐺 Wolf";
  if (balance >= 50) return "🐹 Hamster";
  return "🐥 Chicken";
}

// Avatar Gallery
function setupAvatarGallery() {
  const gallery = document.getElementById("avatarGallery");
  const preview = document.getElementById("selectedAvatar");

  if (!gallery || !preview) return;

  const avatars = gallery.querySelectorAll("img");

  avatars.forEach(avatar => {
    avatar.addEventListener("click", () => {
      const url = avatar.src;
      preview.src = url;
      localStorage.setItem("avatar", url);
      avatars.forEach(a => a.classList.remove("selected"));
      avatar.classList.add("selected");
    });
  });

  const saved = localStorage.getItem("avatar");
  if (saved) {
    preview.src = saved;
    avatars.forEach(a => {
      if (a.src === saved) a.classList.add("selected");
    });
  }
}

// Generate QR (for referral/profile)
function generateQR(referralUrl) {
  import('https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js').then(() => {
    new QRious({
      element: document.getElementById("qrCanvas"),
      value: referralUrl,
      size: 150
    });
  }).catch(err => console.error("QR library failed:", err));
}

// Copy referral button
function setupCopyRefButton() {
  const copyBtn = document.getElementById("copyRefBtn");
  const input = document.getElementById("refLink");

  if (copyBtn && input) {
    copyBtn.addEventListener("click", () => {
      copyToClipboard(input.value);
    });
  }
}

// Initialize all
window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  setupLanguageSelector();
  animateOnScroll();

  if (document.getElementById("toggle-theme")) {
    document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
  }

  if (document.querySelector(".btn-danger")) {
    document.querySelector(".btn-danger").addEventListener("click", logout);
  }

  setupAvatarGallery();
  setupCopyRefButton();
});
