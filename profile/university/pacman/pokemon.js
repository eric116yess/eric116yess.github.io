//general setting
var fps=60;
var canvasSize = 500;
var mapSize = 25;
var cellSize = canvasSize/mapSize;
var canvas = document.getElementById("e");
var canvasTop = document.getElementById("top");
var ctx = canvas.getContext("2d");
var ctxTop = canvasTop.getContext("2d");
//audio setting
var pillAudio = new Audio('sound/pill.wav');
//handler
canvas.addEventListener( "keydown", doKeyDown, true);
//disable arrow key scrolling window
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)e.preventDefault();
}, false);

//variables
var gameStart;
var gameOver;
var gameOverMsg;
var gameTimer;
var map;
var pill;
var pillTotal;
var pillAte;
var pacManLive;
var pacManX;
var pacManY;
var pacManMoveXOffset;
var pacManMoveYOffset;
var pacManMouthOffset;
var pacManViewAngle;
var pacManViewAngleOffset;
var pacManPreChangeViewAngle;
var pacManSpeedDelay;
var enemySpeedDelay;
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var pacManTimer;
var enemy1Timer;
var enemy2Timer;
var enemy3Timer;
var enemy4Timer;
var powerMode;
var powerModeTime;
var powerModeTimeOffset;
var powerPillArr;
var powerPillArrOffset;
var difficulty;

//initial variables
function initialVariable() {
	difficulty = document.getElementById("difficulty").value;
	cellSize = canvasSize/mapSize;
	gameStart=false;
	gameOver=false;
	gameOverMsg="";
	pillTotal=0;
	pillAte=0;
	pacManLive=3;
	pacManX=1;
	pacManY=mapSize-2;
	pacManMoveXOffset=0;
	pacManMoveYOffset=0;
	pacManMouthOffset=0;
	pacManViewAngle=90;
	pacManViewAngleOffset=0;
	pacManPreChangeViewAngle=pacManViewAngle;
	enemy1.moveXOffset=0;
	enemy1.moveYOffset=0;
	enemy2.moveXOffset=0;
	enemy2.moveYOffset=0;
	enemy3.moveXOffset=0;
	enemy3.moveYOffset=0;
	enemy4.moveXOffset=0;
	enemy4.moveYOffset=0;
	powerMode=false;
	powerModeTime=10;
	powerModeTimeOffset=0;
	powerPillArr = shuffle([3,4,5,6]);
	powerPillArrOffset=0;
	
	if(difficulty=="easy") {
		gameTimer=200;
		pacManSpeedDelay=15;
		enemySpeedDelay=30;
		enemy1.enemyX=10;
		enemy1.enemyY=12;
		enemy2.enemyX=11;
		enemy2.enemyY=12;
		enemy3.enemyX=13;
		enemy3.enemyY=12;
		enemy4.enemyX=14;
		enemy4.enemyY=12;
		enemy1.viewAngle=0;
		enemy2.viewAngle=0;
		enemy3.viewAngle=0;
		enemy4.viewAngle=0;
	}
	else {
		gameTimer=200;
		pacManSpeedDelay=10;
		enemySpeedDelay=15;
		enemy1.enemyX=10;
		enemy1.enemyY=12;
		enemy2.enemyX=11;
		enemy2.enemyY=12;
		enemy3.enemyX=13;
		enemy3.enemyY=12;
		enemy4.enemyX=14;
		enemy4.enemyY=12;
		enemy1.viewAngle=0;
		enemy2.viewAngle=0;
		enemy3.viewAngle=0;
		enemy4.viewAngle=0;
	}
}

