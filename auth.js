// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Your Firebase config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Auto-protect pages
onAuthStateChanged(auth, (user) => {
  const publicPages = ["index.html", "welcome.html"];
  const isPublic = publicPages.some(path => window.location.pathname.includes(path));

  if (!user && !isPublic) {
    window.location.href = "index.html"; // 🔒 Redirect to login if not logged in
  }
});

// ✅ Optional logout helper (you can call logout() in your button)
export function logout() {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

// ✅ Export everything else
export { app, auth, db };
