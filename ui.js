// ui.js — General UI functions for EANO

// Toggle Dark/Light Mode export function toggleTheme() { document.body.classList.toggle("light-mode"); const theme = document.body.classList.contains("light-mode") ? "light" : "dark"; localStorage.setItem("theme", theme); }

// Load theme on page load export function loadTheme() { const saved = localStorage.getItem("theme"); if (saved === "light") { document.body.classList.add("light-mode"); } }

// Language Selector export function setupLanguageSelector() { const langSelect = document.getElementById("langSelect"); if (!langSelect) return; langSelect.addEventListener("change", () => { localStorage.setItem("lang", langSelect.value); location.reload(); }); const savedLang = localStorage.getItem("lang"); if (savedLang) langSelect.value = savedLang; }

// Logout function export function logout() { localStorage.clear(); window.location.href = "index.html"; }

// Copy to clipboard utility export function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => { alert("Copied to clipboard!"); }); }

// Animate elements into view export function animateOnScroll() { const elements = document.querySelectorAll(".feature-card"); const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("fade-in"); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });

elements.forEach(el => observer.observe(el)); }

