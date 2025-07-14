import { auth, db } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const walletBalance = document.getElementById("wallet-balance");
const transactionsList = document.getElementById("transactions-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "index.html");

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    const data = snap.data();
    walletBalance.textContent = data.balance?.toFixed(3) || "0.000";
  } else {
    walletBalance.textContent = "0.000";
  }

  // 🧾 Load transactions
  const txQuery = query(
    collection(db, "transactions"),
    where("uid", "==", user.uid),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const txSnap = await getDocs(txQuery);

  transactionsList.innerHTML = "";
  if (txSnap.empty) {
    transactionsList.innerHTML = "<li>No transactions yet.</li>";
  } else {
    txSnap.forEach(doc => {
      const tx = doc.data();
      const type = tx.type || "unknown";
      const amount = parseFloat(tx.amount || 0).toFixed(3);
      const time = new Date(tx.timestamp).toLocaleString();
      const li = document.createElement("li");
      li.textContent = `${type.toUpperCase()} • ${amount} EANO • ${time}`;
      transactionsList.appendChild(li);
    });
  }
});

// 🌗 Theme toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});
