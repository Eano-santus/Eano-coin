// === DASHBOARD EXTRA=== if (window.location.pathname.includes("dashboard.html")) { // === Fade-in Animation on Scroll === const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('fade-in'); } }); });

document.querySelectorAll('.feature-card').forEach(card => { observer.observe(card); });

// === Notification + Sound for Mining Start === function playSound(url) { const audio = new Audio(url); audio.play(); }

function notifyMiningStarted() { if ("Notification" in window) { if (Notification.permission === "granted") { new Notification("\u26CF\ufe0f Mining Started", { body: "Your 24-hour EANO mining session is now active!", icon: "favicon.ico" }); playSound('sounds/mining-start.mp3'); // Make sure this file exists } else if (Notification.permission !== "denied") { Notification.requestPermission().then(permission => { if (permission === "granted") { new Notification("\u26CF\ufe0f Mining Started", { body: "Your 24-hour EANO mining session is now active!", icon: "favicon.ico" }); playSound('sounds/mining-start.mp3'); } }); } } }

// Automatically run when dashboard loads window.addEventListener("load", () => { notifyMiningStarted(); }); }

