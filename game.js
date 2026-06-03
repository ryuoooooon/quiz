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

// キャラクターをクリックして選ぶ処理
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

// ゲーム開始ボタンのクリック処理
startGameButton.addEventListener("click", () => {
    if (!selectedCharacter) return;

    // プレイヤーのキャラクター情報を反映
    playerCharacterName.textContent = selectedCharacter;
    playerCharacterImage.src = `${selectedCharacter.toLowerCase()}.png`;

    // キャラクター選択画面を隠し、ゲーム画面を表示
    characterSelectScreen.style.display = "none";
    gameScreen.style.display = "block";
});

// 元のゲームロジック（ゲーム画面）に続く