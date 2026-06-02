const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 6;

const uiWidth = 110;

const boardSize = Math.min(
    window.innerWidth - uiWidth - 20,
    window.innerHeight * 0.40
);

const CELL = Math.floor(boardSize / SIZE);

canvas.width = CELL * SIZE;
canvas.height = CELL * SIZE;

const COLORS = [
    "#ff4444",
    "#4488ff",
    "#44dd66",
    "#ffcc33"
];

let board = [];

let playerHP = 100;
let enemyHP = 100;

let playerGauge = 0;
let enemyGauge = 0;

function createBoard(){

    board = [];

    for(let y=0;y<SIZE;y++){

        let row=[];

        for(let x=0;x<SIZE;x++){

            row.push(
                Math.floor(Math.random()*4)
            );

        }

        board.push(row);

    }

}

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(let y=0;y<SIZE;y++){

        for(let x=0;x<SIZE;x++){

            ctx.beginPath();

            ctx.fillStyle=
                COLORS[
                    board[y][x]
                ];

            ctx.arc(
                x*CELL+CELL/2,
                y*CELL+CELL/2,
                CELL/2-3,
                0,
                Math.PI*2
            );

            ctx.fill();

        }

    }

}

function findMatches(){

    let matches=[];

    for(let y=0;y<SIZE;y++){

        let count=1;

        for(let x=1;x<SIZE;x++){

            if(
                board[y][x]===
                board[y][x-1]
            ){

                count++;

            }else{

                if(count>=3){

                    for(let k=0;k<count;k++){

                        matches.push([
                            x-1-k,
                            y
                        ]);

                    }

                }

                count=1;

            }

        }

        if(count>=3){

            for(let k=0;k<count;k++){

                matches.push([
                    SIZE-1-k,
                    y
                ]);

            }

        }

    }

    for(let x=0;x<SIZE;x++){

        let count=1;

        for(let y=1;y<SIZE;y++){

            if(
                board[y][x]===
                board[y-1][x]
            ){

                count++;

            }else{

                if(count>=3){

                    for(let k=0;k<count;k++){

                        matches.push([
                            x,
                            y-1-k
                        ]);

                    }

                }

                count=1;

            }

        }

        if(count>=3){

            for(let k=0;k<count;k++){

                matches.push([
                    x,
                    SIZE-1-k
                ]);

            }

        }

    }

    return matches;

}

function removeMatches(matches){

    matches.forEach(m=>{

        board[m[1]][m[0]]=-1;

    });

    playerGauge=
        Math.min(
            100,
            playerGauge+matches.length
        );

    enemyHP=
        Math.max(
            0,
            enemyHP-Math.floor(matches.length/3)
        );

}

function dropPieces(){

    for(let x=0;x<SIZE;x++){

        let col=[];

        for(let y=SIZE-1;y>=0;y--){

            if(
                board[y][x]!==-1
            ){

                col.push(
                    board[y][x]
                );

            }

        }

        while(
            col.length<SIZE
        ){

            col.push(
                Math.floor(
                    Math.random()*4
                )
            );

        }

        for(let y=SIZE-1;y>=0;y--){

            board[y][x]=
                col[
                    SIZE-1-y
                ];

        }

    }

}

function resolveBoard(){

    let matches=
        findMatches();

    if(matches.length===0){

        return;

    }

    removeMatches(matches);

    dropPieces();

    setTimeout(
        resolveBoard,
        200
    );

}

let startX;
let startY;

canvas.addEventListener(
    "pointerdown",
    e=>{

        const rect=
            canvas.getBoundingClientRect();

        startX=
            Math.floor(
                (e.clientX-rect.left)
                /CELL
            );

        startY=
            Math.floor(
                (e.clientY-rect.top)
                /CELL
            );

    }
);

canvas.addEventListener(
    "pointerup",
    e=>{

        const rect=
            canvas.getBoundingClientRect();

        let endX=
            Math.floor(
                (e.clientX-rect.left)
                /CELL
            );

        let endY=
            Math.floor(
                (e.clientY-rect.top)
                /CELL
            );

        if(
            Math.abs(endX-startX)+
            Math.abs(endY-startY)!==1
        ){
            return;
        }

        let temp=
            board[startY][startX];

        board[startY][startX]=
            board[endY][endX];

        board[endY][endX]=
            temp;

        let matches=
            findMatches();

        if(matches.length===0){

            temp=
                board[startY][startX];

            board[startY][startX]=
                board[endY][endX];

            board[endY][endX]=
                temp;

            return;

        }

        resolveBoard();

    }
);

function updateBars(){

    document
    .getElementById("playerHp")
    .style.transform=
        `scaleY(${playerHP/100})`;

    document
    .getElementById("enemyHp")
    .style.transform=
        `scaleY(${enemyHP/100})`;

    document
    .getElementById("playerAttack")
    .style.height=
        `${playerGauge}%`;

    document
    .getElementById("enemyAttack")
    .style.height=
        `${enemyGauge}%`;

}

function loop(){

    draw();

    updateBars();

    requestAnimationFrame(
        loop
    );

}

createBoard();
resolveBoard();
loop();