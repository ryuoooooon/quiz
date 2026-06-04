document.addEventListener("DOMContentLoaded", () => {

let love = Number(localStorage.getItem("love")) || 0;
let coin = Number(localStorage.getItem("coin")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let lastBonus = localStorage.getItem("bonus") || "";

let userName =
localStorage.getItem("userName") || "";

let costumes =
JSON.parse(
localStorage.getItem("costumes")
) || [];

let lastLogin =
Number(
localStorage.getItem("lastLogin")
) || Date.now();

const chat =
document.getElementById("chat");

const sendBtn =
document.getElementById("sendBtn");

const message =
document.getElementById("message");

const avatar =
document.getElementById("avatar");

updateStatus();

if(userName){

addAI(
"おかえりなさい、" +
userName +
"さん！"
);

}else{

addAI(
"こんにちは！私は未来のトップアイドル花海咲季！あなたの名前を教えてちょうだい！"
);

}

sendBtn.addEventListener(
"click",
sendMessage
);

message.addEventListener(
"keydown",
(e)=>{
if(e.key==="Enter"){
sendMessage();
}
}
);

function save(){

localStorage.setItem("love",love);
localStorage.setItem("coin",coin);
localStorage.setItem("level",level);
localStorage.setItem("userName",userName);

localStorage.setItem(
"costumes",
JSON.stringify(costumes)
);

localStorage.setItem(
"lastLogin",
lastLogin
);

}

function addUser(text){

chat.innerHTML += `
<div class="user">
<div class="bubble">${text}</div>
</div>
`;

scrollBottom();

}

function addAI(text){

chat.innerHTML += `
<div class="ai">
<div class="bubble">${text}</div>
</div>
`;

scrollBottom();

}

function scrollBottom(){

chat.scrollTop =
chat.scrollHeight;

}

function setFace(type){

if(!avatar) return;

switch(type){

case "happy":
avatar.style.filter="brightness(1.15)";
break;

case "love":
avatar.style.filter="saturate(1.8)";
break;

case "sad":
avatar.style.filter="grayscale(0.7)";
break;

default:
avatar.style.filter="none";

}

}

function sendMessage(){

const msg =
message.value.trim();

if(!msg) return;

addUser(msg);

message.value = "";

setTimeout(()=>{
reply(msg);
},300);

}

function reply(msg){

let text;

if(
msg.includes("名前は")
){

userName =
msg.replace(
"名前は",
""
).trim();

text =
userName +
"ね！覚えたわ！";

love += 5;

}
else if(
msg.includes("名前は")
){

userName =
msg.replace(
"名前は",
""
).trim();

text =
userName +
"ね！覚えたわ！";

love += 5;

}
else if(
msg.includes("こんにちは")
){

text =
(userName ?
userName+"こんにちは！" :
"こんにちは！");

love += 2;

}
else if(
msg.includes("疲れ") ||
msg.includes("しんどい")
){

text =
"あなたのためにSSDを作ってあるわ！";

love += 3;

}
else if(
msg.includes("好き")
){

text =
(userName ?
userName+"、" :
"") +
"えへへ〜、ありがと〜♪";

love += 5;

}
else{

const list=[

"もっと聞かせてちょうだい！",

"！",

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
"レベルアップ！ Lv."+
level+
"！"
);

}

}

function checkEvents(){

const eventBox =
document.getElementById("eventBox");

if(love >= 100){

eventBox.textContent =
"特別イベント解放！";

}
else if(
love >= 50
){

eventBox.textContent =
"咲季はあなたを信頼している";

}
else{

eventBox.textContent =
"咲季おねえちゃんと仲良くなろう！";

}

}

function updateStatus(){

document.getElementById("love")
.textContent = love;

document.getElementById("coin")
.textContent = coin;

document.getElementById("level")
.textContent =
"Lv."+level;

const percent =
Math.min(
100,
love/(level*30)*100
);

document.getElementById("loveBar")
.style.width =
percent+"%";

checkEvents();

}

window.searchCoin = function(){

const gain =
Math.floor(
Math.random()*15
)+1;

coin += gain;

addAI(
gain+
"マニー見つけたよ！"
);

updateStatus();
save();

};

window.playJanken = function(){

const hand =
prompt(
"0=グー 1=チョキ 2=パー"
);

if(hand===null) return;

const ai =
Math.floor(
Math.random()*3
);

const names =
["グー","チョキ","パー"];

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

coin+=10;
love+=2;

}
else{

result="はい、私の勝ち！";

}

addAI(
"私は"+
names[ai]+
"！ "+result
);

updateStatus();
save();

};

window.dailyBonus = function(){

const today =
new Date().toDateString();

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

window.buyGift = function(){

if(coin<30){

addAI(
"マニーが足りないよ！"
);

return;

}

coin-=30;
love+=10;

addAI(
"プレゼントありがとう！"
);

updateStatus();
save();

};

window.gacha = function(){

if(coin<50){

addAI(
"50マニー必要だよ！"
);

return;

}

coin-=50;

const r =
Math.random();

let item;

if(r<0.6){

item="リボン";

}
else if(r<0.9){

item="制服";

}
else{

item="レア衣装";

}

costumes.push(item);

addAI(
item+
"を獲得したよ！"
);

updateStatus();
save();

};

window.collectIdleReward = function(){

const now =
Date.now();

const diff =
Math.floor(
(now-lastLogin)
/60000
);

if(diff<=0){

addAI(
"まだ報酬はないよ！"
);

return;

}

const reward =
Math.min(
200,
diff
);

coin += reward;

lastLogin = now;

addAI(
reward+
"マニー獲得！"
);

updateStatus();
save();

};

});