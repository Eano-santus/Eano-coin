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

// === Notification + Sound for Mining Start ===
function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}

function notifyMiningStarted() {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("⛏️ Mining Started", {
        body: "Your 24-hour EANO mining session is now active!",
        icon: "favicon.ico"
      });
      playSound('sounds/mining-start.mp3'); // Make sure the file exists
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("⛏️ Mining Started", {
            body: "Your 24-hour EANO mining session is now active!",
            icon: "favicon.ico"
          });
          playSound('sounds/mining-start.mp3');
        }
      });
    }
  }
}

// OPTIONAL: Automatically trigger on page load (you can remove this if calling from runMining)
window.addEventListener("load", () => {
  notifyMiningStarted();
});
