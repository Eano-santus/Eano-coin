// studio-next.js
import {
  getFirestore, collection, query, orderBy, limit, getDocs, updateDoc, doc, where, increment
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// 🎯 TrustScore + EANO reward
export async function rewardTrustScoreOnUpload(uid) {
  if (!uid) return;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      trustScore: increment(5),
      balance: increment(0.5)
    });
    console.log("✅ TrustScore and 0.5 EANO rewarded");
  } catch (err) {
    console.error("❌ Reward failed:", err);
  }
}

// 📈 Trending Songs by Likes
export async function loadTrendingCreations() {
  const container = document.getElementById("trending-creations");
  if (!container) return;
  container.innerHTML = "<p>Loading trending songs...</p>";

  try {
    const q = query(collection(db, "studioTracks"), orderBy("likes", "desc"), limit(5));
    const snapshot = await getDocs(q);
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      container.innerHTML += `
        <div class="feature-card">
          <p><strong>${data.genre}</strong> • ${data.displayName}</p>
          <audio controls src="${data.downloadURL}"></audio>
          <p>❤️ ${data.likes} • ${new Date(data.uploadedAt).toLocaleDateString()}</p>
        </div>
      `;
    });

  } catch (err) {
    container.innerHTML = "<p>❌ Failed to load trending songs.</p>";
    console.error(err);
  }
}

// 🎙️ Voice Recorder (Browser Audio API)
export function setupVoiceRecorder(buttonId, audioPlayerId) {
  const recordBtn = document.getElementById(buttonId);
  const audioPlayer = document.getElementById(audioPlayerId);
  if (!recordBtn || !audioPlayer) return;

  let mediaRecorder;
  let chunks = [];

  recordBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      recordBtn.textContent = "⏹️ Stop Recording";

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        audioPlayer.src = URL.createObjectURL(blob);
        audioPlayer.style.display = "block";
        audioPlayer.play();
        recordBtn.textContent = "🔴 Record";
        chunks = [];
      };

      recordBtn.onclick = () => {
        mediaRecorder.stop();
        recordBtn.onclick = null;
      };
    } catch (err) {
      alert("❌ Recording failed: " + err.message);
    }
  });
}

// 🌍 Public Feed with Genre Filter
export async function loadPublicFeed(genre = "all") {
  const container = document.getElementById("explore-feed");
  if (!container) return;

  container.innerHTML = "<p>Loading songs...</p>";
  try {
    let q = collection(db, "studioTracks");
    q = genre !== "all"
      ? query(q, where("genre", "==", genre))
      : query(q, orderBy("uploadedAt", "desc"), limit(20));

    const snapshot = await getDocs(q);
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const d = doc.data();
      container.innerHTML += `
        <div class="feature-card">
          <p><strong>${d.genre}</strong> • ${d.displayName}</p>
          <audio controls src="${d.downloadURL}"></audio>
          <p><em>${d.lyrics.slice(0, 80)}...</em></p>
        </div>
      `;
    });

  } catch (e) {
    container.innerHTML = "<p>❌ Could not load feed.</p>";
    console.error(e);
  }
}

// 🧠 AI Beat Suggestion (simple random logic)
export function suggestAIBeat(genre) {
  const afro = ["afro1.mp3", "afro2.mp3"];
  const ama = ["ama1.mp3", "ama2.mp3"];
  const naija = ["naija1.mp3", "naija2.mp3"];
  const gospel = ["gos1.mp3", "gos2.mp3"];
  const pop = ["pop1.mp3", "pop2.mp3"];

  const pool = {
    amapiano: ama,
    afrobeat: afro,
    naijastreet: naija,
    gospel,
    pop
  }[genre] || ["sample.mp3"];

  const selected = pool[Math.floor(Math.random() * pool.length)];
  return `beats/${selected}`;
}

// 🧑‍🤝‍🧑 Collaborator Suggestions (static demo)
export function suggestCollabUsers() {
  const container = document.getElementById("collab-suggestions");
  if (!container) return;

  const suggestions = ["@EanoStar", "@NaijaWaves", "@PianoKing", "@RapQueen"];
  container.innerHTML = `
    <h3>🤝 Suggested Collabs</h3>
    <ul>${suggestions.map(user => `<li>${user}</li>`).join("")}</ul>
  `;
}
