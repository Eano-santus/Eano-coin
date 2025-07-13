// === DASHBOARD EXTRA ===
if (window.location.pathname.includes("dashboard.html")) {
  // === Fade-in Animation on Scroll ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });

  document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
  });

  // === Notification + Sound on MINING END ===
  function playSound(url) {
    const audio = new Audio(url);
    audio.play().catch(err => console.warn("🔇 Sound blocked or not found:", err));
  }

  function notifyMiningEnded() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⛏️ Mining Session Ended", {
          body: "Your 24-hour EANO mining session has ended. Tap to restart.",
          icon: "favicon.ico"
        });
        playSound('sounds/mining-end.mp3'); // Make sure this file exists in /sounds/
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("⛏️ Mining Session Ended", {
              body: "Your 24-hour EANO mining session has ended. Tap to restart.",
              icon: "favicon.ico"
            });
            playSound('sounds/mining-end.mp3');
          }
        });
      }
    }
  }

  // 👇 This must be called from your mining logic (dashboard.html)
  window.notifyMiningEnded = notifyMiningEnded;
}
