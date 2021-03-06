const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

console.log(ctx)
const ROW = 20;
const COL = 10;
const SQ = 20; 
const VACANT ="#141313"; // color of an empty square


// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// create the board
let board = [];
for(let r = 0; r <ROW; r++){ //first loop for rows
    board[r] = [];
    for(let c = 0; c < COL; c++){ // loop for columns 
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for(let r = 0; r <ROW; r++){
        for(let c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}
console.log(board)


// funtion that appends game over 
function drawGameOver(){
    ctx.font = 'italic 40px Arial';
    ctx.textAlign = 'center';
    ctx. textBaseline = 'middle';
    ctx.fillStyle = 'red';  // a color name or by using rgb/rgba/hex values
    ctx.fillText('Game Over', 320, 150);
}

// draw the score board 
function drawScoreBoard(){
    ctx.font = 'italic 25px Arial';
    ctx.textAlign = 'center';
    ctx. textBaseline = 'middle';
    ctx.fillStyle = 'red';  // a color name or by using rgb/rgba/hex values
    ctx.fillText('Score:', 250, 80);
}


// function for score incrementation
function scoreIncrement(number){
    ctx.font = 'italic 25px Arial';
    ctx.textAlign = 'center';
    ctx. textBaseline = 'middle';
    ctx.fillStyle = 'red';  
    ctx.fillText(number, 310, 80);
}

let score = 0;

function scoreClear(){
    ctx.fillStyle = 'black';
    ctx.fillRect(290,60,50,50);
}


let tetrisLogo ="https://www.userlogos.org/files/logos/MShadows/tetris1.png"
let img = new Image();
img.src = tetrisLogo;

function drawLogo(){
    ctx.drawImage(img, 100, 0);
}



function clearLogo(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
}
// STARTS GAME
function startGame(){
    clearLogo();
    drawBoard(); 
    // draws empty board
    drawScoreBoard();
    // draws score board
    document.addEventListener("keydown",CONTROL);
    // control keys activated
    drop();
    // timed pieces drop
}




// the pieces and their colors
const pink = "#ff46ff"
const green = "#19ff63"
const yellow = "#ebff00"
const blue = "#00f5ff"
const purple = "#7000ff"
const orange = "#ff9900"
const red = "#ff4141"


const PIECES = [
    [Z, pink],
    [S, green],
    [T, yellow],
    [O, blue],
    [L, purple],
    [I, red],
    [J, orange]
];


// generate random pieces
function randomPiece(){
    let r  = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece(PIECES[r][0],PIECES[r][1]);
}


let p = randomPiece();


// The Object Piece
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}


// fill function
Piece.prototype.fill = function(color){
    for(let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}


// draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color);
}


// undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}


// move Down the piece
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}


// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}


// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}


// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

Piece.prototype.lock = function(){
    for( let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                // alert('game')
                drawGameOver()
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(let r = 0; r < ROW; r++){
        let isRowFull = true;
        for( let c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( let y = r; y > 1; y--){
                for(let c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( let c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            scoreClear();
            score += 10;
            scoreIncrement(score);
        }
    }
    // update the board
    drawBoard();
    
    // update the score
}

// ////////////////////////////////////////////////////////
// collision detection fucntion
Piece.prototype.collision = function(x,y,piece){
    for(let r = 0; r < piece.length; r++){
        for(let c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece
// key codes for arrow keys
const left = 37
const right = 39
const up = 38
const down = 40

function CONTROL(event){
    if(event.keyCode == left){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == up){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == right){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == down){
        p.moveDown();
    }
}

// drop the piece every 1sec
let dropStart = Date.now();

let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drawLogo();
window.addEventListener('keydown', (e)=>{
    if(e.keyCode == 32){
     startGame();   
    }
})

