import { auth } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Simulated rate (update this later to fetch live rates)
const conversionRate = 0.25; // 1 EANO = $0.25

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

document.getElementById("rate").textContent = conversionRate.toFixed(2);

document.getElementById("eano-amount").addEventListener("input", () => {
  const amount = parseFloat(document.getElementById("eano-amount").value) || 0;
  const usdValue = amount * conversionRate;
  document.getElementById("usd-value").textContent = usdValue.toFixed(2);
});

// 🌗 Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
