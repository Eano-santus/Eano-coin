// leaderboard.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"; import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.appspot.com", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app); const auth = getAuth(app);

const leaderboardBody = document.getElementById("leaderboard-body");

function getLevel(balance) { if (balance >= 3000) return { label: "Grandmaster", badge: "🥇" }; if (balance >= 1500) return { label: "Master", badge: "🥈" }; if (balance >= 800) return { label: "Elite", badge: "🥉" }; if (balance >= 200) return { label: "Amateur", badge: "🎖️" }; return { label: "Beginner", badge: "🔰" }; }

function getTrust(score) { if (score >= 1000) return "O.G Miner 🧠"; if (score >= 499) return "Trusted Miner 🛡️"; if (score >= 200) return "Reliable Miner ✅"; if (score >= 79) return "New Miner 🚀"; return "Need Trust ⚠️"; }

onAuthStateChanged(auth, async user => { if (!user) { window.location.href = "index.html"; return; }

const q = query(collection(db, "users"), orderBy("balance", "desc")); const snapshot = await getDocs(q);

let rank = 1; snapshot.forEach(doc => { const data = doc.data(); const balance = data.balance || 0; const referrals = data.referrals || 0; const trust = getTrust(referrals); const level = getLevel(balance);

const row = document.createElement("tr");
row.innerHTML = `
  <td>${rank++}</td>
  <td>${data.email || "Anonymous"}</td>
  <td>${balance.toFixed(3)}</td>
  <td>${level.badge} ${level.label}</td>
  <td>${trust}</td>
`;
leaderboardBody.appendChild(row);

}); });