var map25_1 = [ [1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,0,1,1,0,1,1,1,1,1,1,0,1],
				[1,0,3,0,0,0,1,1,1,1,1,0,1],
				[1,0,1,1,1,0,0,0,0,0,0,0,0],
				[1,0,1,1,1,1,1,1,1,1,0,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,0,1,1,1,1,1,0,1,1,1],
				[1,1,1,0,1,1,1,1,1,0,1,1,1],
				[1,1,1,0,1,1,1,1,1,0,1,1,1],
				[1,0,0,0,0,0,0,1,0,0,0,0,0],
				[1,0,1,1,1,1,0,1,0,1,1,2,2],
				[1,0,1,1,1,1,0,1,0,1,2,2,2],
				[1,0,0,0,0,1,0,1,0,1,1,1,1],
				[1,0,1,1,0,1,0,0,0,0,0,0,0],
				[1,0,1,0,0,0,0,1,1,1,1,1,1],
				[1,0,1,0,1,1,0,0,0,0,0,0,0],
				[1,0,1,0,0,1,0,1,1,1,0,1,1],
				[1,0,1,1,0,0,0,1,1,1,0,1,1],
				[1,0,1,1,0,1,1,1,1,1,0,1,1],
				[1,0,3,0,0,1,1,1,0,0,0,1,1],
				[1,0,1,1,0,1,0,0,0,1,1,1,1],
				[1,0,1,1,0,0,0,1,1,1,1,1,1],
				[1,0,0,0,0,1,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1]	
				];

var map25_2 = [ [1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,1,0,0,0,1,1,0,0,0],
				[1,0,1,0,1,0,1,0,1,1,0,1,0],
				[1,0,1,0,1,0,1,0,0,0,0,1,0],
				[1,0,1,3,0,0,1,1,1,1,0,0,0],
				[1,0,1,0,1,0,1,0,0,0,0,1,0],
				[1,0,0,0,1,0,0,0,1,1,1,1,0],
				[1,0,1,0,0,0,1,0,0,1,1,1,0],
				[1,0,1,1,1,1,1,1,0,0,0,0,0],
				[1,0,1,1,1,1,1,1,0,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,0,1,1,1,1,0,1,1,2,2],
				[1,0,0,0,0,0,0,1,0,1,2,2,2],
				[1,0,1,1,1,1,0,1,0,1,1,1,1],
				[1,0,1,1,1,1,0,1,0,0,0,0,0],
				[1,0,1,1,1,1,0,1,1,1,1,1,0],
				[1,0,1,1,1,1,0,0,0,0,1,0,0],
				[1,0,1,0,0,0,0,1,1,0,1,0,1],
				[1,0,0,0,1,1,1,1,1,0,1,0,1],
				[1,0,1,1,1,1,1,0,0,0,0,0,0],
				[1,0,0,3,0,1,1,0,1,1,1,1,0],
				[1,0,1,1,0,0,0,0,1,1,1,1,0],
				[1,0,1,1,0,1,1,0,0,0,0,1,0],
				[1,0,0,0,0,1,1,1,1,1,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1]	
				];
				
var map25_3 = [ [1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,0,1,0,1,1,1,1,1,1,0,1,1],
				[1,0,1,3,1,1,1,1,1,1,0,1,1],
				[1,0,1,0,0,1,1,1,0,0,0,0,0],
				[1,0,1,1,0,1,1,1,0,1,0,1,1],
				[1,0,0,0,0,0,0,0,0,1,0,1,1],
				[1,0,1,1,0,1,1,1,1,1,0,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,0,1,1,1,1,0,1,0,1,0,1],
				[1,0,0,0,1,1,1,0,0,0,0,0,0],
				[1,0,1,0,1,1,1,0,0,1,1,2,2],
				[1,0,1,0,1,1,1,0,1,1,2,2,2],
				[1,0,1,0,1,1,1,0,1,1,1,1,1],
				[1,0,1,0,0,0,0,0,1,0,0,0,1],
				[1,0,1,0,1,1,1,0,0,0,1,0,1],
				[1,0,0,0,1,1,1,0,1,1,0,0,1],
				[1,0,1,1,1,0,0,0,0,1,0,1,1],
				[1,0,0,0,0,0,1,1,0,1,0,0,0],
				[1,0,1,0,1,0,1,1,0,0,0,1,1],
				[1,0,1,3,1,0,1,1,1,0,1,1,1],
				[1,0,1,0,1,0,0,0,1,0,0,0,0],
				[1,0,1,0,1,1,1,0,1,0,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1]	
				];

//enemy class
function Enemy(){
	this.enemyX;
	this.enemyY;
	this.moveXOffset;
	this.moveYOffset;
	this.viewAngle;	
}

