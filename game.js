document.addEventListener("DOMContentLoaded", () => {

let love =
Number(localStorage.getItem("love")) || 0;

let coin =
Number(localStorage.getItem("coin")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let lastBonus =
localStorage.getItem("bonus") || "";

const chat =
document.getElementById("chat");

updateStatus();

if(chat.children.length === 0){
addAI("こんにちは！私はミライだよ！");
}

document
.getElementById("sendBtn")
.addEventListener(
"click",
sendMessage
);

document
.getElementById("message")
.addEventListener(
"keydown",
e=>{
if(e.key==="Enter"){
sendMessage();
}
}
);

function save(){

localStorage.setItem(
"love",
love
);

localStorage.setItem(
"coin",
coin
);

localStorage.setItem(
"level",
level
);

}

function addUser(text){

const div =
document.createElement("div");

div.className =
"user";

div.innerHTML =
`<div class="bubble">${text}</div>`;

chat.appendChild(div);

scrollBottom();

}

function addAI(text){

const div =
document.createElement("div");

div.className =
"ai";

div.innerHTML =
`<div class="bubble">${text}</div>`;

chat.appendChild(div);

scrollBottom();

}

function scrollBottom(){

chat.scrollTop =
chat.scrollHeight;

}

function sendMessage(){

const input =
document.getElementById(
"message"
);

const msg =
input.value.trim();

if(!msg) return;

addUser(msg);

input.value="";

setTimeout(()=>{
reply(msg);
},400);

}

function reply(msg){

let text;

if(msg.includes("こんにちは")){

text="こんにちは！";
love+=2;

}
else if(
msg.includes("疲れ") ||
msg.includes("しんどい")
){

text=
"今日も頑張ったね！";

love+=3;

}
else if(
msg.includes("好き")
){

text=
"えへへ、嬉しいな！";

love+=5;

}
else{

const list=[

"もっと聞かせて！",

"そうなんだ！",

"面白いね！",

"私は応援してるよ！",

"また話してね！"

];

text =
list[
Math.floor(
Math.random()
* list.length
)
];

}

addAI(text);

levelCheck();

updateStatus();

save();

}

function levelCheck(){

const next =
level * 30;

if(love >= next){

level++;

coin += 20;

addAI(
"レベルアップ！Lv."+
level+
"になったよ！"
);

}

}

function updateStatus(){

document
.getElementById("love")
.textContent = love;

document
.getElementById("coin")
.textContent = coin;

document
.getElementById("level")
.textContent =
"Lv."+level;

const max =
level * 30;

const percent =
Math.min(
100,
love/max*100
);

document
.getElementById("loveBar")
.style.width =
percent+"%";

}

window.searchCoin =
function(){

const gain =
Math.floor(
Math.random()*15
)+1;

coin += gain;

addAI(
gain+
"コイン見つけたよ！"
);

updateStatus();
save();

};

window.playJanken =
function(){

const hand =
prompt(
"0=グー 1=チョキ 2=パー"
);

if(hand===null) return;

const ai =
Math.floor(
Math.random()*3
);

const names=[
"グー",
"チョキ",
"パー"
];

let result;

if(hand==ai){

result="あいこ！";

}
else if(

(hand==0&&ai==1)||
(hand==1&&ai==2)||
(hand==2&&ai==0)

){

result="勝ち！";

coin += 10;
love += 2;

}
else{

result=
"負けちゃった...";

}

addAI(
"私は"+
names[ai]+
"！ "+
result
);

updateStatus();
save();

};

window.dailyBonus =
function(){

const today =
new Date()
.toDateString();

if(today===lastBonus){

addAI(
"今日はもう受け取ったよ！"
);

return;
}

coin += 50;

lastBonus = today;

localStorage.setItem(
"bonus",
today
);

addAI(
"ログインボーナス50コイン！"
);

updateStatus();
save();

};

window.buyGift =
function(){

if(coin < 30){

addAI(
"コインが足りないよ！"
);

return;
}

coin -= 30;

love += 10;

addAI(
"プレゼントありがとう！"
);

updateStatus();
save();

};

});