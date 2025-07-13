import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

// 🔐 Firebase config (same as in auth.js)
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 💾 Check if installed already
const isAlreadyInstalled = () =>
  localStorage.getItem("eano_installed") === "true" ||
  window.matchMedia("(display-mode: standalone)").matches;

// 📦 Handle install prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  if (isAlreadyInstalled()) return;

  e.preventDefault();
  deferredPrompt = e;

  // ✨ Create floating install button
  const installBtn = document.createElement("button");
  installBtn.textContent = "⬇️ Install EANO App";
  Object.assign(installBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    padding: "12px 16px",
    background: "gold",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontSize: "16px",
    cursor: "pointer"
  });

  installBtn.onclick = () => {
    installBtn.remove();
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === "accepted") {
        console.log("✅ App installed");

        localStorage.setItem("eano_installed", "true");

        // ✅ Save to Firestore if user is logged in
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const ref = doc(db, "installations", user.uid);
            setDoc(ref, {
              uid: user.uid,
              installedAt: new Date().toISOString(),
              platform: navigator.platform || "unknown",
              userAgent: navigator.userAgent || "unknown"
            }, { merge: true }).then(() => {
              console.log("📦 Install info saved to Firestore.");
            }).catch((err) => {
              console.error("❌ Failed to save install info:", err);
            });
          }
        });

      } else {
        console.log("❌ User dismissed install");
      }
    });
  };

  // ➕ Add to page
  document.body.appendChild(installBtn);
});
