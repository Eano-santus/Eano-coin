// login.js

import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Elements
const loginForm = document.getElementById("loginForm");
const rememberMeCheckbox = document.getElementById("rememberMe");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const loginStatus = document.getElementById("loginStatus");

let failedAttempts = 0;
const maxAttempts = 5;
const lockoutTime = 60000; // 1 minute lockout

// Function to show messages
function showMessage(message, isError = true) {
  if (loginStatus) {
    loginStatus.textContent = message;
    loginStatus.style.color = isError ? "red" : "green";
  } else {
    alert(message);
  }
}

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (failedAttempts >= maxAttempts) {
    showMessage("Too many failed attempts. Please wait 1 minute.");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showMessage("Please fill in both email and password.");
    return;
  }

  try {
    // Set session or local persistence
    await setPersistence(
      auth,
      rememberMeCheckbox?.checked ? browserLocalPersistence : browserSessionPersistence
    );

    // Attempt login
    await signInWithEmailAndPassword(auth, email, password);

    failedAttempts = 0;
    showMessage("Login successful! Redirecting...", false);

    setTimeout(() => {
      window.location.href = "index.html"; // Redirect to dashboard
    }, 1000);

  } catch (error) {
    failedAttempts++;

    let message = "Login failed.";
    switch (error.code) {
      case "auth/user-not-found":
        message = "No user found with this email.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/too-many-requests":
        message = "Too many login attempts. Please try again later.";
        break;
      default:
        message = error.message;
    }

    showMessage(message);

    if (failedAttempts >= maxAttempts) {
      showMessage("Temporarily locked for 1 minute.");
      setTimeout(() => {
        failedAttempts = 0;
      }, lockoutTime);
    }
  }
});

// Optional: Forgot Password Handler
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", async () => {
    const email = prompt("Enter your registered email for password reset:");
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent. Check your inbox.", false);
    } catch (error) {
      showMessage("Error sending reset email: " + error.message);
    }
  });
}
