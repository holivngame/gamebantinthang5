// 🛠️ Tên người trúng "được chỉ định"
const FIXED_WINNER = "Nguyễn Văn A";

let players = [];
let angles = [];
let startAngle = 0;
let arc = 0;
let spinning = false;
let ctx;

function drawWheel() {
  const input = document.getElementById("playerInput").value.trim();
  const canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");

  players = input.split("\n").map(p => p.trim()).filter(p => p !== "");
  if (players.length < 2) {
    alert("Cần ít nhất 2 người chơi!");
    return;
  }

  arc = 2 * Math.PI / players.length;
  angles = players.map((_, i) => i * arc);

  // Vẽ lại vòng quay
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players.forEach((name, i) => {
    const angle = startAngle + i * arc;

    // Màu ngẫu nhiên
    ctx.fillStyle = `hsl(${i * 360 / players.length}, 70%, 60%)`;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 240, angle, angle + arc);
    ctx.lineTo(250, 250);
    ctx.fill();

    // Vẽ tên
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.fillText(name, 230, 10);
    ctx.restore();
  });

  drawPointer();
}

function drawPointer() {
  const canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 30);
  ctx.lineTo(260, 30);
  ctx.closePath();
  ctx.fill();
}

function spinWheel() {
  if (spinning || players.length < 2) return;

  const canvas = document.getElementById("wheel");
  spinning = true;

  // Xác định index người trúng
  let targetIndex;
  if (players.includes(FIXED_WINNER)) {
    targetIndex = players.indexOf(FIXED_WINNER);
  } else {
    targetIndex = Math.floor(Math.random() * players.length);
  }

  const targetAngle = 2 * Math.PI - (targetIndex * arc + arc / 2);
  const extraSpins = 5; // số vòng quay thêm
  const totalRotation = extraSpins * 2 * Math.PI + targetAngle;

  let rotation = 0;
  let speed = 0.1;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startAngle += speed;
    drawWheel();
    drawPointer();

    rotation += speed;
    if (rotation >= totalRotation) {
      spinning = false;
      const winner = players[targetIndex];
      document.getElementById("result").textContent = `🎉 Người chiến thắng: ${winner}`;
      return;
    }

    // Giảm tốc dần
    if (rotation > totalRotation - 2 * Math.PI) {
      speed *= 0.98;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function reset() {
  document.getElementById("playerInput").value = "";
  document.getElementById("result").textContent = "";
  const canvas = document.getElementById("wheel");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spinning = false;
  players = [];
}
