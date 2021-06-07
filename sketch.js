let gridSize = 5;
let alienList = [];
let shipImg;
let myShip;
let scl = 10;
let drawNewRow = true;
let restBtn;
let myScore = 0;
let ost;
let highestScore = 0;

function preload(){
  shipImg = loadImage("spaceship.png");
  alienImg = loadImage("alien.png");
  ost = loadSound("music.mp3")
}

function setup() {
  createCanvas(500, 500);

  restBtn = createButton("Restart")
  restBtn.size(100,30);
  restBtn.position(width/2 - 50, height/2 + scl*3);
  restBtn.style('display:none; border-radius: 30px; border: 0px; background-color: lightblue;')
  restBtn.mouseClicked(restart);

  myShip = new ship();
  ost.play();
}

function draw() {
  background(0);
  textAlign(CENTER)
  fill(255);
  textSize(20);
  text("Score: " + myScore, width/2,20);

  myShip.show();
  myShip.move();
  

  if(drawNewRow){
    drawAliensRow();
  }
  if (alienList.length == 0){
    
    textSize(50);
    text("You Win!" , width/2, height/2);
    restBtn.style('display:block;')
    
    if (myScore > highestScore){
      highestScore = myScore;
    }
    textSize(20);
    text("Your Highest Score is: " + highestScore, width/2, height/2 + 20)
  }else if (alienList[0].y > (alienImg.height+scl)*9){
    textSize(50);
    text("Game Over", width/2, height/2);
    restBtn.style('display:block;')
    if (myScore > highestScore){
      highestScore = myScore;
    }
    textSize(20);
    text("Your Highest Score is: " + highestScore, width/2, height/2 + 20)
  }else{
    if (frameCount % 120 == 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      for (let i = 0; i < alienList.length; i++) {
        alienList[i].y += alienImg.height + scl;
      }
      drawNewRow = true;
    }
    for (let x = 0; x < alienList.length; x++) {
      if(alienList[x] != null){
        alienList[x].show();        
      }
    }
  }
}


// ==================================================
// ================== My Functions ==================
// ==================================================

function drawAliensRow(){
  for (let x = 0; x < random(3, width - alienImg.width); x+=alienImg.width + scl) {
    alienList.push(new alien(x, 40));
  }
  drawNewRow = false;
}

function restart(){
  alienList = [];
  aliensDir = 1;
  drawNewRow = true;
  myScore = 0;
  restBtn.style('display:none;')
}

// ==================================================
// ================ Events Functions ================
// ==================================================

function keyPressed(){
  if (key == ' '){
    myShip.shoot();
  }

  if(keyCode == RIGHT_ARROW){
    myShip.setDir(1);
  }
  if(keyCode == LEFT_ARROW){
    myShip.setDir(-1);
  }

  if(keyCode == LEFT_ARROW && keyCode == RIGHT_ARROW){
    myShip.dir *= -1;
  }
}

function keyReleased(){
  if (key != ' '){
    myShip.setDir(0);
  }
}






// ==================================================
// ============== Objects Declarations ==============
// ==================================================


// ==========================================
// ============== Ship Object ===============

function ship(){
  this.x = width/2;
  this.dir = 0;
  this.bullets = [];

  this.show = function(){
    imageMode(CENTER);
    image(shipImg, constrain(this.x, 0, width), height - shipImg.height/2);
    for (let i = this.bullets.length-1; i >= 0 ; i--) {
      if (this.bullets[i].x == null){
        this.bullets.splice(i, 1)
      }else{
        this.bullets[i].show();  
        this.bullets[i].move();
        if (this.bullets[i].y < -10){
          this.bullets.splice(i, 1)
        }
      }
      
    }
  }

  this.shoot = function(){
    this.bullets.push(new bullet(this.x, height-(shipImg.height)));
  }

  this.move = function(){
    this.x += this.dir*5;
    this.x = constrain(this.x, 0, width)
  }

}


// ===========================================
// ============== Bullet Object ==============
function bullet(x,y){
  this.x = x;
  this.y = y;

  this.show = function(){
    rectMode(CENTER);
    rect(this.x, this.y, 5, 10);
    // === Bullet Hit Mechanism ===
    for (let i = 0; i < alienList.length; i++) {
      let alienX = alienList[i].x
      let alienY = alienList[i].y
      if (this.x >= alienX && this.x < alienX + alienImg.width){
        if (this.y < alienY + alienImg.height){
          this.x = null;
          alienList.splice(i, 1)
          myScore++;
        }
        
      }
    }
  }

  this.move = function() {
    this.y -= 1 + scl;
  }
}


// ==========================================
// ============== Alien Object ==============

function alien(x,y){
  this.x = x;
  this.y = y;
  this.dir = 1;

  this.show = function(){
    imageMode(CORNER);
    image(alienImg, this.x, this.y);
  }

  this.setDir = function(dir){
    aliensDir = dir;
  }

}