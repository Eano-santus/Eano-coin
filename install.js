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
  installBtn.style.padding = "12px 16px";
  installBtn.style.background = "linear-gradient(90deg, #ffc107, #ff9800)";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "12px";
  installBtn.style.color = "#000";
  installBtn.style.fontWeight = "bold";
  installBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  installBtn.style.cursor = "pointer";

  installBtn.onclick = () => {
    installBtn.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("✅ App installed");
      } else {
        console.log("❌ App dismissed");
      }
    });
  };

  document.body.appendChild(installBtn);
});
