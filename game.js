const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5; // ボードの行列サイズ
const COLORS = ["#f44", "#48f", "#4d6", "#fc3"]; // ボールの色

let board = []; // ボードの初期状態
let CELL; // 1セルの大きさ
let startX = -1, startY = -1; // スワイプ開始位置

function resize() {
    const size = Math.min(innerWidth * 0.7, innerHeight * 0.4);
    CELL = Math.floor(size / SIZE);
    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;
}

window.addEventListener("resize", resize);
resize();

// ボードを初期化
function initBoard() {
    board = [];
    for (let y = 0; y < SIZE; y++) {
        let row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push(Math.floor(Math.random() * COLORS.length));
        }
        board.push(row);
    }

    // 初期に3つ消える箇所があれば再生成
    while (findMatches().length > 0) {
        applyMatches(findMatches());
    }
}

// 描画
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            ctx.fillStyle = COLORS[board[y][x]];
            ctx.beginPath();
            ctx.arc(
                x * CELL + CELL / 2,
                y * CELL + CELL / 2,
                CELL / 2 - 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}

// 揃った箇所を探す関数
function findMatches() {
    let matches = [];

    // 横方向
    for (let y = 0; y < SIZE; y++) {
        let count = 1;
        for (let x = 1; x < SIZE; x++) {
            if (board[y][x] === board[y][x - 1]) {
                count++;
            } else {
                if (count >= 3) {
                    for (let k = 0; k < count; k++) {
                        matches.push([x - 1 - k, y]);
                    }
                }
                count = 1;
            }
        }
        if (count >= 3) {
            for (let k = 0; k < count; k++) {
                matches.push([SIZE - 1 - k, y]);
            }
        }
    }

    // 縦方向
    for (let x = 0; x < SIZE; x++) {
        let count = 1;
        for (let y = 1; y < SIZE; y++) {
            if (board[y][x] === board[y - 1][x]) {
                count++;
            } else {
                if (count >= 3) {
                    for (let k = 0; k < count; k++) {
                        matches.push([x, y - 1 - k]);
                    }
                }
                count = 1;
            }
        }
        if (count >= 3) {
            for (let k = 0; k < count; k++) {
                matches.push([x, SIZE - 1 - k]);
            }
        }
    }

    return matches;
}

// 揃った箇所を削除して新たなボールを補充
function applyMatches(matches) {
    const set = new Set(matches.map(m => m[0] + "," + m[1]));

    set.forEach(s => {
        const [x, y] = s.split(",").map(Number);
        board[y][x] = -1; // 消された箇所は -1 に
    });

    for (let x = 0; x < SIZE; x++) {
        let col = [];

        for (let y = SIZE - 1; y >= 0; y--) {
            if (board[y][x] !== -1) {
                col.push(board[y][x]); // 消されていないボールを収集
            }
        }

        while (col.length < SIZE) {
            col.push(Math.floor(Math.random() * COLORS.length)); // 上に新しいボールを追加
        }

        for (let y = SIZE - 1; y >= 0; y--) {
            board[y][x] = col[SIZE - 1 - y];
        }
    }
}

// スワイプのロジック
canvas.addEventListener("pointerdown", e => {
    const r = canvas.getBoundingClientRect();
    startX = Math.floor((e.clientX - r.left) / CELL);
    startY = Math.floor((e.clientY - r.top) / CELL);
});

canvas.addEventListener("pointerup", e => {
    const r = canvas.getBoundingClientRect();
    const endX = Math.floor((e.clientX - r.left) / CELL);
    const endY = Math.floor((e.clientY - r.top) / CELL);

    if (startX === -1 || startY === -1) return;

    // 隣接しているセルだけスワイプ可能
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    if (dx + dy !== 1) return;

    // スワップ処理
    swap(startX, startY, endX, endY);

    if (findMatches().length === 0) {
        swap(startX, startY, endX, endY); // 揃いが無い場合は元に戻す
    } else {
        resolve(); // 揃ったら連鎖を処理
    }

    startX = -1;
    startY = -1;
});

// 指定した2つの位置をスワップ
function swap(x1, y1, x2, y2) {
    const temp = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = temp;
}

// 連鎖を再帰的に処理
function resolve() {
    const matches = findMatches();
    if (matches.length === 0) return;

    applyMatches(matches);
    setTimeout(resolve, 150); // 150msごとに連鎖処理
}

// ゲームループ
function loop() {
    draw();
    requestAnimationFrame(loop);
}

initBoard();
loop();