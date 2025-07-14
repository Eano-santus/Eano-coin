// ✅ EANO UI Manager

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// 🌗 Dark/Light Mode Toggle
export function setupThemeToggle(buttonId) {
  const toggleBtn = document.getElementById(buttonId);
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// 🔔 Global Toast Notification
export function showNotification(message, sound = true) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);

  if (sound) {
    const audio = new Audio("sounds/notify.mp3");
    audio.play().catch(() => {});
  }
}

// 👤 Load and Show User Info (name + avatar)
export function loadUserInfo(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      container.innerHTML = `<p>🔒 Not signed in</p>`;
      return;
    }

    const avatarUrl = user.photoURL || "avatars/default.png";
    const name = user.displayName || user.email || "EANO User";

    container.innerHTML = `
      <img src="${avatarUrl}" class="avatar-small" alt="User Avatar" />
      <span>${name}</span>
    `;
  });
}

// 🌍 Language Switcher
export function setupLanguageSwitcher(selectId, defaultLang = "en") {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.value = localStorage.getItem("lang") || defaultLang;

  select.addEventListener("change", () => {
    const lang = select.value;
    localStorage.setItem("lang", lang);
    location.reload();
  });
}

// 📲 PWA Install Prompt
export function setupPWAInstall(buttonId) {
  let deferredPrompt;
  const installBtn = document.getElementById(buttonId);
  if (!installBtn) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "inline-block";

    installBtn.addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          deferredPrompt = null;
          installBtn.style.display = "none";
        });
      }
    });
  });
}

// 🧠 Badge Counter for Notifications (Games, Studio, Chat, etc.)
export function setupBadgeUpdates(badgeMap) {
  // badgeMap = { chat: "chat-badge", studio: "studio-badge", games: "games-badge" }
  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    const uid = user.uid;

    Object.entries(badgeMap).forEach(([type, elementId]) => {
      const badgeEl = document.getElementById(elementId);
      if (!badgeEl) return;

      const ref = doc(db, "notifications", `${uid}_${type}`);
      onSnapshot(ref, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.unread && data.unread > 0) {
            badgeEl.textContent = data.unread;
            badgeEl.style.display = "inline-block";
          } else {
            badgeEl.style.display = "none";
          }
        } else {
          badgeEl.style.display = "none";
        }
      });
    });
  });
}
