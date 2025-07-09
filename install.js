import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let deferredPrompt;

// Only show if not already installed
const isAlreadyInstalled = () =>
  localStorage.getItem("eano_installed") === "true" ||
  window.matchMedia("(display-mode: standalone)").matches;

window.addEventListener("beforeinstallprompt", (e) => {
  if (isAlreadyInstalled()) return;

  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement("button");
  installBtn.textContent = "⬇️ Install EANO App";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "20px";
  installBtn.style.right = "20px";
  installBtn.style.zIndex = "9999";
  installBtn.style.padding = "12px 16px";
  installBtn.style.background = "gold";
  installBtn.style.color = "#000";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "8px";
  installBtn.style.fontWeight = "bold";
  installBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

  installBtn.onclick = () => {
    installBtn.remove();
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("✅ App installed by user");

        // Store locally
        localStorage.setItem("eano_installed", "true");

        // Save to Firestore
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const ref = doc(db, "installations", user.uid);
            setDoc(ref, {
              uid: user.uid,
              installedAt: new Date().toISOString(),
              platform: navigator.platform || "unknown",
              userAgent: navigator.userAgent || "unknown"
            }, { merge: true }).then(() => {
              console.log("📦 Installation saved to Firestore.");
            }).catch((err) => {
              console.error("❌ Firestore error:", err);
            });
          }
        });

      } else {
        console.log("❌ User dismissed install");
      }
    });
  };

  document.body.appendChild(installBtn);
});
