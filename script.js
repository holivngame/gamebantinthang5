// 🛠️ Cấu hình người trúng "được chỉ định"
const FIXED_WINNER = "Đinh Văn Sơn"; // ← Đổi tên tại đây nếu cần

function startDraw() {
  const input = document.getElementById("playerInput").value.trim();
  const resultEl = document.getElementById("result");

  if (!input) {
    resultEl.textContent = "Vui lòng nhập danh sách người chơi.";
    return;
  }

  const players = input.split('\n').map(p => p.trim()).filter(p => p !== "");

  if (players.length < 1) {
    resultEl.textContent = "Danh sách không hợp lệ.";
    return;
  }

  // Nếu người trúng được chỉ định có trong danh sách, thì chọn họ
  let winner;
  if (players.includes(FIXED_WINNER)) {
    winner = FIXED_WINNER;
  } else {
    // Nếu không, chọn ngẫu nhiên
    const index = Math.floor(Math.random() * players.length);
    winner = players[index];
  }

  resultEl.textContent = `🎉 Người chiến thắng: ${winner}`;
}

function reset() {
  document.getElementById("playerInput").value = "";
  document.getElementById("result").textContent = "";
}
