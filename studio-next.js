// studio-next.js import { getFirestore, collection, query, orderBy, limit, getDocs, updateDoc, doc, where, increment, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"; import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js"; import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore(); const auth = getAuth(); const storage = getStorage();

// 🎯 Reward on Upload export async function rewardTrustScoreOnUpload(uid) { if (!uid) return; try { const userRef = doc(db, "users", uid); await updateDoc(userRef, { trustScore: increment(5), balance: increment(0.5) }); console.log("✅ TrustScore and 0.5 EANO rewarded"); } catch (err) { console.error("❌ Reward failed:", err); } }

// 📤 Upload Track export async function uploadTrackToFirebase(file, lyrics, genre) { return new Promise((resolve, reject) => { onAuthStateChanged(auth, async (user) => { if (!user) return reject("User not logged in"); const uid = user.uid;

const fileName = `${uid}_${Date.now()}`;
  const storageRef = ref(storage, `studioTracks/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on('state_changed',
    null,
    (error) => reject(error),
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await addDoc(collection(db, "studioTracks"), {
        uid,
        displayName: user.displayName || "Anon",
        genre,
        lyrics,
        downloadURL,
        uploadedAt: Date.now(),
        likes: 0
      });

      await rewardTrustScoreOnUpload(uid);
      resolve(downloadURL);
    }
  );
});

}); }

// 📈 Trending Songs export async function loadTrendingCreations() { const container = document.getElementById("trending-creations"); if (!container) return; container.innerHTML = "<p>Loading trending songs...</p>";

try { const q = query(collection(db, "studioTracks"), orderBy("likes", "desc"), limit(5)); const snapshot = await getDocs(q); container.innerHTML = "";

snapshot.forEach(docSnap => {
  const data = docSnap.data();
  const id = docSnap.id;
  container.innerHTML += generateTrackCard(data, id);
});

attachLikeHandlers();

} catch (err) { container.innerHTML = "<p>❌ Failed to load trending songs.</p>"; } }

// 🌍 Public Feed export async function loadPublicFeed(genre = "all") { const container = document.getElementById("explore-feed"); if (!container) return; container.innerHTML = "<p>Loading songs...</p>";

try { let q = collection(db, "studioTracks"); q = genre !== "all" ? query(q, where("genre", "==", genre)) : query(q, orderBy("uploadedAt", "desc"), limit(20));

const snapshot = await getDocs(q);
container.innerHTML = "";

snapshot.forEach(docSnap => {
  const data = docSnap.data();
  const id = docSnap.id;
  container.innerHTML += generateTrackCard(data, id);
});

attachLikeHandlers();

} catch (err) { container.innerHTML = "<p>❌ Could not load feed.</p>"; } }

// 📂 Load User Tracks export async function loadUserCreations() { const container = document.getElementById("your-creations"); if (!container) return;

onAuthStateChanged(auth, async (user) => { if (!user) return;

const q = query(collection(db, "studioTracks"), where("uid", "==", user.uid), orderBy("uploadedAt", "desc"));
const snapshot = await getDocs(q);
container.innerHTML = "";

snapshot.forEach(docSnap => {
  const data = docSnap.data();
  const id = docSnap.id;
  container.innerHTML += generateTrackCard(data, id);
});

attachLikeHandlers();

}); }

// ❤️ Like Button Logic function attachLikeHandlers() { document.querySelectorAll(".like-btn").forEach(button => { button.addEventListener("click", async () => { const docId = button.dataset.id; const trackRef = doc(db, "studioTracks", docId); await updateDoc(trackRef, { likes: increment(1) }); button.disabled = true; button.textContent = "❤️ Liked!"; }); }); }

// 🔖 Track Card Template function generateTrackCard(data, id) { return <div class="feature-card"> <p><strong>${data.genre}</strong> • ${data.displayName}</p> <audio controls src="${data.downloadURL}"></audio> <p><em>${data.lyrics?.slice(0, 80) || ''}...</em></p> <p>❤️ ${data.likes || 0}</p> <button class="like-btn" data-id="${id}">❤️ Like</button> </div>; }

// 🎙️ Voice Recorder export function setupVoiceRecorder(buttonId, audioPlayerId) { const recordBtn = document.getElementById(buttonId); const audioPlayer = document.getElementById(audioPlayerId); if (!recordBtn || !audioPlayer) return;

let mediaRecorder; let chunks = [];

recordBtn.addEventListener("click", async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); mediaRecorder = new MediaRecorder(stream); mediaRecorder.start(); recordBtn.textContent = "⏹️ Stop Recording";

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

}); }

// 🧠 AI Beat Suggestion export function suggestAIBeat(genre) { const beats = { amapiano: ["ama1.mp3", "ama2.mp3"], afrobeat: ["afro1.mp3", "afro2.mp3"], naijastreet: ["naija1.mp3", "naija2.mp3"], gospel: ["gos1.mp3", "gos2.mp3"], pop: ["pop1.mp3", "pop2.mp3"] }; const pool = beats[genre] || ["default.mp3"]; const selected = pool[Math.floor(Math.random() * pool.length)]; return beats/${selected}; }

// 🧑‍🤝‍🧑 Suggested Collaborators export function suggestCollabUsers() { const container = document.getElementById("collab-suggestions"); if (!container) return; const users = ["@EanoStar", "@NaijaWaves", "@PianoKing", "@RapQueen"]; container.innerHTML = <h3>🤝 Suggested Collabs</h3><ul>${users.map(u => <li>${u}</li>).join('')}</ul>; }

