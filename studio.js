import { storage } from "./firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

// 🔼 Upload song to Firebase Storage
export function uploadSongToStorage(file, userId, callback) {
  const songRef = ref(storage, `songs/${userId}/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(songRef, file);

  uploadTask.on('state_changed', null, 
    (error) => alert("❌ Upload failed: " + error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        callback(url);
      });
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn") || document.getElementById("generate-song");
  const lyricsInput = document.getElementById("lyrics") || document.getElementById("lyrics-input");
  const genreSelect = document.getElementById("genre") || document.getElementById("music-style");
  const resultDiv = document.getElementById("result") || document.getElementById("studio-preview");
  const uploadInput = document.getElementById("uploadInput") || document.getElementById("beat-upload");
  const uploadLabel = document.getElementById("uploadLabel") || document.querySelector(".upload-label");
  const audioPlayer = document.getElementById("audio-player");
  const recordBtn = document.getElementById("start-record");

  const loader = document.getElementById("loader") || {
    style: { display: "none" }
  };

  let uploadedBeat = null;

  // 🌓 Theme toggle
  const themeBtn = document.getElementById("toggle-theme");
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });

  // 🎧 Handle beat upload label
  uploadLabel?.addEventListener("click", () => uploadInput.click());

  uploadInput?.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (file) {
      uploadedBeat = file;
      uploadLabel.textContent = `🎵 ${file.name}`;
    }
  });

  // 🎶 Generate AI-style demo (mocked)
  generateBtn?.addEventListener("click", () => {
    const lyrics = lyricsInput.value.trim();
    const genre = genreSelect.value;

    if (!lyrics) {
      resultDiv.innerHTML = `<p class="error">✍️ Please write your lyrics first.</p>`;
      return;
    }

    loader.style.display = "block";
    resultDiv.innerHTML = `<p>🎶 Generating your <strong>${genre}</strong> song...</p>`;

    setTimeout(() => {
      loader.style.display = "none";

      const sampleTrack = uploadedBeat ? URL.createObjectURL(uploadedBeat) : 'sample.mp3';

      resultDiv.innerHTML = `
        <h3>✅ Your ${genre} Song is Ready!</h3>
        <p><em>"${lyrics.slice(0, 120)}..."</em></p>
        <audio controls>
          <source src="${sampleTrack}" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <br/>
        <a href="${sampleTrack}" download="EANO-${genre}.mp3" class="download-btn">⬇️ Download Song</a>
        <p class="hint">🔬 Experimental: Voice AI, harmony layering & mixing coming soon.</p>
      `;
    }, 3000);
  });

  // 🎤 Handle recording (future feature)
  recordBtn?.addEventListener("click", () => {
    alert("🔒 Recording feature will be available in the next update.");
  });

  // 📤 Upload audio for listening
  document.getElementById("upload-audio")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem("uid") || "guest"; // 🔐 Replace with actual auth if available
    uploadSongToStorage(file, userId, (url) => {
      audioPlayer.src = url;
      audioPlayer.style.display = "block";
      audioPlayer.play();
      alert("✅ Uploaded and playing your song!");
    });
  });
});
