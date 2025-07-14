// studio.js
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const lyricsInput = document.getElementById("lyrics");
  const genreSelect = document.getElementById("genre");
  const resultDiv = document.getElementById("result");
  const uploadInput = document.getElementById("uploadInput");

  generateBtn.addEventListener("click", () => {
    const lyrics = lyricsInput.value.trim();
    const genre = genreSelect.value;

    if (!lyrics) {
      resultDiv.innerHTML = "<p class='error'>✏️ Please write your lyrics first.</p>";
      return;
    }

    resultDiv.innerHTML = "<p>🎶 Generating your <strong>" + genre + "</strong> song...</p>";

    setTimeout(() => {
      resultDiv.innerHTML = `
        <h3>🎧 Your Song is Ready!</h3>
        <p><em>"${lyrics.slice(0, 80)}..."</em></p>
        <audio controls>
          <source src="placeholder-song.mp3" type="audio/mpeg">
          Your browser does not support the audio tag.
        </audio>
        <p class="hint">This is a simulated track. Future versions will support real AI music generation.</p>
      `;
    }, 3000);
  });

  uploadInput.addEventListener("change", () => {
    const file = uploadInput.files[0];
    if (file) {
      console.log("User uploaded:", file.name);
    }
  });
});
