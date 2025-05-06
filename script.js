let canvas = document.getElementById("wheel");
let ctx = canvas.getContext("2d");
let names = [];
let colors = [];
let startAngle = 0;
let spinning = false;
let preselectedWinner = "";

function createWheel() {
  const rawInput = document.getElementById("namesInput").value.trim();
  names = rawInput.split("\n").map(name => name.trim()).filter(name => name !== "");
  preselectedWinner = document.getElementById("preselectedName").value.trim();

  if (names.length < 2) {
    alert("Cần ít nhất 2 người chơi.");
    return;
  }

  colors = generateColors(names.length);
  drawWheel();
  document.getElementById("result").textContent = "";
}

function generateColors(num) {
  const result = [];
  const hueStep = 360 / num;
  for (let i = 0; i < num; i++) {
    result.push(`hsl(${i * hueStep}, 70%, 60%)`);
  }
  return result;
}

function drawWheel() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);
  const arc = 2 * Math.PI / names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.fillText(names[i], radius - 10, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || names.length < 2) return;

  let winnerIndex;
  if (preselectedWinner) {
    winnerIndex = names.indexOf(preselectedWinner);
    if (winnerIndex === -1) {
      alert("Tên người trúng không có trong danh sách.");
      return;
    }
  } else {
    winnerIndex = Math.floor(Math.random() * names.length);
  }

  const arc = 2 * Math.PI / names.length;
  const stopAngle = (3 * Math.PI / 2) - (winnerIndex * arc + arc / 2);
  const totalRotation = (Math.PI * 10) + stopAngle;

  let duration = 4000;
  let start = null;
  spinning = true;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);

    startAngle = eased * totalRotation;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      document.getElementById("result").innerText = `🎉 Người trúng là: ${names[winnerIndex]} 🎉`;
    }
  }

  requestAnimationFrame(animate);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}
