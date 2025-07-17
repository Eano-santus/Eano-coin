const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinButton");
const resultMsg = document.getElementById("resultMsg");

const prizes = [0, 5, 10, 0, 20, 15, 0, 30]; // EANO amounts
const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#3f51b5", "#00bcd4", "#e91e63"];
let isSpinning = false;

function drawWheel(rotation = 0) {
  const angle = (2 * Math.PI) / prizes.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  prizes.forEach((prize, i) => {
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 140, angle * i + rotation, angle * (i + 1) + rotation);
    ctx.lineTo(150, 150);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.fillText(`${prize} EANO`, 150 + Math.cos(angle * i + rotation + angle / 2) * 90 - 20, 150 + Math.sin(angle * i + rotation + angle / 2) * 90);
  });
}
drawWheel();

spinBtn.onclick = () => {
  if (isSpinning) return;
  isSpinning = true;
  let rotation = 0;
  let speed = Math.random() * 0.1 + 0.2;
  let duration = 3000 + Math.random() * 2000;

  const start = performance.now();
  function animateWheel(timestamp) {
    const elapsed = timestamp - start;
    if (elapsed < duration) {
      rotation += speed;
      speed *= 0.99;
      drawWheel(rotation);
      requestAnimationFrame(animateWheel);
    } else {
      const segment = Math.floor(prizes.length - (rotation % (2 * Math.PI)) / (2 * Math.PI / prizes.length)) % prizes.length;
      const won = prizes[segment];
      resultMsg.textContent = won > 0 ? `🎉 You won ${won} EANO!` : "😢 Try again!";
      isSpinning = false;

      // Optional: Update user balance in Firebase here
    }
  }
  requestAnimationFrame(animateWheel);
};
