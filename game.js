const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5;
const COLORS = ["#f44", "#48f", "#4d6", "#fc3"];

let board = [];
let CELL; // 1セルの幅
let startX = -1, startY = -1;

function resize() {
    const size = Math.min(innerWidth * 0.7, innerHeight * 0.4);
    CELL = Math.floor(size / SIZE);
    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;
}

window.addEventListener("resize", resize);
resize();

function initBoard() {
    board = [];
    for (let y = 0; y < SIZE; y++) {
        let row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push(Math.floor(Math.random() * COLORS.length));
        }
        board.push(row);
    }

    // 初期化時に3つ揃いを削除
    while (findMatches().length > 0) {
        applyMatches(findMatches());
    }
}

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

// 揃ったマッチを探す
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

// 揃った球を削除
function applyMatches(matches) {
    const set = new Set(matches.map(m => m[0] + "," + m[1]));

    // 揃ったマスを空にする
    set.forEach(s => {
        const [x, y] = s.split(",").map(Number);
        board[y][x] = -1;
    });

    // 上に球を詰める
    for (let x = 0; x < SIZE; x++) {
        let col = [];

        // 消えてない球を下から収集
        for (let y = SIZE - 1; y >= 0; y--) {
            if (board[y][x] !== -1) {
                col.push(board[y][x]);
            }
        }

        // 上部に新しい球を生成
        while (col.length < SIZE) {
            col.push(Math.floor(Math.random() * COLORS.length));
        }

        // ボードに戻す
        for (let y = SIZE - 1; y >= 0; y--) {
            board[y][x] = col[SIZE - 1 - y];
        }
    }
}

// 連鎖を処理
function resolve() {
    const matches = findMatches();
    if (matches.length === 0) return; // もう連鎖なし

    applyMatches(matches);
    setTimeout(resolve, 150); // 再帰的に連鎖を処理
}

// ボールの位置をスワップ
function swap(x1, y1, x2, y2) {
    const temp = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = temp;
}

// スワイプ操作の処理
canvas.addEventListener("pointerdown", e => {
    const r = canvas.getBoundingClientRect();
    startX = Math.floor((e.clientX - r.left) / CELL);
    startY = Math.floor((e.clientY - r.top) / CELL);
});

canvas.addEventListener("pointerup", e => {
    const r = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left) / CELL);
    const y = Math.floor((e.clientY - r.top) / CELL);

    // 隣接するセルか判定
    if (Math.abs(x - startX) + Math.abs(y - startY) !== 1) return;

    // 入れ替え処理
    swap(startX, startY, x, y);

    // 揃いが無ければ元に戻す
    if (findMatches().length === 0) {
        swap(startX, startY, x, y);
        return;
    }

    resolve(); // 連鎖処理開始
});

// ゲームループ
function loop() {
    draw();
    requestAnimationFrame(loop);
}

initBoard();
loop();