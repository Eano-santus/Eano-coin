// install.js
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

const app = getApp(); // use already initialized app
const auth = getAuth(app);
const db = getFirestore(app);

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement("button");
  installBtn.textContent = "⬇️ Install EANO App";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "20px";
  installBtn.style.right = "20px";
  installBtn.style.zIndex = "9999";
  installBtn.style.padding = "10px";
  installBtn.style.background = "gold";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "8px";

  installBtn.onclick = async () => {
    installBtn.remove();
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("✅ App installed");

      const user = auth.currentUser;
      if (user) {
        const installRef = doc(db, "installations", user.uid);
        await setDoc(installRef, {
          uid: user.uid,
          email: user.email || null,
          installedAt: new Date().toISOString(),
          platform: navigator.platform || "unknown",
          userAgent: navigator.userAgent
        });
      }
    } else {
      console.log("❌ App dismissed");
    }
  };

  document.body.appendChild(installBtn);
});
