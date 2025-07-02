import { auth, db, onAuthStateChanged, signOut, doc, getDoc, updateDoc } from "./firebase.js";

const profileForm = document.getElementById("profile-form");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let currentUserUid = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserUid = user.uid;
    // Load profile data
    const docRef = doc(db, "users", currentUserUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("firstName").value = data.firstName || "";
      document.getElementById("lastName").value = data.lastName || "";
      document.getElementById("username").value = data.username || "";
    }
  } else {
    // Not logged in, redirect to login
    window.location.href = "login.html";
  }
});

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const username = document.getElementById("username").value.trim();

  if (!firstName || !lastName || !username) {
    message.textContent = "Please fill in all fields.";
    message.style.color = "red";
    return;
  }

  try {
    const userDocRef = doc(db, "users", currentUserUid);
    await updateDoc(userDocRef, {
      firstName,
      lastName,
      username,
    });
    message.textContent = "Profile updated successfully!";
    message.style.color = "green";
  } catch (error) {
    message.textContent = "Error updating profile: " + error.message;
    message.style.color = "red";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});
