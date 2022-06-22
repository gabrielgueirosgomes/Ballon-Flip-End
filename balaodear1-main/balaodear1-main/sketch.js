var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var obstacleTop, obsTop1, obsTop2
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3
var gameState = "play"
var gameOver, gameOverImg
var restart, restartImg
var somJump, somMorte
var score = 0
function preload(){
bgImg = loadImage ("assets/bg.png")
bgImg2 = loadImage ("assets/bgImg2.jpg")
obsTop2 = loadImage ("assets/obsTop2.png")
obsTop1 = loadImage ("assets/obsTop1.png")
obsBottom1 = loadImage ("assets/obsBottom1.png")
obsBottom2 = loadImage ("assets/obsBottom2.png")
obsBottom3 = loadImage ("assets/obsBottom3.png")
balloonImg = loadAnimation ("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png")
gameOverImg = loadImage ("assets/fimdejogo.png")
restartImg = loadImage ("assets/restart.png")
somJump = loadSound("assets/jump.mp3")
somMorte = loadSound("assets/die.mp3")
}

function setup(){

//imagem de plano de fundo
  bg = createSprite (165, 485, 1, 1)
  bg.addImage(bgImg)
  bg.scale = 1.3
  ImagemDeFundo()
//criando canto superior e inferior
bottomGround = createSprite (200, 390, 800, 20)
bottomGround.visible = false;

topGround = createSprite (200, 10, 800, 20)
topGround.visible = false;
      
//criando o balão     
  balloon = createSprite (100, 200, 20, 50)
  balloon.addAnimation("balão", balloonImg)
  balloon.scale = 0.2
 balloon.setCollider("rectangle",0,0,balloon.width, 350);
balloon.debug = false

  obstaclesTopGroup = new Group()
  obstacleBottomGroup = new Group()
  barrasGroup = new Group()


  gameOver = createSprite(200,100);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false
  
  restart = createSprite(200,140);
  restart.addImage(restartImg);
  restart.visible = false

  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
}

function draw() {
  
  background("black");
        if(gameState == "play"){
          if(keyDown("space")&& balloon.y >= 100) {
            balloon.velocityY = -8 ;
            somJump.play() 
            somJump.setVolume(0.1)
            
        }
          //adicionando gravidade
          balloon.velocityY = balloon.velocityY + 1
          spawnObstacles()
        barra()
        if(obstaclesTopGroup.isTouching(balloon)||obstacleBottomGroup.isTouching(balloon)||balloon.isTouching(topGround)||balloon.isTouching(bottomGround)){
          gameState = "end" 
          somMorte.play()
          somMorte.setVolume(1.1)
        } 
      } 
     if(gameState == "end"){
       gameOver.visible = true
       restart.visible = true
       balloon.velocityY = 0
       balloon.velocityX = 0
       obstacleBottomGroup.setVelocityXEach(0);
       obstaclesTopGroup.setVelocityXEach(0); 
       obstacleBottomGroup.setLifetimeEach(-1);
    obstaclesTopGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) { 
      reset();
    }
    gameOver.depth = balloon.depth;
    gameOver.depth = gameOver.depth + 1;
     }
          //fazendo o balão de ar quente pular
          drawSprites(); 
         Score()
}

function reset(){
  gameState = "play"
  gameOver.visible = false
  restart.visible = false
  obstacleBottomGroup.destroyEach()
  obstaclesTopGroup.destroyEach()
  balloon.position.y = 200
  balloon.position.x = 100
  score = 0
  
}


function barra(a){
  if (frameCount % 60 === 0){
        var barr = createSprite(400,200,10,600);
    barr.velocityX = -6
    barr.lifetime = 66
    barr.visible = false
    barrasGroup.add(barr)
  }   
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacleTop = createSprite(400,50,40,50);
    obstacleTop.velocityX = -4
    obstacleTop.y = Math.round(random(10,80  ))

     //gerar obstáculos aleatórios
     var rand = Math.round(random(1,2));
     switch(rand) {
       case 1: obstacleTop.addImage(obsTop1);
               break;
       case 2: obstacleTop.addImage(obsTop2);
               break;
       default: break;
     }
    
     //atribuir dimensão e tempo de vida ao obstáculo           
     obstacleTop.scale = 0.1;
     obstacleTop.lifetime = 100;
     obstacleTop.depth = balloon.depth;
    balloon.depth = balloon.depth + 1;
    //acrescentar cada obstáculo ao grupo
     obstaclesTopGroup.add(obstacleTop);
  }


  if (frameCount % 60 === 0){
    var obstacleBottom = createSprite(400,350,40,50);
    obstacleBottom.velocityX = -4
   // obstacleBottom.x = Math.round(random(10,100))
  var rand = Math.round(random(1,3));
  switch(rand) {
    case 1: obstacleBottom.addImage(obsBottom1);
            break;
    case 2: obstacleBottom.addImage(obsBottom2);
            break;
            case 3: obstacleBottom.addImage(obsBottom3);
            break;
    default: break;
  }
 
  //atribuir dimensão e tempo de vida ao obstáculo           
  obstacleBottom.scale = 0.07;
  obstacleBottom.lifetime = 100;
  obstacleBottom.depth = balloon.depth;
 balloon.depth = balloon.depth + 1;
 //acrescentar cada obstáculo ao grupo
 obstacleBottomGroup.add(obstacleBottom);
 }
}

function Score(){
if(balloon.isTouching(barrasGroup)){
  score+=1
}
textFont("algerian");
 textSize(25 );
 fill("yellow");
text("Pontuação :"+score, 150, 50)
}

async function ImagemDeFundo(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
   var responseJSON = await response.json();
   var datetime = responseJSON.datetime;
    var hour = datetime.slice(11,13);
    if(hour>=06 && hour<=19)
    { bg.addImage(bgImg);
       bg.scale = 1.3 } 
    else{ bg.addImage(bgImg2); 
      bg.scale = 1.5 
      bg.x=200 
      bg.y=200
    }
}