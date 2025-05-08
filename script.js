const imageUrl = 'images/IMG_1194.JPG';  // Đảm bảo thay bằng đường dẫn đúng đến ảnh bạn đã tải lên

let pieces = [];
let correctPositions = [];
let shuffledPositions = [];
let draggingPiece = null;  // Mảnh ghép đang được kéo

window.onload = function() {
    createPuzzle(imageUrl);
}

function createPuzzle(imageUrl) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = function () {
        // Xóa các mảnh cũ (nếu có)
        document.getElementById('game-board').innerHTML = '';
        
        const pieceWidth = img.width / 3;
        const pieceHeight = img.height / 3;

        pieces = [];
        correctPositions = [];
        shuffledPositions = [];

        // Chia ảnh thành 9 mảnh và lưu các mảnh vào mảng
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                ctx.drawImage(img, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                pieces.push(canvas.toDataURL());

                // Lưu vị trí đúng của từng mảnh
                correctPositions.push({ row, col });

                // Thêm mảnh vào game board
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                pieceElement.style.backgroundImage = `url(${canvas.toDataURL()})`;
                pieceElement.style.backgroundSize = `${img.width}px ${img.height}px`;
                pieceElement.dataset.index = pieces.length - 1;
                pieceElement.style.top = `${Math.random() * (pieceHeight * 2)}px`;
                pieceElement.style.left = `${Math.random() * (pieceWidth * 2)}px`;

                // Thêm sự kiện cho mảnh ghép
                pieceElement.addEventListener('touchstart', handleDragStart);
                pieceElement.addEventListener('mousedown', handleDragStart);

                pieceElement.addEventListener('touchmove', handleDragMove);
                pieceElement.addEventListener('mousemove', handleDragMove);

                pieceElement.addEventListener('touchend', handleDragEnd);
                pieceElement.addEventListener('mouseup', handleDragEnd);

                document.getElementById('game-board').appendChild(pieceElement);
            }
        }

        shufflePieces();  // Làm xáo trộn các mảnh

        // Ẩn thông báo hoàn thành
        document.getElementById('message').classList.add('hidden');
    };
}

function handleDragStart(e) {
    e.preventDefault();
    draggingPiece = e.target;

    const touch = e.touches ? e.touches[0] : e;  // Sử dụng touch hoặc mouse event
    draggingPiece.offsetX = touch.clientX - draggingPiece.getBoundingClientRect().left;
    draggingPiece.offsetY = touch.clientY - draggingPiece.getBoundingClientRect().top;
}

function handleDragMove(e) {
    e.preventDefault();
    if (!draggingPiece) return;

    const touch = e.touches ? e.touches[0] : e;  // Sử dụng touch hoặc mouse event
    draggingPiece.style.left = `${touch.clientX - draggingPiece.offsetX}px`;
    draggingPiece.style.top = `${touch.clientY - draggingPiece.offsetY}px`;
}

function handleDragEnd(e) {
    e.preventDefault();
    if (!draggingPiece) return;

    const targetPos = getTargetPosition(draggingPiece);

    // Kiểm tra xem mảnh ghép có nằm đúng vị trí không
    if (isPieceInCorrectPosition(draggingPiece, targetPos)) {
        placePieceInCorrectPosition(draggingPiece, targetPos);
    }

    draggingPiece = null;
    checkCompletion();
}

function getTargetPosition(piece) {
    const index = piece.dataset.index;
    const correctPosition = correctPositions[index];
    return correctPosition;
}

function isPieceInCorrectPosition(piece, targetPos) {
    const pieceRect = piece.getBoundingClientRect();
    const targetRect = document.getElementById('game-board').getBoundingClientRect();

    // Kiểm tra nếu mảnh ghép gần đúng với vị trí
    const threshold = 10;  // Giới hạn độ lệch cho phép
    return (
        Math.abs(pieceRect.left - targetRect.left - targetPos.col * pieceRect.width) < threshold &&
        Math.abs(pieceRect.top - targetRect.top - targetPos.row * pieceRect.height) < threshold
    );
}

function placePieceInCorrectPosition(piece, targetPos) {
    const pieceRect = piece.getBoundingClientRect();
    piece.style.left = `${targetPos.col * pieceRect.width}px`;
    piece.style.top = `${targetPos.row * pieceRect.height}px`;
    piece.classList.add('correct');  // Đánh dấu mảnh đã ghép đúng
    piece.removeEventListener('touchstart', handleDragStart);
    piece.removeEventListener('mousedown', handleDragStart);
}

function shufflePieces() {
    shuffledPositions = [...Array(9).keys()].sort(() => Math.random() - 0.5);

    const piecesDivs = document.querySelectorAll('#game-board div');
    piecesDivs.forEach((div, index) => {
        const randomIndex = shuffledPositions[index];
        div.style.backgroundImage = `url(${pieces[randomIndex]})`;
        div.dataset.index = randomIndex;
    });
}

function checkCompletion() {
    const allCorrect = Array.from(document.querySelectorAll('#game-board div')).every((div, index) => {
        return div.classList.contains('correct');
    });

    if (allCorrect) {
        document.getElementById('message').classList.remove('hidden');
    }
}