Enemy.prototype.enemyMove = function(){
	if(gameStart && !gameOver) {
	//find next view angle
	switch(this.viewAngle) {
		case 0:
			//check 90&270 that have path
			if(Math.random()<0.5 && this.moveYOffset==0) {		
				if(Math.random()<0.5) 
					if(map[this.enemyX+1][this.enemyY]!=1) this.viewAngle=90;
					else if(map[this.enemyX-1][this.enemyY]!=1) this.viewAngle=270;
				else
					if(map[this.enemyX-1][this.enemyY]!=1) this.viewAngle=270;
					else if(map[this.enemyX+1][this.enemyY]!=1) this.viewAngle=90;
			}
			//check front has path
			if(map[this.enemyX][this.enemyY-1]==1) {
				if(Math.random()<0.5) this.viewAngle=90;
				else this.viewAngle=270;
				if(this.viewAngle==90 && map[this.enemyX+1][this.enemyY]==1) this.viewAngle=270;
				if(this.viewAngle==270 && map[this.enemyX-1][this.enemyY]==1) this.viewAngle=90;		
			}
			break;
		case 90:
			//check 0&180 that have path
			if(Math.random()<0.5 && this.moveXOffset==0) {		
				if(Math.random()<0.5) 
					if(map[this.enemyX][this.enemyY-1]!=1) this.viewAngle=0;
					else if(map[this.enemyX][this.enemyY+1]!=1) this.viewAngle=180;
				else
					if(map[this.enemyX][this.enemyY+1]!=1) this.viewAngle=180;
					else if(map[this.enemyX][this.enemyY-1]!=1) this.viewAngle=0;
			}
			//check front has path
			if(map[this.enemyX+1][this.enemyY]==1) {
				if(Math.random()<0.5) this.viewAngle=0;
				else this.viewAngle=180;
				if(this.viewAngle==0 && map[this.enemyX][this.enemyY-1]==1) this.viewAngle=180;
				if(this.viewAngle==180 && map[this.enemyX][this.enemyY+1]==1) this.viewAngle=0;
			}
			break;
		case 180:
			//check 90&270 that have path
			if(Math.random()<0.5 && this.moveYOffset==0) {		
				if(Math.random()<0.5) 
					if(map[this.enemyX+1][this.enemyY]!=1) this.viewAngle=90;
					else if(map[this.enemyX-1][this.enemyY]!=1) this.viewAngle=270;
				else
					if(map[this.enemyX-1][this.enemyY]!=1) this.viewAngle=270;
					else if(map[this.enemyX+1][this.enemyY]!=1) this.viewAngle=90;
			}
			//check front has path
			if(map[this.enemyX][this.enemyY+1]==1) {
				if(Math.random()<0.5) this.viewAngle=90;
				else this.viewAngle=270;
				if(this.viewAngle==90 && map[this.enemyX+1][this.enemyY]==1) this.viewAngle=270;
				if(this.viewAngle==270 && map[this.enemyX-1][this.enemyY]==1) this.viewAngle=90;
			}
			break;
		case 270:
			//check 0&180 that have path
			if(Math.random()<0.5 && this.moveXOffset==0) {		
				if(Math.random()<0.5) 
					if(map[this.enemyX][this.enemyY-1]!=1) this.viewAngle=0;
					else if(map[this.enemyX][this.enemyY+1]!=1) this.viewAngle=180;
				else
					if(map[this.enemyX][this.enemyY+1]!=1) this.viewAngle=180;
					else if(map[this.enemyX][this.enemyY-1]!=1) this.viewAngle=0;
			}
			//check front has path
			if(map[this.enemyX-1][this.enemyY]==1) {
				if(Math.random()<0.5) this.viewAngle=0;
				else this.viewAngle=180;
				if(this.viewAngle==0 && map[this.enemyX][this.enemyY-1]==1) this.viewAngle=180;
				if(this.viewAngle==180 && map[this.enemyX][this.enemyY+1]==1) this.viewAngle=0;
			}
			break;
	}
	
	//enemy move
	switch(this.viewAngle) {
		case 0:
			if(map[this.enemyX][this.enemyY-1]!=1) {
				this.moveYOffset--;
				this.moveXOffset=0;
				if(this.moveYOffset<=-10) {
					this.enemyY--;
					this.moveYOffset=0;
				}
			}
			break;
		case 90:
			if(map[this.enemyX+1][this.enemyY]!=1) {
				this.moveXOffset++;
				this.moveYOffset=0;
				if(this.moveXOffset>=10) {
					this.enemyX++;
					this.moveXOffset=0;
				}
			}
			break;
		case 180:
			if(map[this.enemyX][this.enemyY+1]!=1) {
				this.moveYOffset++;
				this.moveXOffset=0;
				if(this.moveYOffset>=10) {
					this.enemyY++;
					this.moveYOffset=0;
				}
			}
			break;
		case 270:
			if(map[this.enemyX-1][this.enemyY]!=1) {
				this.moveXOffset--;
				this.moveYOffset=0;
				if(this.moveXOffset<=-10) {
					this.enemyX--;
					this.moveXOffset=0;
				}
			}
			break;
	}
	}
}

