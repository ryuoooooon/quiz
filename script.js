document.addEventListener("DOMContentLoaded", () => {

const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const message = document.getElementById("message");

window.searchCoin = () => {
    addAI("コイン探し成功！");
};

window.playJanken = () => {
    addAI("じゃんけん成功！");
};

window.dailyBonus = () => {
    addAI("ログインボーナス成功！");
};

window.buyGift = () => {
    addAI("プレゼント成功！");
};

sendBtn.addEventListener("click", () => {

    const text = message.value.trim();

    if(!text) return;

    addUser(text);

    message.value = "";

    setTimeout(()=>{
        addAI("ちゃんと受信したよ！");
    },300);

});

function addUser(text){

    chat.innerHTML += `
    <div class="user">
        <div class="bubble">${text}</div>
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;
}

function addAI(text){

    chat.innerHTML += `
    <div class="ai">
        <div class="bubble">${text}</div>
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;
}

addAI("起動成功！");

});