const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5;
const COLORS = ["#f44", "#48f", "#4d6", "#fc3"];

let playerBoard = [];
let cpBoard = [];
let CELL;
let startX = -1, startY = -1;

let playerHP = 100;
let cpHP = 100;
const attackPower = 5; // 1連鎖あたりのダメージ値

function resize() {
    const size = Math.min(innerWidth * 0.7, innerHeight * 0.4);
    CELL = Math.floor(size / SIZE);
    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;
}

window.addEventListener("resize", resize);
resize();

// ボード初期化関数
function initBoard(board) {
    for (let y = 0; y < SIZE; y++) {
        let row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push(Math.floor(Math.random() * COLORS.length));
        }
        board.push(row);
    }
}

// ボード描画
function drawBoard(board, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            ctx.fillStyle = COLORS[board[y][x]];
            ctx.beginPath();
            ctx.arc(
                x * CELL + CELL / 2 + offsetX,
                y * CELL + CELL / 2 + offsetY,
                CELL / 2 - 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}

// HPバー描画
function drawHP() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";

    // プレイヤーHP
    ctx.fillText("Player HP: " + playerHP, 10, 20);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(10, 30, playerHP * 2, 10);

    // CPのHP
    ctx.fillStyle = "#fff";
    ctx.fillText("CP HP: " + cpHP, 10, 60);
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, 70, cpHP * 2, 10);
}

// 揃った球を探す
function findMatches(board) {
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
                        matches.push([x - k - 1, y]);
                    }
                }
                count = 1;
            }
        }
        if (count >= 3) {
            for (let k = 0; k < count; k++) {
                matches.push([SIZE - k - 1, y]);
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
                        matches.push([x, y - k - 1]);
                    }
                }
                count = 1;
            }
        }
        if (count >= 3) {
            for (let k = 0; k < count; k++) {
                matches.push([x, SIZE - k - 1]);
            }
        }
    }

    return matches;
}

// 揃った箇所を消去
function applyMatches(board, matches) {
    let damage = 0; // 連鎖数/攻撃ダメージを記録

    let set = new Set(matches.map(m => `${m[0]},${m[1]}`));
    set.forEach(point => {
        let [x, y] = point.split(",").map(Number);
        board[y][x] = -1; // 消去（-1）
        damage++;
    });

    for (let x = 0; x < SIZE; x++) {
        let column = [];

        // 消去されていない玉を収集
        for (let y = SIZE - 1; y >= 0; y--) {
            if (board[y][x] !== -1) {
                column.push(board[y][x]);
            }
        }

        // 新しい玉を生成
        while (column.length < SIZE) {
            column.push(Math.floor(Math.random() * COLORS.length));
        }

        // ボードに反映
        for (let y = SIZE - 1; y >= 0; y--) {
            board[y][x] = column.pop();
        }
    }

    return damage;
}

// CPの行動
function cpTurn() {
    // ランダムに1回スワップして消去を試みる
    let x1 = Math.floor(Math.random() * SIZE);
    let y1 = Math.floor(Math.random() * SIZE);
    let x2 = x1 + (Math.random() > 0.5 ? 1 : 0);
    let y2 = y1 + (x2 === x1 ? 1 : 0);

    if (x2 < SIZE && y2 < SIZE) {
        swap(cpBoard, x1, y1, x2, y2);
        let matches = findMatches(cpBoard);
        if (matches.length > 0) {
            cpHP -= attackPower * matches.length;
        }
    }
}

// スワップ
function swap(board, x1, y1, x2, y2) {
    let temp = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = temp;
}

// プレイヤーのターン
canvas.addEventListener("pointerdown", e => {
    const rect = canvas.getBoundingClientRect();
    startX = Math.floor((e.clientX - rect.left) / CELL);
    startY = Math.floor((e.clientY - rect.top) / CELL);
});

canvas.addEventListener("pointerup", e => {
    const rect = canvas.getBoundingClientRect();
    let endX = Math.floor((e.clientX - rect.left) / CELL);
    let endY = Math.floor((e.clientY - rect.top) / CELL);

    if (
        Math.abs(startX - endX) + Math.abs(startY - endY) === 1 && // 隣接判定
        startX >= 0 &&
        startY >= 0 &&
        endX >= 0 &&
        endY >= 0
    ) {
        swap(playerBoard, startX, startY, endX, endY);
        let matches = findMatches(playerBoard);
        if (matches.length > 0) {
            playerHP += attackPower;
            cpHP -= attackPower * matches.length;
        } else {
            swap(playerBoard, startX, startY, endX, endY); // 揃わなければ元に戻す
        }
    }
});

// メインゲーム
function loop() {
    drawBoard(playerBoard); // プレイヤーボード
    drawHP(); // HPバー

    if (cpHP <= 0 || playerHP <= 0) {
        alert(cpHP <= 0 ? "Player Wins!" : "CP Wins!");
        return;
    }

    setTimeout(cpTurn, 2000); // 2秒ごとにCPが行動
    requestAnimationFrame(loop);
}

initBoard(playerBoard);
initBoard(cpBoard);
loop();