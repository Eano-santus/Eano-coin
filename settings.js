// settings.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app);

const emailEl = document.getElementById("user-email"); const balanceEl = document.getElementById("user-balance"); const trustScoreEl = document.getElementById("trust-score"); const minerLevelEl = document.getElementById("miner-level");

onAuthStateChanged(auth, async (user) => { if (!user) { window.location.href = "index.html"; return; }

const userRef = doc(db, "users", user.uid); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) { emailEl.textContent = user.email; balanceEl.textContent = "Balance: 0.000 EANO"; trustScoreEl.textContent = "Trust: Needs Trust 🧯"; minerLevelEl.textContent = "Level: Beginner 🪖"; return; }

const data = userSnap.data(); const balance = data.balance || 0; const trust = data.trustScore || 0;

emailEl.textContent = user.email; balanceEl.textContent = Balance: ${balance.toFixed(3)} EANO;

// Trust Badge let trustLabel = "Needs Trust"; let trustBadge = "🧯"; if (trust >= 1000) { trustLabel = "O.G Miner"; trustBadge = "👑"; } else if (trust >= 500) { trustLabel = "Trusted Miner"; trustBadge = "🧠"; } else if (trust >= 200) { trustLabel = "Reliable Miner"; trustBadge = "🛡"; } else if (trust >= 80) { trustLabel = "New Miner"; trustBadge = "🐣"; }

trustScoreEl.textContent = Trust: ${trustLabel} ${trustBadge};

// Level Badge let level = "Beginner"; let levelBadge = "🪖"; if (balance >= 5000) { level = "Legend"; levelBadge = "👽"; } else if (balance >= 3000) { level = "Grandmaster"; levelBadge = "🐉"; } else if (balance >= 1500) { level = "Master"; levelBadge = "🧙"; } else if (balance >= 800) { level = "Elite"; levelBadge = "🎯"; } else if (balance >= 200) { level = "Amateur"; levelBadge = "🏅"; }

minerLevelEl.textContent = Level: ${level} ${levelBadge}; });

