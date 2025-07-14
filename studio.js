import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// 🔼 Upload song to Firebase Storage
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

// 💾 Save to Firestore
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
  } catch (e) {
    console.error("❌ Firestore save failed:", e);
  }
}

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
      if (!user) return alert("Please log in first.");

      uploadSongToStorage(uploadedBeat, user.uid, (downloadURL) => {
        loader.style.display = "none";
        resultDiv.innerHTML = `
          <h3>🎧 Your Song is Ready!</h3>
          <p><em>"${lyrics.slice(0, 120)}..."</em></p>
          <audio controls>
            <source src="${downloadURL}" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <br/>
          <a href="${downloadURL}" download="EANO-Track.mp3" class="download-btn">⬇️ Download Song</a>
          <p class="hint">More features coming: AI voice, autotune, harmony layering and full music generation.</p>
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
      // No beat uploaded, use default sample
      loader.style.display = "none";
      const sampleTrack = 'sample.mp3';
      resultDiv.innerHTML = `
        <h3>🎧 Your Sample ${genre} Track is Ready!</h3>
        <p><em>"${lyrics.slice(0, 120)}..."</em></p>
        <audio controls>
          <source src="${sampleTrack}" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <br/>
        <a href="${sampleTrack}" download="EANO-Track.mp3" class="download-btn">⬇️ Download Sample</a>
        <p class="hint">To save your track and upload a real beat, please upload your own audio file.</p>
      `;
    }
  });
});
