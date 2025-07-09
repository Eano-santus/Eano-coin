import { auth, db } from "./auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// 🌐 Load user data when authenticated
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User data not found.");
    return;
  }

  const data = userSnap.data();

  // Fill UI with data
  document.getElementById("user-email").value = user.email || "";
  document.getElementById("username").value = data.username || "";
  document.getElementById("phone").value = data.phone || "";
  document.getElementById("balance").textContent = (data.balance || 0).toFixed(3);
});

// 💾 Save Username
document.getElementById("save-username")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const username = document.getElementById("username").value.trim();
  if (username.length < 3) {
    alert("Username must be at least 3 characters.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username });
    alert("✅ Username saved!");
  } catch (err) {
    console.error("Error saving username:", err);
    alert("❌ Failed to save username.");
  }
});

// 📞 Save Phone Number
document.getElementById("save-phone")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const phone = document.getElementById("phone").value.trim();
  if (!phone.startsWith("+")) {
    alert("Phone number must start with + and country code.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { phone });
    alert("✅ Phone number saved!");
  } catch (err) {
    console.error("Error saving phone:", err);
    alert("❌ Failed to save phone number.");
  }
});

// 🚪 Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
});
