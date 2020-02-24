let scene,camera,renderer,mesh,light,grid,model,mixer,actions,clock,arcade;
let idle,walking;
let music = false
let lose = false;
clock = new THREE.Clock()
let keyboard = new THREEx.KeyboardState();
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


let init = ()=>{
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x1d0c29 );
	scene.fog = new THREE.Fog( 0x3f0e40, 20, 100 );

	//camera 

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
	camera.position.set( 0, 10, 45 );
	camera.rotation.set( -6.5, 0, 0 );
	// lights
	light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	light.position.set( 0, 20, 0 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 20, 10 );
	scene.add( light );

	light = new THREE.AmbientLight( 0xf27dd9 );
	light.position.set( 0, 20, 10 );
	scene.add( light );

	// ground

	mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x3c113d, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );

	grid = new THREE.GridHelper( 200, 40, 0x39ff14, 0x39ff14 );
	grid.material.opacity = 0.2;
	grid.material.transparent = false;
	scene.add( grid );

	renderer = new THREE.WebGLRenderer({antialias: true} );
	renderer.setClearColor( 0x3f0e40, 0.5 )
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera.position.z = 20;
}

init();
//Tic tac toe cube
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
ctx.canvas.width = 512;
ctx.canvas.height = 512;
const ROW = 20;
const COL = 10;
const SQ = 20; 
const VACANT ="#141313"; // color of an empty square
const texture = new THREE.CanvasTexture(ctx.canvas);

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

// funtion that appends game over 
function drawGameOver(){
    lose = true;
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


let tetrisLogo ="./blender-files/tetris1.png"
let img = new Image();
img.src = tetrisLogo;

function drawLogo(){
    ctx.drawImage(img, 0, 0);
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

function drawArcadeScreen (){
		//canvas for tetris game
		 const boxWidth = 8;
		 const boxHeight = 10;
		 const boxDepth = 0.01;

		 const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
		 const material = new THREE.MeshBasicMaterial({
		    map: texture,
		  });
		  const screen = new THREE.Mesh(geometry, material);
		  scene.add(screen);
		  screen.position.z = (arcade.position.z -5)
		  screen.position.x = (arcade.position.x -0.3)
		  screen.position.y = (arcade.position.y + 9.8)
}






// Loaders for
const objLoader = new THREE.OBJLoader();
objLoader.setPath('../blender-files/')
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('../blender-files/')
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.setPath('../blender-files/')

//Arcade Machine
gltfLoader.load('arcade.glb', function (glb){
arcade = glb.scene
scene.add(arcade)
arcade.scale.set(3.5,3.5,3.5)
		arcade.position.z = -5
		arcade.position.x = -1
})

//model added

gltfLoader.load('RobotExpressive.glb', function (glb){
	model = glb.scene
	model.animations = glb.animations
	scene.add(model)
	mixer = new THREE.AnimationMixer( model );
	idle = mixer.clipAction(model.animations[2])
	walking = mixer.clipAction(model.animations[10])
    wave = mixer.clipAction(model.animations[12])
    punch = mixer.clipAction(model.animations[5])
    death = mixer.clipAction(model.animations[1])
    console.log(model.animations)
	walking.clampWhenFinished = true
	idle.play()
})
let updateMovement = () =>{
    let walk = false;
	let moveDistance = 50 * clock.getDelta();
	if ( keyboard.pressed("W")) {
        walk = true
		model.rotation.y = (Math.PI) 
		model.translateZ( moveDistance );
		walking.play()
	}	
	if ( keyboard.pressed("S")) {
        walk = true
		model.rotation.y = Math.PI + Math.PI
		model.translateZ( moveDistance );
		walking.play()
	}

	if ( keyboard.pressed("A")) {
        walk = true
		model.rotation.y = -Math.PI / 2;
		model.translateZ( moveDistance );
		walking.play()
	}
		
	if ( keyboard.pressed("D")){
        walk = true
		model.rotation.y = Math.PI / 2;
		model.translateZ(  moveDistance );
		walking.play()
	}
    if (keyboard.pressed("X")){
        walk = false
    }
    if(!walk){
        walking.stop();
    }
    if(lose){
        idle.stop()
        death.setLoop(THREE.LoopOnce)
        death.clampWhenFinished = true
        death.play()
    }	
}
function audioPlayer(){
    if(!music){
        music = true
	    // create an AudioListener and add it to the camera
		let listener = new THREE.AudioListener();
		arcade.add( listener );

		// create a global audio source
		let sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		let audioLoader = new THREE.AudioLoader();
		audioLoader.load( '../sounds/vapor.ogg', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 1 );
			sound.play();
	})
    }
}
function getDistance(mesh1, mesh2) { 
  let dx = mesh1.position.x - mesh2.position.x; 
  let dy = mesh1.position.y - mesh2.position.y; 
  let dz = mesh1.position.z - mesh2.position.z; 
  return Math.sqrt(dx*dx+dy*dy+dz*dz);
}
function interact(mesh1,mesh2){
   if( getDistance(mesh1,mesh2) <= 5){
   	  if ( keyboard.pressed("Z")){
   	  	walking.stop()
   	  	drawArcadeScreen();
   	  	audioPlayer();
   	  } 
    if( getDistance(mesh1,mesh2) <= 10){

    }
   }
}

let render = () => {
	let mixerUpdateDelta = clock.getDelta()
	requestAnimationFrame( render );
	mixer.update(mixerUpdateDelta)
	renderer.render( scene, camera );
	interact(model,arcade);
	texture.needsUpdate = true;
	updateMovement()
}
render();