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

  // === Sound Function ===
  function playSound(url) {
    const audio = new Audio(url);
    audio.play().catch(err => console.warn("🔇 Sound blocked or not found:", err));
  }

  // === Mining End Notification + Sound ===
  window.notifyMiningEnded = function () {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⛏️ Mining Ended", {
          body: "Your 24-hour EANO mining session has ended. Tap to restart!",
          icon: "favicon.ico"
        });
        playSound('sounds/mining-ended.mp3');
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("⛏️ Mining Ended", {
              body: "Your 24-hour EANO mining session has ended. Tap to restart!",
              icon: "favicon.ico"
            });
            playSound('sounds/mining-ended.mp3');
          }
        });
      }
    }
  };
}
