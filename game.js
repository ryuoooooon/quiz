const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5;

function resizeBoard(){

    const boardSize = Math.min(
        window.innerWidth * 0.72,
        window.innerHeight * 0.38
    );

    const CELL = Math.floor(boardSize / SIZE);

    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;

    return CELL;
}

let CELL = resizeBoard();

const COLORS = [
“#ff4444”,
“#4488ff”,
“#44dd66”,
“#ffcc33”
];

let board = [];

let playerHP = 100;
let enemyHP = 100;

let playerGauge = 0;
let enemyGauge = 0;

let startX = -1;
let startY = -1;

function createBoard() {

board = [];
for (let y = 0; y < SIZE; y++) {
    const row = [];
    for (let x = 0; x < SIZE; x++) {
        row.push(
            Math.floor(Math.random() * COLORS.length)
        );
    }
    board.push(row);
}

}

function drawBoard() {

ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);
for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
        const colorIndex =
            board[y][x];
        if (colorIndex < 0) {
            continue;
        }
        ctx.beginPath();
        ctx.fillStyle =
            COLORS[colorIndex];
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

function findMatches() {

const matches = [];
for (let y = 0; y < SIZE; y++) {
    let count = 1;
    for (let x = 1; x < SIZE; x++) {
        if (
            board[y][x] ===
            board[y][x - 1]
        ) {
            count++;
        } else {
            if (count >= 3) {
                for (
                    let k = 0;
                    k < count;
                    k++
                ) {
                    matches.push([
                        x - 1 - k,
                        y
                    ]);
                }
            }
            count = 1;
        }
    }
    if (count >= 3) {
        for (
            let k = 0;
            k < count;
            k++
        ) {
            matches.push([
                SIZE - 1 - k,
                y
            ]);
        }
    }
}
for (let x = 0; x < SIZE; x++) {
    let count = 1;
    for (let y = 1; y < SIZE; y++) {
        if (
            board[y][x] ===
            board[y - 1][x]
        ) {
            count++;
        } else {
            if (count >= 3) {
                for (
                    let k = 0;
                    k < count;
                    k++
                ) {
                    matches.push([
                        x,
                        y - 1 - k
                    ]);
                }
            }
            count = 1;
        }
    }
    if (count >= 3) {
        for (
            let k = 0;
            k < count;
            k++
        ) {
            matches.push([
                x,
                SIZE - 1 - k
            ]);
        }
    }
}
return matches;

}

function removeMatches(matches) {

const unique =
    new Set();
matches.forEach(m => {
    unique.add(
        `${m[0]}-${m[1]}`
    );
});
unique.forEach(key => {
    const parts =
        key.split("-");
    const x =
        Number(parts[0]);
    const y =
        Number(parts[1]);
    board[y][x] = -1;
});
const removed =
    unique.size;
playerGauge =
    Math.min(
        100,
        playerGauge + removed * 2
    );
enemyHP =
    Math.max(
        0,
        enemyHP -
        Math.floor(
            removed / 2
        )
    );

}

function dropPieces() {

for (
    let x = 0;
    x < SIZE;
    x++
) {
    const column = [];
    for (
        let y = SIZE - 1;
        y >= 0;
        y--
    ) {
        if (
            board[y][x] !== -1
        ) {
            column.push(
                board[y][x]
            );
        }
    }
    while (
        column.length < SIZE
    ) {
        column.push(
            Math.floor(
                Math.random() *
                COLORS.length
            )
        );
    }
    for (
        let y = SIZE - 1;
        y >= 0;
        y--
    ) {
        board[y][x] =
            column[
            SIZE - 1 - y
            ];
    }
}

}

function resolveBoard() {

const matches =
    findMatches();
if (
    matches.length === 0
) {
    return;
}
removeMatches(matches);
dropPieces();
setTimeout(
    resolveBoard,
    150
);

}

function swapPieces(
x1,
y1,
x2,
y2
) {

const temp =
    board[y1][x1];
board[y1][x1] =
    board[y2][x2];
board[y2][x2] =
    temp;

}

canvas.addEventListener(
“pointerdown”,
e => {

    const rect =
        canvas.getBoundingClientRect();
    startX =
        Math.floor(
            (e.clientX -
             rect.left) /
            CELL
        );
    startY =
        Math.floor(
            (e.clientY -
             rect.top) /
            CELL
        );
}

);

canvas.addEventListener(
“pointerup”,
e => {

    const rect =
        canvas.getBoundingClientRect();
    const endX =
        Math.floor(
            (e.clientX -
             rect.left) /
            CELL
        );
    const endY =
        Math.floor(
            (e.clientY -
             rect.top) /
            CELL
        );
    const distance =
        Math.abs(
            endX - startX
        ) +
        Math.abs(
            endY - startY
        );
    if (
        distance !== 1
    ) {
        return;
    }
    swapPieces(
        startX,
        startY,
        endX,
        endY
    );
    const matches =
        findMatches();
    if (
        matches.length === 0
    ) {
        swapPieces(
            startX,
            startY,
            endX,
            endY
        );
        return;
    }
    resolveBoard();
}

);

function updateUI() {

document
    .getElementById(
        "playerHp"
    )
    .style.width =
    `${playerHP}%`;
document
    .getElementById(
        "enemyHp"
    )
    .style.width =
    `${enemyHP}%`;
document
    .getElementById(
        "playerAttack"
    )
    .style.width =
    `${playerGauge}%`;
document
    .getElementById(
        "enemyAttack"
    )
    .style.width =
    `${enemyGauge}%`;

}

function gameLoop() {

drawBoard();
updateUI();
requestAnimationFrame(
    gameLoop
);

}

createBoard();
resolveBoard();
gameLoop();