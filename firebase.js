// firebase.js

// Import Firebase modules from CDN (Modular SDK v10.12.2)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";

// ✅ EANO Coin Miner – Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Services
const auth = getAuth(app);              // User Authentication
const db = getFirestore(app);           // Firestore Database
const storage = getStorage(app);        // Cloud Storage
const performance = getPerformance(app); // Performance Monitoring

// ✅ Conditionally load Analytics and Messaging if supported (for Netlify HTTPS)
let analytics = null;
isAnalyticsSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

let messaging = null;
isMessagingSupported().then((supported) => {
  if (supported) messaging = getMessaging(app);
});

// ✅ Export everything for use across your app
export {
  app,
  auth,
  db,
  storage,
  performance,
  analytics,
  messaging
};
