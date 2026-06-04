document.addEventListener("DOMContentLoaded", () => {

let love = Number(localStorage.getItem("love")) || 0;
let coin = Number(localStorage.getItem("coin")) || 0;
let level = Number(localStorage.getItem("level")) || 1;
let lastBonus = localStorage.getItem("bonus") || "";

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

addAI(
"こんにちは！私はミライだよ！"
);

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
<div class="bubble">
${text}
</div>
</div>
`;

scrollBottom();

}

function addAI(text){

chat.innerHTML += `
<div class="ai">
<div class="bubble">
${text}
</div>
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

avatar.style.filter =
"brightness(1.15)";
break;

case "love":

avatar.style.filter =
"saturate(1.8)";
break;

case "sad":

avatar.style.filter =
"grayscale(0.7)";
break;

default:

avatar.style.filter =
"none";

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
msg.includes("こんにちは")
){

text =
"こんにちは！";

love += 2;

setFace("happy");

}
else if(
msg.includes("疲れ") ||
msg.includes("しんどい")
){

text =
"今日も頑張ったね！";

love += 3;

setFace("happy");

}
else if(
msg.includes("好き")
){

text =
"えへへ、嬉しいな！";

love += 5;

setFace("love");

}
else{

const list = [

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
*
list.length
)
];

setFace("normal");

}

addAI(text);

levelCheck();

updateStatus();

save();

}

function levelCheck(){

const next =
level * 30;

if(
love >= next
){

level++;

coin += 20;

addAI(
"レベルアップ！ Lv." +
level +
"！"
);

}

}

function checkEvents(){

const eventBox =
document.getElementById(
"eventBox"
);

if(love >= 100){

eventBox.textContent =
"特別イベント解放！";

}
else if(
love >= 50
){

eventBox.textContent =
"ミライはあなたを信頼している";

}
else{

eventBox.textContent =
"ミライと仲良くなろう！";

}

}

function updateStatus(){

document
.getElementById("love")
.textContent =
love;

document
.getElementById("coin")
.textContent =
coin;

document
.getElementById("level")
.textContent =
"Lv." + level;

const percent =
Math.min(
100,
love /
(level * 30)
* 100
);

document
.getElementById("loveBar")
.style.width =
percent + "%";

checkEvents();

}

window.searchCoin =
function(){

const gain =
Math.floor(
Math.random()*15
)+1;

coin += gain;

addAI(
gain +
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

if(hand===null)
return;

const ai =
Math.floor(
Math.random()*3
);

const names = [
"グー",
"チョキ",
"パー"
];

let result;

if(hand==ai){

result =
"あいこ！";

}
else if(

(hand==0&&ai==1)||
(hand==1&&ai==2)||
(hand==2&&ai==0)

){

result =
"勝ち！";

coin += 10;

love += 2;

setFace("happy");

}
else{

result =
"負けちゃった…";

setFace("sad");

}

addAI(
"私は" +
names[ai] +
"！ " +
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

if(
today === lastBonus
){

addAI(
"今日はもう受け取ったよ！"
);

return;

}

coin += 50;

lastBonus =
today;

localStorage.setItem(
"bonus",
today
);

addAI(
"ログインボーナス！50コイン獲得！"
);

updateStatus();

save();

};

window.buyGift =
function(){

if(
coin < 30
){

addAI(
"コインが足りないよ！"
);

return;

}

coin -= 30;

love += 10;

setFace("love");

addAI(
"プレゼントありがとう♪"
);

updateStatus();

save();

};

window.gacha =
function(){

if(
coin < 50
){

addAI(
"50コイン必要だよ！"
);

return;

}

coin -= 50;

const r =
Math.random();

let item;

if(r < 0.6){

item =
"リボン";

}
else if(
r < 0.9
){

item =
"制服";

}
else{

item =
"レア衣装";

}

costumes.push(item);

addAI(
item +
"を獲得したよ！"
);

updateStatus();

save();

};

window.collectIdleReward =
function(){

const now =
Date.now();

const diff =
Math.floor(
(now-lastLogin)
/60000
);

if(diff <= 0){

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

lastLogin =
now;

addAI(
reward +
"コイン獲得！"
);

updateStatus();

save();

};

});