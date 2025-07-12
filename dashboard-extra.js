// Animation on scroll
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

// Notification on mining
function notifyMiningStarted() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⛏️ Mining Started", {
      body: "Your 24-hour EANO mining session is now active!",
      icon: "favicon.ico"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

// Call this when mining starts (you can place it inside startMining or runMining)
window.addEventListener("load", () => {
  notifyMiningStarted();
});

function playSound(url) {
  const audio = new Audio(url);
  audio.play();
}

// Example usage:
function notifyMiningStarted() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⛏️ Mining Started", {
      body: "Your 24-hour EANO mining session is now active!",
      icon: "favicon.ico"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }

  playSound('sounds/mining-start.mp3'); // You must add this file
}
