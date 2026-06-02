const canvas=document.getElementById("board");
const ctx=canvas.getContext("2d");

const SIZE=5;
const COLORS=["#f44","#48f","#4d6","#fc3"];

let board=[];
let CELL;
let startX=-1,startY=-1;

function resize(){
const size=Math.min(innerWidth*0.7,innerHeight*0.4);
CELL=Math.floor(size/SIZE);
canvas.width=CELL*SIZE;
canvas.height=CELL*SIZE;
}

window.addEventListener("resize",resize);
resize();

function init(){
board=[];
for(let y=0;y<SIZE;y++){
let row=[];
for(let x=0;x<SIZE;x++){
row.push(Math.floor(Math.random()*COLORS.length));
}
board.push(row);
}
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
for(let y=0;y<SIZE;y++){
for(let x=0;x<SIZE;x++){
ctx.fillStyle=COLORS[board[y][x]];
ctx.beginPath();
ctx.arc(x*CELL+CELL/2,y*CELL+CELL/2,CELL/2-3,0,Math.PI*2);
ctx.fill();
}
}
}

function swap(x1,y1,x2,y2){
let t=board[y1][x1];
board[y1][x1]=board[y2][x2];
board[y2][x2]=t;
}

canvas.addEventListener("pointerdown",e=>{
const r=canvas.getBoundingClientRect();
startX=Math.floor((e.clientX-r.left)/CELL);
startY=Math.floor((e.clientY-r.top)/CELL);
});

canvas.addEventListener("pointerup",e=>{
const r=canvas.getBoundingClientRect();
let x=Math.floor((e.clientX-r.left)/CELL);
let y=Math.floor((e.clientY-r.top)/CELL);

if(Math.abs(x-startX)+Math.abs(y-startY)!==1)return;

swap(startX,startY,x,y);
});

function loop(){
draw();
requestAnimationFrame(loop);
}

init();
loop();