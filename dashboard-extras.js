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

  // === System Notification on MINING END ===
  function notifyMiningEnded() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⛏️ Mining Session Ended", {
          body: "Your 24-hour EANO mining session has ended. Tap to restart.",
          icon: "favicon.ico"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("⛏️ Mining Session Ended", {
              body: "Your 24-hour EANO mining session has ended. Tap to restart.",
              icon: "favicon.ico"
            });
          }
        });
      }
    }
  }

  // 👇 This must be called from your mining logic in dashboard.html
  window.notifyMiningEnded = notifyMiningEnded;
}
