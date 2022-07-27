var myDiv = document.getElementById("game-board");
//setting a variable for the game-board canvas 
var img = new Image();
img.src = "images/bg.png";

var imgTop = new Image();
imgTop.src = "images/obstacle_top.png";

var imgBottom = new Image();
imgBottom.src = "images/obstacle_bottom.png";;
//images brought in


var myObstaclesT = [];
var myObstaclesB = [];
//array for score

var points = 0;
//points counter

window.onload = function() {
  document.getElementById("start-button").onclick = function(){
    startGame();
  };
//given onlcick function to start game

document.onkeydown = function(e){
  if(e.Key = 32){
    e.preventDefault();
    moveUp();
    };
  }
document.onkeyup = function(e){
  faby.speedY = 1;
  }
//onkey function for faby start and up movement


function startGame(){
  resetGame();
  myGameArea.start();    
  faby.drawFaby();    
  }
};
//given start game and passing other functions what to do at game start

var myGameArea = {
  canvas: document.getElementById("my-canvas"),
//declaring the canvas 
  start: function(){
    this.canvas.width = 1800;
    this.canvas.height = 650;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    myDiv.insertBefore(this.canvas, null);
    this.interval = setInterval(updateGameArea, 10);
  },
  //start function declaring canvas size, ctx,  anything to insertBefore game-board, 
  //and a interval = set interval passing functionto update the game area on start
  frames: 0,
  stop: function(){
    clearInterval(this.interval);
  },
  //stop fuction
  score: function(){
    this.ctx.font = '30px serif-sans';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Score:'+ points, 20, 20);
  }
  //score viewer
};
//create the canvas area for game

var bgImg = {
  img: img,
  x: 0,
  speed: -1,
//image is image, x axis 0, speed - as we want to move opposite of faby
  movebg: function(){
    this.x += this.speed;
    this.x %= myGameArea.canvas.width;
  },
//initialising the speed and how the bg moves
  draw: function(){
    myGameArea.ctx.drawImage(this.img, this.x, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    if (this.speed < 0) {
      myGameArea.ctx.drawImage(this.img, this.x + myGameArea.canvas.width, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    } 
  }
  //draw to fill canvas, if speed = <0 image should be still
};
//initialising the background image


function ComponentTop(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.ctx;
    ctx.drawImage(imgTop, this.x, this.y, this.width, this.height);
  }

  this.right = function(){return this.x + width};
  this.left = function(){return this.x};
  this.bottom = function(){return this.y + this.height;
  }
  
};
// setting the top pipe component 

function ComponentBottom(width, height, x, y){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.ctx;
    ctx.drawImage(imgBottom, this.x, this.y, this.width, this.height);
  }
 
  this.right = function(){return this.x + width};
  this.left = function(){return this.x};
  this.top = function(){return this.y
  };
  
};
//setting the bottom pipe component

function updateGameArea(){
  for (i = 0; i < myObstaclesT.length; i += 1){
    if(myObstaclesT[i].right() > faby.left()){
      if(faby.crashWithT(myObstaclesT[i])){
        finalPoints = myGameArea.frames;
        myGameArea.stop();
        return;
      }
    }
  };
  for (i = 0; i < myObstaclesB.length; i += 1){
    if(myObstaclesB[i].right() > faby.left()){
      if(faby.crashWithB(myObstaclesB[i])){
        finalPoints = myGameArea.frames;
        myGameArea.stop();
        return;
      }
    }
  };
  //instances of what to do if faby crashes with top and bottom, done with a loop of each array 
  //so will count each iteration and return the result and stop game if faby crashes or continue

  bgImg.movebg();
  bgImg.draw();
  faby.drawFaby();
  faby.update();
  myGameArea.frames +=1;
  //callbacks for what happens when game updates

  if (myGameArea.frames % 90 === 0){
    var minHeight = 30;
    var maxHeight = 400;
    var height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    var minGap = 150;
    var maxGap = 300;
    var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    myObstaclesT.push(new ComponentTop(100, height, 1500, 0));
    myObstaclesB.push(new ComponentBottom(100, myGameArea.canvas.height - height - gap, 1500, height + gap));
  };
//generate obstacles, set their parameters and dimensions, math.random function for gapsize
//then we use this to push into array of components 

  for (i = 0; i < myObstaclesT.length; i += 1){
    if(myObstaclesT[i].x + 100 <= 0){
      myObstaclesT.shift(myObstaclesT[i]);
      i--;
      continue;
    }
    myObstaclesT[i].x -= 5;
    myObstaclesT[i].update();
    if (myObstaclesT[i].right() === faby.left()){points++};
  };
//looping top pipe array so it updates when faby passes or crashes to calculate score

  for (i = 0; i < myObstaclesB.length; i += 1){
    if(myObstaclesB[i].x + 100 <= 0){
      myObstaclesB.shift(myObstaclesB[i]);
      i--;
      continue;
    }
    myObstaclesB[i].x -= 5;
    myObstaclesB[i].update();
  };
//doing the same for bottom array
  myGameArea.score();
//calling on the score after function parameters happen
};


var faby ={
  x: 560,
  y: 250,
  width: 60,
  height: 50,
//faby's dimensions and x,y position 
  drawFaby: function(){
    img2 = new Image();
    img2.src ="images/flappy.png";
    ctx = myGameArea.ctx;
    ctx.drawImage(img2, this.x, this.y, this.width, this.height);
  },
//source of faby and how he is drawn on canvas
  speedX: 0,
  speedY: 1,
  gravity: 2,
  gravitySpeed: 1,
//speed and gravity added 
  update: function(){
    hitBottomOrTop()
    this.y += this.gravity
    },
//setting the update function to use hit top or bottm function(will declare) and if y position += gravity
//then update position of faby 
  left: function(){return faby.x},
  right: function(){ return (faby.x + faby.width)},
  top: function(){return faby.y},
  bottom: function(){return faby.y + faby.height},

  crashWithT: function(obstacle){
    return ((faby.top() < obstacle.bottom()) &&
            (faby.right() > obstacle.left())) 
  },
  crashWithB : function(obstacle){
    return ((faby.bottom() > obstacle.top()) &&
            (faby.right() > obstacle.left())) 
  }
//declaring in what instance does faby crash with top or bottom
};
  
function hitBottomOrTop(){
  var bottom = 700;
    if (faby.y >= bottom - faby.height){
      faby.y = bottom - faby.height;
      clearInterval(myGameArea.interval)
    }
    else if (faby.y <= 0) {
      clearInterval(myGameArea.interval)
    }
};
//adding in what happens when faby hits bottom or top

function moveUp(){
    faby.y -= 50;
};
//the function of how faby moves up when key pressed

function resetGame(){
  myObstaclesT = [];
  myObstaclesB = [];
  points = 0;
  faby.x = 560;
  faby.y = 250;
};
//function to reset game declaring arrays are empty, points is 0 and fabys positions