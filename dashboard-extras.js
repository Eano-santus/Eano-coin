// === DASHBOARD EXTRAS ===

if (window.location.pathname.includes("dashboard.html")) {
  // === 1. Fade-in Animation on Scroll ===
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

  // === 2. Sound Player Helper ===
  function playSound(url) {
    const audio = new Audio(url);
    audio.play().catch(err => console.warn("🔇 Sound blocked or not found:", err));
  }

  // === 3. Notify When Mining Ends ===
  function notifyMiningEnded() {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("⛏️ Mining Session Ended", {
          body: "Your 24-hour EANO mining session has ended. Tap to restart.",
          icon: "favicon.ico"
        });
        playSound('sounds/mining-end.mp3');
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

  // === 4. Expose to Global Mining Logic (dashboard.html) ===
  window.notifyMiningEnded = notifyMiningEnded;

  // === 5. Optional: Mine Tab Animation Feedback (if desired) ===
  const mineBtn = document.querySelector(".circle-mine");
  if (mineBtn) {
    mineBtn.classList.add("active");
  }
}
