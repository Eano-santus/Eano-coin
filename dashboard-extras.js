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

  // === Ask for Notification Permission Early
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // === Show Notification on MINING END
  function notifyMiningEnded() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⛏️ Mining Session Ended", {
          body: "Your 24-hour EANO mining session has ended. Tap to restart.",
          icon: "favicon.ico"
        });
      }
    }
  }

  // 👇 Called from dashboard.html when mining ends
  window.notifyMiningEnded = notifyMiningEnded;
}
