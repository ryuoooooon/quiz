// 初期データをロード
const data = JSON.parse(localStorage.getItem('gameData')) || { affection: 0, coins: 0 };
const log = document.getElementById('conversation-log');
const affectionElem = document.getElementById('affection');
const coinsElem = document.getElementById('coins');
data.affection = data.affection || 0;
data.coins = data.coins || 0;
updateStatus();

// 送信ボタンのハンドリング
document.getElementById('send').addEventListener('click', () => {
  const input = document.getElementById('input').value;
  if (!input) return;
  logMessage('あなた', input);
  const response = getAIResponse(input);
  logMessage('キャラ', response);

  // 好感度をランダムで変化
  const affectionChange = Math.floor(Math.random() * 3) + 1;
  data.affection += affectionChange;
  
  updateStatus();
  saveGameData(); // 状態を保存
});

// ミニゲームの実装
document.getElementById('mini-game').addEventListener('click', () => {
  const coinChange = Math.floor(Math.random() * 11); // 0～10のランダムコイン
  alert(`ミニゲーム成功！ ${coinChange}コイン獲得！`);
  data.coins += coinChange;
  
  updateStatus();
  saveGameData(); // 状態を保存
});

// ゲームデータを保存
function saveGameData() {
  localStorage.setItem('gameData', JSON.stringify(data));
}

// 会話ログ更新
function logMessage(sender, message) {
  const newMessage = document.createElement('div');
  newMessage.textContent = `${sender}: ${message}`;
  log.appendChild(newMessage);
  log.scrollTop = log.scrollHeight; // スクロールを下まで
}

// ステータス更新
function updateStatus() {
  affectionElem.textContent = data.affection;
  coinsElem.textContent = data.coins;
}

// AIキャラのレスポンス生成
function getAIResponse(input) {
  const responses = [
    'それは面白いね！',
    'うん、わかるよ！',
    'そうなんだ～！',
    'もう一回話して？',
    'へぇ～！'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}