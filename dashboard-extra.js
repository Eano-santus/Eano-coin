// dashboard-extras.js

// Fade-in animation on scroll const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('fade-in'); } }); });

document.querySelectorAll('.feature-card').forEach(card => { observer.observe(card); });

// Play sound function playSound(url) { const audio = new Audio(url); audio.play(); }

// Show notification on mining start function notifyMiningStarted() { if ("Notification" in window && Notification.permission === "granted") { new Notification("⛏️ Mining Started", { body: "Your 24-hour EANO mining session is now active!", icon: "favicon.ico" }); } else if (Notification.permission !== "denied") { Notification.requestPermission(); }

// Optional sound feedback playSound('sounds/mining-start.mp3'); }

// Trigger mining notification on load window.addEventListener("load", () => { notifyMiningStarted(); });

