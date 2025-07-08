// ui.js

// Update the balance on the dashboard export function updateBalanceUI(balance) { const balanceEl = document.getElementById("balance"); if (balanceEl) { balanceEl.textContent = balance.toFixed(3); } }

// Update the mining countdown timer export function updateTimerUI(remainingSeconds) { const timerEl = document.getElementById("timer"); if (timerEl) { const hours = Math.floor(remainingSeconds / 3600); const minutes = Math.floor((remainingSeconds % 3600) / 60); const seconds = remainingSeconds % 60; timerEl.textContent = ⏳ ${hours}h ${minutes}m ${seconds}s; } }

// Update user email display export function updateUserEmailUI(email) { const emailEl = document.getElementById("user-email"); if (emailEl) { emailEl.textContent = email; } }

// Update referral count export function updateReferralCountUI(count) { const countEl = document.getElementById("referral-count"); if (countEl) { countEl.textContent = count; } }

// Get mining level from balance export function getLevelFromBalance(balance) { if (balance >= 3000) return "🐘 Elephant"; if (balance >= 2000) return "🦍 Gorilla"; if (balance >= 1000) return "🦁 Lion"; if (balance >= 500)  return "🦒 Giraffe"; if (balance >= 250)  return "🐺 Wolf"; if (balance >= 100)  return "🐶 Dog"; if (balance >= 5)    return "🐹 Hamster"; if (balance >= 1)    return "🐥 Chicken"; return "⛏ Beginner"; }

// Get trust badge from trust score export function getTrustBadge(trustScore) { if (trustScore >= 1000) return "✅ Trusted Miner"; if (trustScore >= 500) return "🛡 Reliable Miner"; if (trustScore >= 300) return "📈 New Miner"; return "⚠ Low Trust"; }

// Animate elements with fade-in effect export function fadeInElement(el) { if (!el) return; el.style.opacity = 0; el.style.transition = "opacity 1s ease-in-out"; requestAnimationFrame(() => { el.style.opacity = 1; }); }

// Show announcement if available export function showAnnouncement(message) { const box = document.getElementById("announcement-box"); const text = document.getElementById("latest-announcement");

if (box && text) { if (message) { text.textContent = message; box.style.display = "block"; fadeInElement(box); } else { box.style.display = "none"; } } }

