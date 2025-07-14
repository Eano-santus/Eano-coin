// ✅ EANO UI Management import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const auth = getAuth();

// 🌗 Dark/Light Mode Toggle export function setupThemeToggle(buttonId) { const toggleBtn = document.getElementById(buttonId); if (!toggleBtn) return; toggleBtn.addEventListener("click", () => { document.body.classList.toggle("light-mode"); localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark"); });

// Load saved theme const savedTheme = localStorage.getItem("theme"); if (savedTheme === "light") { document.body.classList.add("light-mode"); } }

// 🔔 Global Notification System export function showNotification(message, sound = true) { const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message; document.body.appendChild(toast); setTimeout(() => toast.remove(), 4000);

if (sound) { const audio = new Audio("sounds/notify.mp3"); audio.play().catch(() => {}); } }

// 👤 Load and show user info (profile, name, avatar) export function loadUserInfo(containerId) { const container = document.getElementById(containerId); if (!container) return;

onAuthStateChanged(auth, (user) => { if (!user) { container.innerHTML = <p>🔒 Not signed in</p>; return; }

const avatarUrl = user.photoURL || "avatars/default.png";
const name = user.displayName || user.email || "EANO User";

container.innerHTML = `
  <img src="${avatarUrl}" class="avatar-small" alt="User Avatar" />
  <span>${name}</span>
`;

}); }

// 🌍 Language Switcher Setup export function setupLanguageSwitcher(selectId, defaultLang = "en") { const select = document.getElementById(selectId); if (!select) return;

select.value = localStorage.getItem("lang") || defaultLang; select.addEventListener("change", () => { const lang = select.value; localStorage.setItem("lang", lang); location.reload(); }); }

// 📲 PWA Install Prompt export function setupPWAInstall(buttonId) { let deferredPrompt; const installBtn = document.getElementById(buttonId); if (!installBtn) return;

window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; installBtn.style.display = "inline-block";

installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      installBtn.style.display = "none";
    });
  }
});

}); }

