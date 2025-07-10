// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzNpblYEjxZvOtuwao3JakP-FaZAT-Upw",
  authDomain: "eano-miner.firebaseapp.com",
  projectId: "eano-miner",
  storageBucket: "eano-miner.appspot.com",
  messagingSenderId: "50186911438",
  appId: "1:50186911438:web:85410fccc7c5933d761a9f",
  measurementId: "G-NS0W6QSS69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const performance = getPerformance(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Persistence error:", error.message);
});

let analytics = null;
let messaging = null;

isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

isMessagingSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export {
  app,
  auth,
  db,
  storage,
  analytics,
  messaging,
  performance
};
