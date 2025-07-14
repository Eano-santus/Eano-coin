// studio-next.js import { getFirestore, collection, query, orderBy, limit, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"; import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore(); const auth = getAuth();

// 🎯 TrustScore reward logic on song upload (called externally after successful upload) export async function rewardTrustScoreOnUpload(uid) { if (!uid) return; try { const userRef = doc(db, "users", uid); await updateDoc(userRef, { trustScore: increment(5), balance: increment(0.5) }); console.log("✅ TrustScore and 0.5 EANO rewarded"); } catch (err) { console.error("❌ Reward failed:", err); } }

// 📈 Trending Creations (top liked) export async function loadTrendingCreations() { const container = document.getElementById("trending-creations"); if (!container) return; container.innerHTML = "<p>Loading trending songs...</p>";

try { const q = query(collection(db, "studioTracks"), orderBy("likes", "desc"), limit(5)); const snapshot = await getDocs(q); container.innerHTML = "";

snapshot.forEach(doc => {
  const data = doc.data();
  container.innerHTML += `
    <div class="feature-card">
      <p><strong>${data.genre}</strong> • ${data.displayName}</p>
      <audio controls src="${data.downloadURL}"></audio>
      <p>❤️ ${data.likes} • Uploaded: ${new Date(data.uploadedAt).toLocaleDateString()}</p>
    </div>`;
});

} catch (err) { container.innerHTML = <p>❌ Failed to load trending songs.</p>; console.error(err); } }

// 🎙️ Voice Recording System (init setup) export function setupVoiceRecorder(buttonId, audioPlayerId) { const recordBtn = document.getElementById(buttonId); const audioPlayer = document.getElementById(audioPlayerId);

if (!recordBtn || !audioPlayer) return;

let mediaRecorder; let chunks = [];

recordBtn.addEventListener("click", async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); mediaRecorder = new MediaRecorder(stream); mediaRecorder.start(); recordBtn.textContent = "⏹️ Stop Recording";

mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/mpeg" });
    audioPlayer.src = URL.createObjectURL(blob);
    audioPlayer.style.display = "block";
    audioPlayer.play();
    chunks = [];
    recordBtn.textContent = "🔴 Record";
  };

  recordBtn.onclick = () => {
    mediaRecorder.stop();
    recordBtn.onclick = null;
  };
} catch (err) {
  alert("❌ Recording failed: " + err);
}

}); }

// 🌍 Public Feed with Filters export async function loadPublicFeed(genreFilter = null) { const container = document.getElementById("explore-feed"); if (!container) return;

container.innerHTML = "<p>Loading songs...</p>"; try { let q = collection(db, "studioTracks"); if (genreFilter) { q = query(q, where("genre", "==", genreFilter)); } else { q = query(q, orderBy("uploadedAt", "desc"), limit(20)); }

const snapshot = await getDocs(q);
container.innerHTML = "";
snapshot.forEach(doc => {
  const d = doc.data();
  container.innerHTML += `
    <div class="feature-card">
      <p><strong>${d.genre}</strong> • ${d.displayName}</p>
      <audio controls src="${d.downloadURL}"></audio>
      <p><em>${d.lyrics.slice(0, 80)}...</em></p>
    </div>`;
});

} catch (e) { container.innerHTML = <p>❌ Could not load public feed.</p>; console.error(e); } }

// 🧠 AI Beat Suggestion (basic randomized example) export function suggestAIBeat(genre) { const afroBeats = ["afro1.mp3", "afro2.mp3", "afro3.mp3"]; const amapiano = ["ama1.mp3", "ama2.mp3"];

const pool = genre === "amapiano" ? amapiano : afroBeats; const selected = pool[Math.floor(Math.random() * pool.length)]; return beats/${selected}; }

// 🧑‍🤝‍🧑 Collab Suggestion (mock for now) export function suggestCollabUsers() { const container = document.getElementById("collab-suggestions"); if (!container) return; const users = ["@NaijaStar", "@EanoBeats", "@MeloQueen", "@RapLion"]; container.innerHTML = "<h4>Suggested Collabs:</h4><ul>" + users.map(u => <li>${u}</li>).join("") + "</ul>"; }

