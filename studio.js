import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs,
  doc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// 🔼 Upload to Firebase Storage
export function uploadSongToStorage(file, userId, callback) {
  const songRef = ref(storage, `songs/${userId}/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(songRef, file);

  uploadTask.on(
    'state_changed',
    null,
    (error) => alert("❌ Upload failed: " + error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        callback(url);
      });
    }
  );
}

// 💾 Save track to Firestore
export async function saveStudioTrackToFirestore({ url, lyrics, genre, beatName, aiGenerated }) {
  const user = auth.currentUser;
  if (!user) {
    alert("Login required to save your track.");
    return;
  }

  const track = {
    uid: user.uid,
    displayName: user.displayName || user.email || "Anonymous",
    lyrics,
    genre,
    downloadURL: url,
    uploadedAt: new Date().toISOString(),
    trustScoreRewarded: false,
    likes: 0,
    aiGenerated,
    beatName
  };

  try {
    await addDoc(collection(db, "studioTracks"), track);
    console.log("✅ Track saved to Firestore.");
    loadUserCreations(); // refresh list
  } catch (e) {
    console.error("❌ Firestore save failed:", e);
  }
}

// 🎧 Load User's Songs
export async function loadUserCreations() {
  const user = auth.currentUser;
  if (!user) return;

  const tracksRef = collection(db, "studioTracks");
  const q = query(tracksRef, where("uid", "==", user.uid));
  const snapshot = await getDocs(q);

  const container = document.getElementById("your-creations");
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = `<p>No creations yet. Start building now!</p>`;
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    container.innerHTML += `
      <div class="feature-card">
        <p><strong>${data.genre}</strong> • <em>${data.lyrics.slice(0, 60)}...</em></p>
        <audio controls src="${data.downloadURL}"></audio>
        <p>Uploaded: ${new Date(data.uploadedAt).toLocaleString()}</p>
        <p>❤️ <span id="likes-${doc.id}">${data.likes}</span> 
        <button onclick="likeTrack('${doc.id}')">Like</button></p>
      </div>
    `;
  });
}

// ❤️ Like a Track
window.likeTrack = async function (trackId) {
  const trackRef = doc(db, "studioTracks", trackId);
  try {
    await updateDoc(trackRef, { likes: increment(1) });
    const likeCount = document.getElementById(`likes-${trackId}`);
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
  } catch (err) {
    console.error("❌ Failed to like:", err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const lyricsInput = document.getElementById("lyrics");
  const genreSelect = document.getElementById("genre");
  const resultDiv = document.getElementById("result");
  const uploadInput = document.getElementById("uploadInput");
  const loader = document.getElementById("loader");
  const uploadLabel = document.getElementById("uploadLabel");

  let uploadedBeat = null;

  uploadLabel.addEventListener("click", () => uploadInput.click());

  uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (file) {
      uploadedBeat = file;
      uploadLabel.textContent = `🎵 ${file.name}`;
    }
  });

  generateBtn.addEventListener("click", () => {
    const lyrics = lyricsInput.value.trim();
    const genre = genreSelect.value;

    if (!lyrics) {
      resultDiv.innerHTML = `<p class="error">✍️ Please write your lyrics first.</p>`;
      return;
    }

    loader.style.display = "block";
    resultDiv.innerHTML = `<p>🎶 Generating your <strong>${genre}</strong> song...</p>`;

    if (uploadedBeat) {
      const user = auth.currentUser;
      if (!user) {
        loader.style.display = "none";
        return alert("Please log in first.");
      }

      uploadSongToStorage(uploadedBeat, user.uid, (downloadURL) => {
        loader.style.display = "none";
        resultDiv.innerHTML = `
          <h3>🎧 Your Song is Ready!</h3>
          <p><em>"${lyrics.slice(0, 120)}..."</em></p>
          <audio controls>
            <source src="${downloadURL}" type="audio/mpeg" />
          </audio>
          <br/>
          <a href="${downloadURL}" download="EANO-Track.mp3" class="download-btn">⬇️ Download Song</a>
        `;

        // Save to Firestore
        saveStudioTrackToFirestore({
          url: downloadURL,
          lyrics,
          genre,
          beatName: uploadedBeat.name,
          aiGenerated: true
        });
      });
    } else {
      loader.style.display = "none";
      const sampleTrack = 'sample.mp3';
      resultDiv.innerHTML = `
        <h3>🎧 Your Sample ${genre} Track is Ready!</h3>
        <p><em>"${lyrics.slice(0, 120)}..."</em></p>
        <audio controls>
          <source src="${sampleTrack}" type="audio/mpeg" />
        </audio>
        <br/>
        <a href="${sampleTrack}" download="EANO-Track.mp3" class="download-btn">⬇️ Download Sample</a>
        <p class="hint">To save your track and upload a real beat, please upload your own audio file.</p>
      `;
    }
  });

  // ✅ Load previous songs
  loadUserCreations();
});
