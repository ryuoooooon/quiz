const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 5;
const COLORS = ["#f44", "#48f", "#4d6", "#fc3"];

let board = [];
let startX = -1, startY = -1;

function resize(){
    const boardSize = Math.min(
        window.innerWidth * 0.7,
        window.innerHeight * 0.4
    );
    const CELL = Math.floor(boardSize / SIZE);
    canvas.width = CELL * SIZE;
    canvas.height = CELL * SIZE;
    return CELL;
}

let CELL = resize();

window.addEventListener("resize", () => {
    CELL = resize();
});

/* -------------------------
   初期盤面（3マッチ禁止）
------------------------- */
function isValid(x, y, v){

    // 横3つチェック
    if(x >= 2){
        if(board[y][x-1] === v && board[y][x-2] === v){
            return false;
        }
    }

    // 縦3つチェック
    if(y >= 2){
        if(board[y-1][x] === v && board[y-2][x] === v){
            return false;
        }
    }

    return true;
}

function initBoard(){
    board = [];

    for(let y=0;y<SIZE;y++){
        let row = [];
        for(let x=0;x<SIZE;x++){

            let v;
            do{
                v = Math.floor(Math.random() * COLORS.length);
            }while(!isValid(x,y,v));

            row.push(v);
        }
        board.push(row);
    }
}

/* -------------------------
   描画
------------------------- */
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let y=0;y<SIZE;y++){
        for(let x=0;x<SIZE;x++){

            ctx.beginPath();
            ctx.fillStyle = COLORS[board[y][x]];
            ctx.arc(
                x*CELL + CELL/2,
                y*CELL + CELL/2,
                CELL/2 - 3,
                0,
                Math.PI*2
            );
            ctx.fill();
        }
    }
}

/* -------------------------
   マッチ検出
------------------------- */
function findMatches(){
    let matches = [];

    // 横
    for(let y=0;y<SIZE;y++){
        let count=1;
        for(let x=1;x<SIZE;x++){
            if(board[y][x] === board[y][x-1]){
                count++;
            }else{
                if(count>=3){
                    for(let k=0;k<count;k++){
                        matches.push([x-1-k,y]);
                    }
                }
                count=1;
            }
        }
        if(count>=3){
            for(let k=0;k<count;k++){
                matches.push([SIZE-1-k,y]);
            }
        }
    }

    // 縦
    for(let x=0;x<SIZE;x++){
        let count=1;
        for(let y=1;y<SIZE;y++){
            if(board[y][x] === board[y-1][x]){
                count++;
            }else{
                if(count>=3){
                    for(let k=0;k<count;k++){
                        matches.push([x,y-1-k]);
                    }
                }
                count=1;
            }
        }
        if(count>=3){
            for(let k=0;k<count;k++){
                matches.push([x,SIZE-1-k]);
            }
        }
    }

    return matches;
}

/* -------------------------
   消去＋落下
------------------------- */
function applyMatches(matches){

    const set = new Set();
    matches.forEach(m => set.add(m[0] + "," + m[1]));

    set.forEach(s => {
        const [x,y] = s.split(",").map(Number);
        board[y][x] = -1;
    });

    // 落下
    for(let x=0;x<SIZE;x++){
        let col = [];

        for(let y=SIZE-1;y>=0;y--){
            if(board[y][x] !== -1){
                col.push(board[y][x]);
            }
        }

        while(col.length < SIZE){
            col.push(Math.floor(Math.random()*COLORS.length));
        }

        for(let y=SIZE-1;y>=0;y--){
            board[y][x] = col[SIZE-1-y];
        }
    }
}

/* -------------------------
   連鎖処理
------------------------- */
function resolve(){
    const matches = findMatches();

    if(matches.length === 0) return;

    applyMatches(matches);

    setTimeout(resolve, 120);
}

/* -------------------------
   スワップ
------------------------- */
function swap(x1,y1,x2,y2){
    const t = board[y1][x1];
    board[y1][x1] = board[y2][x2];
    board[y2][x2] = t;
}

/* -------------------------
   操作
------------------------- */
canvas.addEventListener("pointerdown", e=>{
    const r = canvas.getBoundingClientRect();
    startX = Math.floor((e.clientX - r.left)/CELL);
    startY = Math.floor((e.clientY - r.top)/CELL);
});

canvas.addEventListener("pointerup", e=>{
    const r = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left)/CELL);
    const y = Math.floor((e.clientY - r.top)/CELL);

    if(Math.abs(x-startX)+Math.abs(y-startY)!==1) return;

    swap(startX,startY,x,y);

    if(findMatches().length === 0){
        swap(startX,startY,x,y);
        return;
    }

    resolve();
});

/* -------------------------
   ループ
------------------------- */
function loop(){
    draw();
    requestAnimationFrame(loop);
}

/* -------------------------
   起動
------------------------- */
initBoard();
loop();