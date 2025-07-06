// auth.js

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.firebasestorage.app",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname;

  if (user && currentPage.includes("index.html")) {
    window.location.href = "dashboard.html";
  }

  if (!user && currentPage.includes("dashboard.html")) {
    window.location.href = "index.html";
  }
});

// SIGNUP
window.signup = function (e) {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Signup Error: " + error.message);
    });
};

// LOGIN
window.login = function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login Error: " + error.message);
    });
};

// LOGOUT
window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Logout Error: " + error.message);
    });
};
