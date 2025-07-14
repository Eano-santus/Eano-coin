// settings.js import { getAuth, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"; import { getFirestore, doc, getDoc, updateDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth(); const db = getFirestore();

// Avatar Gallery (pixel/cartoon avatars) const avatarGallery = document.getElementById("avatar-gallery"); const avatarList = ["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"];

function renderAvatars(selectedAvatar) { avatarGallery.innerHTML = avatarList.map(src => <img src="avatars/${src}" class="avatar-option ${selectedAvatar === src ? 'selected' : ''}" data-avatar="${src}" />).join("");

document.querySelectorAll(".avatar-option").forEach(img => { img.addEventListener("click", () => { updateAvatar(img.dataset.avatar); }); }); }

async function updateAvatar(avatarFile) { const user = auth.currentUser; if (!user) return alert("Not logged in."); try { const userRef = doc(db, "users", user.uid); await updateDoc(userRef, { avatar: avatarFile }); alert("✅ Avatar updated!"); renderAvatars(avatarFile); } catch (err) { console.error("Failed to update avatar", err); } }

// Email Verification const verifyBtn = document.getElementById("verify-email"); const emailStatus = document.getElementById("email-status");

verifyBtn.addEventListener("click", () => { const user = auth.currentUser; if (user) { sendEmailVerification(user) .then(() => alert("📨 Verification email sent.")) .catch(err => console.error("Email verify failed", err)); } });

// Username / Real Name Editing const usernameInput = document.getElementById("username"); const realnameInput = document.getElementById("realname"); const saveNameBtn = document.getElementById("save-name");

saveNameBtn.addEventListener("click", async () => { const user = auth.currentUser; if (!user) return alert("Login required");

const userRef = doc(db, "users", user.uid); const snapshot = await getDoc(userRef); const data = snapshot.data();

const now = new Date(); const lastChanged = data?.nameUpdatedAt ? new Date(data.nameUpdatedAt) : null; const daysSinceChange = lastChanged ? (now - lastChanged) / (1000 * 60 * 60 * 24) : 999;

if (daysSinceChange < 14) { return alert("⏳ You can only change your name every 14 days."); }

try { await updateDoc(userRef, { username: usernameInput.value.trim(), realName: realnameInput.value.trim(), nameUpdatedAt: serverTimestamp() }); alert("✅ Name updated!"); } catch (err) { console.error("Name update failed", err); } });

// Auto-load user info onAuthStateChanged(auth, async (user) => { if (user) { const docRef = doc(db, "users", user.uid); const docSnap = await getDoc(docRef); const data = docSnap.data();

usernameInput.value = data?.username || "";
realnameInput.value = data?.realName || "";
emailStatus.textContent = user.emailVerified ? "✅ Email verified" : "❌ Not verified";

renderAvatars(data?.avatar || "avatar1.png");

} });