function createMap() {
	//create 2Darray
	map = new Array(mapSize);
	pill = new Array(mapSize);
	for (var i = 0; i < mapSize; i++) {
		map[i] = new Array(mapSize);
		pill[i] = new Array(mapSize);
	}
	
	
	//initial map value
	var chooseMap=Math.random();
	if(mapSize==25) {
		var halfMapSize=Math.ceil(mapSize/2);
		for (var i = 0; i < mapSize ; i++) {
			for (var j = 0; j < mapSize; j++) {
				if(i<halfMapSize) {
					if(chooseMap<0.3) map[i][j]=map25_1[j][i];
					else if(chooseMap>=0.6) map[i][j]=map25_2[j][i];
					else map[i][j]=map25_3[j][i];
					}
				else
					map[i][j]=map[mapSize-i-1][j];
			}
		}
	}
	
	//initial pill value
	var powerPillArr = shuffle([3,4,5,6]);
	var powerPillIndex=0;
	for (var i in map) {
		for (var j in map[i]) {
			pill[i][j]=map[i][j];
			if(pill[i][j]!=1 && pill[i][j]!=2)pillTotal++;
			if(pill[i][j]==3) pill[i][j]=powerPillArr[powerPillIndex++];
		}
	}	
}

function draw(){
	ctx.clearRect(0,0,canvasSize,canvasSize);
	
	//draw wall
	for(var i in map){
		for (var j in map[i]){
			if (map[i][j] == 1){
				ctx.beginPath();
				ctx.fillStyle="#000079";
				ctx.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
				ctx.fill();
			}
		}
	}
	
	//draw pill
	for(var i in pill){
		for (var j in pill[i]){
			//draw pill
			if (pill[i][j] == 0){
				ctx.fillStyle="#ffffff";
				ctx.beginPath();
				ctx.arc(i*cellSize+cellSize/2, j*cellSize+cellSize/2, cellSize/8, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			//draw power pill
			if (pill[i][j] == 3){
				ctx.fillStyle="#ff0000";
				ctx.beginPath();
				ctx.arc(i*cellSize+cellSize/2, j*cellSize+cellSize/2, cellSize/4, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (pill[i][j] == 4){
				ctx.fillStyle="#ffff00";
				ctx.beginPath();
				ctx.arc(i*cellSize+cellSize/2, j*cellSize+cellSize/2, cellSize/4, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (pill[i][j] == 5){
				ctx.fillStyle="#00ff00";
				ctx.beginPath();
				ctx.arc(i*cellSize+cellSize/2, j*cellSize+cellSize/2, cellSize/4, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (pill[i][j] == 6){
				ctx.fillStyle="#0000ff";
				ctx.beginPath();
				ctx.arc(i*cellSize+cellSize/2, j*cellSize+cellSize/2, cellSize/4, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	
	//drawPacMan
	ctx.fillStyle = "#ffff00";
	ctx.beginPath();
	ctx.arc(pacManX*cellSize+cellSize/2+pacManMoveXOffset*cellSize/10.0, pacManY*cellSize+cellSize/2+pacManMoveYOffset*cellSize/10.0, cellSize/2, (pacManViewAngleOffset+0.25-pacManMouthOffset) * Math.PI, (pacManViewAngleOffset+1.25-pacManMouthOffset) * Math.PI,false);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(pacManX*cellSize+cellSize/2+pacManMoveXOffset*cellSize/10.0, pacManY*cellSize+cellSize/2+pacManMoveYOffset*cellSize/10.0, cellSize/2, (pacManViewAngleOffset+0.75+pacManMouthOffset) * Math.PI, (pacManViewAngleOffset+1.75+pacManMouthOffset) * Math.PI,false);
	ctx.fill();
	
	//drawEnemy
	var enemyPic1;
	var enemyPic2;
	var enemyPic3;
	var enemyPic4;
	if(powerMode) {
		if(powerModeTimeOffset%2==1 && powerModeTimeOffset>6) {
		enemyPic1 = document.getElementById("enemy5b");
		enemyPic2 = document.getElementById("enemy5b");
		enemyPic3 = document.getElementById("enemy5b");
		enemyPic4 = document.getElementById("enemy5b");
		}
		else {
			enemyPic1 = document.getElementById("enemy5a");
			enemyPic2 = document.getElementById("enemy5a");
			enemyPic3 = document.getElementById("enemy5a");
			enemyPic4 = document.getElementById("enemy5a");
		}
		
	}
	else {
		enemyPic1 = document.getElementById("enemy1");
		enemyPic2 = document.getElementById("enemy2");
		enemyPic3 = document.getElementById("enemy3");
		enemyPic4 = document.getElementById("enemy4");
	}
	ctx.drawImage(enemyPic1,enemy1.enemyX*cellSize+enemy1.moveXOffset*cellSize/10.0,enemy1.enemyY*cellSize+enemy1.moveYOffset*cellSize/10.0,cellSize,cellSize);
	ctx.drawImage(enemyPic2,enemy2.enemyX*cellSize+enemy2.moveXOffset*cellSize/10.0,enemy2.enemyY*cellSize+enemy2.moveYOffset*cellSize/10.0,cellSize,cellSize);
	ctx.drawImage(enemyPic3,enemy3.enemyX*cellSize+enemy3.moveXOffset*cellSize/10.0,enemy3.enemyY*cellSize+enemy3.moveYOffset*cellSize/10.0,cellSize,cellSize);
	ctx.drawImage(enemyPic4,enemy4.enemyX*cellSize+enemy4.moveXOffset*cellSize/10.0,enemy4.enemyY*cellSize+enemy4.moveYOffset*cellSize/10.0,cellSize,cellSize);

	//draw if gameOver
	if(gameOver) {
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.globalAlpha=0.7;
		ctx.fillRect(0,0,canvasSize,canvasSize);
		ctx.globalAlpha=1;
		ctx.font="60px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(gameOverMsg,canvasSize/2,canvasSize/2 );
		ctx.textAlign = 'center';
	}
	else if(!gameStart) {
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.globalAlpha=0.7;
		ctx.fillRect(0,0,canvasSize,canvasSize);
		ctx.globalAlpha=1;
		ctx.font="60px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("Follow Order",canvasSize/2,canvasSize/2-30 );
		ctx.textAlign = 'center';
		for (var i in powerPillArr) {
			if (powerPillArr[i] == 3 && i>=powerPillArrOffset){
				ctx.fillStyle="#ff0000";
				ctx.beginPath();
				ctx.arc(130+i*80, 280, cellSize, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (powerPillArr[i] == 4 && i>=powerPillArrOffset){
				ctx.fillStyle="#ffff00";
				ctx.beginPath();
				ctx.arc(130+i*80, 280, cellSize, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (powerPillArr[i] == 5 && i>=powerPillArrOffset){
				ctx.fillStyle="#00ff00";
				ctx.beginPath();
				ctx.arc(130+i*80, 280, cellSize, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
			if (powerPillArr[i] == 6 && i>=powerPillArrOffset){
				ctx.fillStyle="#0000ff";
				ctx.beginPath();
				ctx.arc(130+i*80, 280, cellSize, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
	
	//updateTopStatus
	ctxTop.clearRect(0,0,500,25);
	ctxTop.font="20px Arial";
	ctxTop.fillStyle = "#ffffff";
	ctxTop.fillText("Score:"+pillAte*10,5,24 );
	ctxTop.fillText("Lives:"+pacManLive,120,24 );
	ctxTop.fillText("Order:",230,24 );
	ctxTop.fillText("Timer:"+gameTimer,400,24 );
	for (var i in powerPillArr) {
		if (powerPillArr[i] == 3 && i>=powerPillArrOffset){
			ctxTop.fillStyle="#ff0000";
			ctxTop.beginPath();
			ctxTop.arc(300+i*15, 18, cellSize/4, 0, 2 * Math.PI);
			ctxTop.closePath();
			ctxTop.fill();
		}
		if (powerPillArr[i] == 4 && i>=powerPillArrOffset){
			ctxTop.fillStyle="#ffff00";
			ctxTop.beginPath();
			ctxTop.arc(300+i*15, 18, cellSize/4, 0, 2 * Math.PI);
			ctxTop.closePath();
			ctxTop.fill();
		}
		if (powerPillArr[i] == 5 && i>=powerPillArrOffset){
			ctxTop.fillStyle="#00ff00";
			ctxTop.beginPath();
			ctxTop.arc(300+i*15, 18, cellSize/4, 0, 2 * Math.PI);
			ctxTop.closePath();
			ctxTop.fill();
		}
		if (powerPillArr[i] == 6 && i>=powerPillArrOffset){
			ctxTop.fillStyle="#0000ff";
			ctxTop.beginPath();
			ctxTop.arc(300+i*15, 18, cellSize/4, 0, 2 * Math.PI);
			ctxTop.closePath();
			ctxTop.fill();
		}
	}
	
}

function doKeyDown(e) {
	switch(e.keyCode) {
		case 37:
		case 65:
			pacManPreChangeViewAngle=270;
			break;
		case 38:
		case 87:
			pacManPreChangeViewAngle=0;
			break;
		case 39:
		case 68:
			pacManPreChangeViewAngle=90;
			break;
		case 40:
		case 83:
			pacManPreChangeViewAngle=180;
			break;
	}
	if(!gameOver)gameStart1();
	else gameRestart();
}
function mouseControl(direction) {
	if(direction=="up")pacManPreChangeViewAngle=0;
	if(direction=="left")pacManPreChangeViewAngle=270;
	if(direction=="right")pacManPreChangeViewAngle=90;
	if(direction=="down")pacManPreChangeViewAngle=180;
	e.focus();
	if(!gameOver)gameStart1();
}

function pacManMove() {
	if(gameStart && !gameOver) {
	//pacMan Move
	switch(pacManViewAngle) {
		case 0:
			if(map[pacManX][pacManY-1]!=1) {
				pacManViewAngleOffset=-0.5;
				pacManMoveYOffset--;
				pacManMoveXOffset=0;
				if(pacManMoveYOffset<=-10) {
					pacManY--;
					pacManMoveYOffset=0;
					//pacMan eat pills
					if(pill[pacManX][pacManY]!=1 && pill[pacManX][pacManY]!=2) {
						if(pill[pacManX][pacManY]!=0) {
							if(pill[pacManX][pacManY]==powerPillArr[powerPillArrOffset]) {
								powerPillArrOffset++;
								powerMode=true;
								powerModeTimeOffset=0;
							}
							else gameOver=true;
						}
						pill[pacManX][pacManY]=1;
						pillAte++;
						pillAudio.play();
					}
				}
				//pacman mouth animation
				if(pacManMoveYOffset>-5)pacManMouthOffset=pacManMoveYOffset*-1/20.0;
				else pacManMouthOffset=(10+pacManMoveYOffset)/20.0;
			}
			break;
		case 90:
			if(map[pacManX+1][pacManY]!=1) {
				pacManViewAngleOffset=0;
				pacManMoveXOffset++;
				pacManMoveYOffset=0;
				if(pacManMoveXOffset>=10) {
					pacManX++;
					pacManMoveXOffset=0;
					//pacMan eat pills
					if(pill[pacManX][pacManY]!=1 && pill[pacManX][pacManY]!=2) {
						if(pill[pacManX][pacManY]!=0) {
							if(pill[pacManX][pacManY]==powerPillArr[powerPillArrOffset]) {
								powerPillArrOffset++;
								powerMode=true;
								powerModeTimeOffset=0;
							}
							else gameOver=true;
						}
						pill[pacManX][pacManY]=1;
						pillAte++;
						pillAudio.play();
					}
				}
				//pacman mouth animation
				if(pacManMoveXOffset<5)pacManMouthOffset=pacManMoveXOffset/20.0;
				else pacManMouthOffset=(10-pacManMoveXOffset)/20.0;
			}
			break;
		case 180:
			if(map[pacManX][pacManY+1]!=1) {
				pacManViewAngleOffset=0.5;
				pacManMoveYOffset++;
				pacManMoveXOffset=0;
				if(pacManMoveYOffset>=10) {
					pacManY++;
					pacManMoveYOffset=0;
					//pacMan eat pills
					if(pill[pacManX][pacManY]!=1 && pill[pacManX][pacManY]!=2) {
						if(pill[pacManX][pacManY]!=0) {
							if(pill[pacManX][pacManY]==powerPillArr[powerPillArrOffset]) {
								powerPillArrOffset++;
								powerMode=true;
								powerModeTimeOffset=0;
							}
							else gameOver=true;
						}
						pill[pacManX][pacManY]=1;
						pillAte++;
						pillAudio.play();
					}
				}
				//pacman mouth animation
				if(pacManMoveYOffset<5)pacManMouthOffset=pacManMoveYOffset/20.0;
				else pacManMouthOffset=(10-pacManMoveYOffset)/20.0;
			}
			break;
		case 270:
			if(map[pacManX-1][pacManY]!=1) {
				pacManViewAngleOffset=1;
				pacManMoveXOffset--;
				pacManMoveYOffset=0;
				if(pacManMoveXOffset<=-10) {
					pacManX--;
					pacManMoveXOffset=0;
					//pacMan eat pills
					if(pill[pacManX][pacManY]!=1 && pill[pacManX][pacManY]!=2) {
						if(pill[pacManX][pacManY]!=0) {
							if(pill[pacManX][pacManY]==powerPillArr[powerPillArrOffset]) {
								powerPillArrOffset++;
								powerMode=true;
								powerModeTimeOffset=0;
							}
							else gameOver=true;
						}
						pill[pacManX][pacManY]=1;
						pillAte++;
						pillAudio.play();
					}
				}
				//pacman mouth animation
				if(pacManMoveXOffset>-5)pacManMouthOffset=pacManMoveXOffset*-1/20.0;
				else pacManMouthOffset=(10+pacManMoveXOffset)/20.0;
			}
			break;
	}
		
	//check pacMan meet enemy
	if( (pacManX==enemy1.enemyX && pacManY==enemy1.enemyY) ||
	(pacManX==enemy2.enemyX && pacManY==enemy2.enemyY) ||
	(pacManX==enemy3.enemyX && pacManY==enemy3.enemyY) ||
	(pacManX==enemy4.enemyX && pacManY==enemy4.enemyY) ) {
		if(!powerMode) {
			pacManX=1;
			pacManY=mapSize-2;
			pacManViewAngle=90;
			pacManPreChangeViewAngle=90;
			if(pacManLive>0)pacManLive--;
		}
		else {
			if(mapSize==25) {
				if(pacManX==enemy1.enemyX && pacManY==enemy1.enemyY) {
					enemy1.enemyX=10;
					enemy1.enemyY=12;
				}
				if(pacManX==enemy2.enemyX && pacManY==enemy2.enemyY) {
					enemy2.enemyX=11;
					enemy2.enemyY=12;
				}
				if(pacManX==enemy3.enemyX && pacManY==enemy3.enemyY) {
					enemy3.enemyX=13;
					enemy3.enemyY=12;
				}
				if(pacManX==enemy4.enemyX && pacManY==enemy4.enemyY) {
					enemy4.enemyX=14;
					enemy4.enemyY=12;
				}
			}
			else {
				if(pacManX==enemy1.enemyX && pacManY==enemy1.enemyY) {
					enemy1.enemyX=19;
					enemy1.enemyY=19;
				}
				if(pacManX==enemy2.enemyX && pacManY==enemy2.enemyY) {
					enemy2.enemyX=20;
					enemy2.enemyY=19;
				}
				if(pacManX==enemy3.enemyX && pacManY==enemy3.enemyY) {
					enemy3.enemyX=19;
					enemy3.enemyY=20;
				}
				if(pacManX==enemy4.enemyX && pacManY==enemy4.enemyY) {
					enemy4.enemyX=20;
					enemy4.enemyY=20;
				}
			}
		}
	}
	
	//check gameOver
	if(pillAte == pillTotal) {
		gameOver=true;
		gameOverMsg="Win!";
		gamePause();
	}
	else if(pacManLive == 0 || gameOver) {
		gameOver=true;
		gameOverMsg="Game Over!";
		gamePause();
	}
	
	//change PacMan view angle
	switch(pacManPreChangeViewAngle) {
		case 0:
			if(map[pacManX][pacManY-1]!=1)
				pacManViewAngle=pacManPreChangeViewAngle;
			break;
		case 90:
			if(map[pacManX+1][pacManY]!=1)
				pacManViewAngle=pacManPreChangeViewAngle;
			break;
		case 180:
			if(map[pacManX][pacManY+1]!=1)
				pacManViewAngle=pacManPreChangeViewAngle;
			break;
		case 270:
			if(map[pacManX-1][pacManY]!=1)
				pacManViewAngle=pacManPreChangeViewAngle;
			break;
	}
	
	}
}

function gameStart1() {
	gameStart=true;
	if(gameOver)gameRestart();
	e.focus();
}
function gamePause() {
	gameStart=false;
	e.focus();
}
function gameRestart() {
	initialVariable();
	clearInterval( pacManTimer );
	pacManTimer = setInterval(pacManMove,pacManSpeedDelay);
	clearInterval( enemy1Timer );
	enemy1Timer = setInterval(enemy1.enemyMove.bind(enemy1),enemySpeedDelay);
	clearInterval( enemy2Timer );
	enemy2Timer = setInterval(enemy2.enemyMove.bind(enemy2),enemySpeedDelay);
	clearInterval( enemy3Timer );
	enemy3Timer = setInterval(enemy3.enemyMove.bind(enemy3),enemySpeedDelay);
	clearInterval( enemy4Timer );
	enemy4Timer = setInterval(enemy4.enemyMove.bind(enemy4),enemySpeedDelay);
	createMap();
	e.focus();
}
function gameTimerFunction() {
	if(gameTimer==0) {
		gameOver=true;
		gameOverMsg="Game Over!";
	}
	if(gameTimer>0 && !gameOver && gameStart)gameTimer--;
}
function powerModeControl() {
	if(powerMode) {
		if(powerModeTime == powerModeTimeOffset) {
			powerMode=false;
			powerModeTimeOffset=0;
		}
		else powerModeTimeOffset++;
	}
}

function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//start
e.focus();
initialVariable();
createMap();
setInterval(draw,Math.floor(1000/fps));
setInterval(gameTimerFunction,1000);
setInterval(powerModeControl,1000);
var pacManTimer = setInterval(pacManMove,pacManSpeedDelay);
var enemy1Timer = setInterval(enemy1.enemyMove.bind(enemy1),enemySpeedDelay);
var enemy2Timer = setInterval(enemy2.enemyMove.bind(enemy2),enemySpeedDelay);
var enemy3Timer = setInterval(enemy3.enemyMove.bind(enemy3),enemySpeedDelay);
var enemy4Timer = setInterval(enemy4.enemyMove.bind(enemy4),enemySpeedDelay);

//add mouse control
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
canvas.addEventListener('click', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var minusXY = mousePos.x - mousePos.y;
	var sumXY = mousePos.x + mousePos.y  - canvasSize;
	
	if (minusXY >= 0 && sumXY >= 0) {
		mouseControl("right");
	}
	else if (minusXY >= 0 && sumXY < 0) {
		mouseControl("up");
	}
	else if (minusXY < 0 && sumXY >= 0) {
		mouseControl("down");
	}
	else if (minusXY < 0 && sumXY < 0) {
		mouseControl("left");
	}

}, false);

