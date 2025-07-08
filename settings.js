import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);

const emailField = document.getElementById("user-email");
const usernameField = document.getElementById("username");
const phoneField = document.getElementById("phone");

const saveUsernameBtn = document.getElementById("save-username");
const savePhoneBtn = document.getElementById("save-phone");
const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, async user => {
  if (user) {
    emailField.value = user.email;

    const userDoc = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      usernameField.value = data.username || "";
      phoneField.value = data.phone || "";
    }
  } else {
    window.location.href = "index.html";
  }
});

saveUsernameBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const username = usernameField.value.trim();
  if (username.length < 4) return alert("Username must be at least 4 characters");

  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { username });
  alert("✅ Username updated");
});

savePhoneBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const phone = phoneField.value.trim();
  if (!phone.startsWith("+")) return alert("Phone number must start with + and country code");

  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { phone });
  alert("✅ Phone number updated");
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
});
