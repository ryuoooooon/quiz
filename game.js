// キャラクター選択画面の要素
const characterSelectScreen = document.getElementById("characterSelect");
const characterOptions = document.getElementById("characterOptions");
const startGameButton = document.getElementById("startGame");

// 選択されたキャラクター情報
let selectedCharacter = null;

// ゲーム画面の要素
const gameScreen = document.getElementById("gameScreen");
const playerCharacterName = document.getElementById("playerCharacterName");
const playerCharacterImage = document.getElementById("playerCharacterImage");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5;
const COLORS = ["#f44", "#48f", "#4d6", "#fc3"];
let playerBoard = [];
let cpBoard = [];
let gameStarted = false;
let playerHP = 100;
let cpHP = 100;
let CELL;

// カウントダウン用変数
let countdown = 3;

// ボードのサイズ調整
function resize() {
    const size = Math.min(innerWidth * 0.7, innerHeight * 0.4);
    CELL = Math.floor(size / SIZE);
    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;
}

// 初期化: キャラクター選択画面
characterOptions.addEventListener("click", (event) => {
    const character = event.target.closest(".character");
    if (!character) return;

    // 他の選択を解除
    document.querySelectorAll(".character").forEach(c => c.classList.remove("selected"));

    // 選択状態にする
    character.classList.add("selected");
    selectedCharacter = character.dataset.name;

    // ゲーム開始ボタンを有効化
    startGameButton.disabled = false;
});

startGameButton.addEventListener("click", () => {
    if (!selectedCharacter) return;

    // 対戦画面に移行
    initGameScreen();
    resize();
    gameScreen.style.display = "block";
    characterSelectScreen.style.display = "none";

    // キャラクター名と画像を反映
    playerCharacterName.textContent = selectedCharacter;
    playerCharacterImage.src = `${selectedCharacter.toLowerCase()}.png`;

    // カウントダウンを開始
    countdown = 3;
    gameStarted = false;
    startCountdown();
});

// ゲーム画面初期化
function initGameScreen() {
    playerBoard = [];
    cpBoard = [];
    playerHP = 100;
    cpHP = 100;

    for (let y = 0; y < SIZE; y++) {
        let row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push(Math.floor(Math.random() * COLORS.length));
        }
        playerBoard.push(row);

        let cpRow = [];
        for (let x = 0; x < SIZE; x++) {
            cpRow.push(Math.floor(Math.random() * COLORS.length));
        }
        cpBoard.push(cpRow);
    }
}

// カウントダウンの開始
function startCountdown() {
    const countdownInterval = setInterval(() => {
        drawGame(countdown); // カウントダウンを描画
        if (countdown === 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            gameLoop(); // ゲームのループへ移行
        }
        countdown--;
    }, 1000);
}

// ゲーム画面描画
function drawGame(count = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoards();
    drawHPBars();

    if (count !== null && count >= 0) {
        // カウントダウンを中央に表示
        ctx.font = "48px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(count > 0 ? count : "START!", canvas.width / 2, canvas.height / 2);
    }
}

// ゲージの描画
function drawHPBars() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";

    // プレイヤーHP
    ctx.fillText("Player HP", 10, 20);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(10, 30, playerHP * 2, 10);

    // CPのHP
    ctx.fillStyle = "#fff";
    ctx.fillText("CP HP", 10, 60);
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, 70, cpHP * 2, 10);
}

// ボードを描画
function drawBoards() {
    // プレイヤーのボード
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            drawBall(playerBoard[y][x], x, y);
        }
    }
}

// ボールを描画
function drawBall(colorIndex, x, y) {
    ctx.fillStyle = COLORS[colorIndex];
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

// ゲームのループ処理
function gameLoop() {
    if (!gameStarted) return;

    drawGame();
    // 今後、ゲームの対戦ロジックが追加される予定 (CPU操作など)
    requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resize);