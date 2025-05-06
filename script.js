let names = [];
let angles = [];
let colors = [];
let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");
let startAngle = 0;
let spinTimeout = null;
let spinAngle = 0;
let isSpinning = false;
let preselectedWinner = "";

function createWheel() {
  const rawNames = document.getElementById("namesInput").value.trim().split("\n").filter(n => n);
  preselectedWinner = document.getElementById("preselectedName").value.trim();
  if (rawNames.length < 2) {
    alert("Cần ít nhất 2 người chơi!");
    return;
  }

  names = rawNames;
  colors = generateColors(names.length);
  angles = names.map((_, i) => (2 * Math.PI * i) / names.length);
  drawWheel();
  document.getElementById("result").textContent = "";
}

function generateColors(count) {
  const colors = [];
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
}

function drawWheel() {
  const arc = 2 * Math.PI / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, angle, angle + arc);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + arc / 2);
    ctx.fillStyle = "black";
    ctx.font = "16px sans-serif";
    ctx.fillText(names[i], 120, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (isSpinning || names.length < 2) return;

  isSpinning = true;
  let winnerIndex = -1;

  if (preselectedWinner) {
    winnerIndex = names.indexOf(preselectedWinner);
    if (winnerIndex === -1) {
      alert("Tên được chỉ định không có trong danh sách!");
      isSpinning = false;
      return;
    }
  } else {
    winnerIndex = Math.floor(Math.random() * names.length);
  }

  const arc = 2 * Math.PI / names.length;
  const stopAngle = (3 * Math.PI / 2) - (winnerIndex * arc + arc / 2); // Top center
  const spinRevolutions = 5 * 2 * Math.PI;
  const finalAngle = spinRevolutions + stopAngle;

  animateSpin(finalAngle, winnerIndex);
}

function animateSpin(targetAngle, winnerIndex) {
  const duration = 5000; // 5 seconds
  const start = performance.now();

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4); // Easing
    startAngle = easeOut * targetAngle;

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      isSpinning = false;
      document.getElementById("result").textContent = `🎉 Người trúng là: ${names[winnerIndex]} 🎉`;
    }
  }

  requestAnimationFrame(step);
}
