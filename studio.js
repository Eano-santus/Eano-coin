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

    setTimeout(() => {
      loader.style.display = "none";

      const sampleTrack = uploadedBeat ? URL.createObjectURL(uploadedBeat) : 'sample.mp3';

      resultDiv.innerHTML = `
        <h3>🎧 Your Song is Ready!</h3>
        <p><em>"${lyrics.slice(0, 120)}..."</em></p>
        <audio controls>
          <source src="${sampleTrack}" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <br/>
        <a href="${sampleTrack}" download="EANO-Track.mp3" class="download-btn">⬇️ Download Song</a>
        <p class="hint">More features coming: AI voice, autotune, harmony layering and full music generation.</p>
      `;
    }, 3000);
  });
});
