// auth.js import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"; import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw", authDomain: "eano-miner.firebaseapp.com", projectId: "eano-miner", storageBucket: "eano-miner.firebasestorage.app", messagingSenderId: "50186911438", appId: "1:50186911438:web:85410fccc7c5933d761a9f", measurementId: "G-NS0W6QSS69" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const provider = new GoogleAuthProvider();

// Elements const loginBtn = document.getElementById("login-btn"); const signupBtn = document.getElementById("signup-btn"); const googleBtn = document.getElementById("google-signin");

if (loginBtn) { loginBtn.addEventListener("click", async () => { const email = document.getElementById("login-email").value; const password = document.getElementById("login-password").value; try { await signInWithEmailAndPassword(auth, email, password); window.location.href = "dashboard.html"; } catch (err) { alert("Login Failed: " + err.message); } }); }

if (signupBtn) { signupBtn.addEventListener("click", async () => { const email = document.getElementById("signup-email").value; const password = document.getElementById("signup-password").value; try { const result = await createUserWithEmailAndPassword(auth, email, password); await setDoc(doc(db, "users", result.user.uid), { email: result.user.email, balance: 0, lastMine: null }); window.location.href = "dashboard.html"; } catch (err) { alert("Signup Failed: " + err.message); } }); }

if (googleBtn) { googleBtn.addEventListener("click", async () => { try { const result = await signInWithPopup(auth, provider); const userDoc = doc(db, "users", result.user.uid); const userSnap = await getDoc(userDoc); if (!userSnap.exists()) { await setDoc(userDoc, { email: result.user.email, balance: 0, lastMine: null }); } window.location.href = "dashboard.html"; } catch (err) { alert("Google Sign-In Failed: " + err.message); } }); }

