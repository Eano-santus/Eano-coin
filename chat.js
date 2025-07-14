import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🧠 References
const messagesContainer = document.getElementById("messages");
const input = document.getElementById("chatMessage");
const sendBtn = document.getElementById("sendMessage");

// 🔔 Notification Sound Setup
const notificationSound = new Audio("sounds/notify.mp3");
let lastMessageTimestamp = null;

function notifyIfNewMessage(msg, currentUser) {
  if (!msg.createdAt?.seconds || msg.uid === currentUser.uid) return;

  if (!lastMessageTimestamp || msg.createdAt.seconds > lastMessageTimestamp) {
    lastMessageTimestamp = msg.createdAt.seconds;
    notificationSound.play().catch(() => console.log("🔇 Autoplay blocked"));
  }
}

// ✉️ Send new chat message
async function sendMessage(user) {
  const text = input.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "chatMessages"), {
      uid: user.uid,
      name: user.displayName || user.email || "Anonymous",
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (e) {
    console.error("❌ Failed to send message:", e);
  }
}

// 🔁 Real-time chat loader
function loadMessages(user) {
  const q = query(collection(db, "chatMessages"), orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.className = "message-bubble";
      div.innerHTML = `<strong>${msg.name}:</strong> ${msg.text}`;
      messagesContainer.appendChild(div);

      // ✅ Trigger notification
      notifyIfNewMessage(msg, user);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

// 🔐 Wait for user auth before loading chat
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMessages(user);
    sendBtn.addEventListener("click", () => sendMessage(user));
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage(user);
    });
  } else {
    messagesContainer.innerHTML = `<p>🔒 Please log in to chat.</p>`;
    sendBtn.disabled = true;
    input.disabled = true;
  }
});
import { setupBadgeUpdates } from "./ui.js";
setupBadgeUpdates({ chat: "chat-badge" });
