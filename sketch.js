var runningTrack, runningTrackImg, runnerBoy, runnerBoyImg;
var covid, covidImg1, covidImg2;
var gloves, glovesImg;
var mask, maskImg, vaccine, vaccineImg;
var sanitizer, sanitizerImg;
var washHands, washHandsImg;
var gameImage, startImg, endImage;
var invisibleGround, bird, birdImg;
//creating a lives and scoring system
var score;
//showed lives remaining
var lives;

//creating game states
var START = 2;
var PLAY = 1;
var END = 0;
var gameState = START;

function preload(){

runningTrackImg = loadImage("running_track_image.png");
runnerBoyImg = loadImage("runner_boy_image.gif");

covidImg1 = loadImage("covid_image.png");
covidImg2 = loadImage("covid2_image.png");

startImg = loadImage("start_image.png");
endImg = loadImage("game_over_image.png");

glovesImg = loadImage("gloves_image.png");
maskImg = loadImage("mask_image.png");
sanitizerImg = loadImage("sanitizer_image.png");
vaccineImg = loadImage("vaccine_image.png");
washHandsImg = loadImage("washing_hands_image.png");

youLoseImg = loadImage("you_lose_image.png");
youWinImg = loadImage("you_win_image.png");

birdImg = loadImage("bird_image.gif");

}

function setup() {
 createCanvas(displayWidth, displayHeight);

 //creating the runnning track
 runningTrack = createSprite(displayWidth-600,displayHeight-400,displayWidth,displayHeight);
 runningTrack.addImage("track", runningTrackImg);
 runningTrack.scale = 1.5 ;
 runningTrack.velocityX = -5;
 runningTrack.visible = false;

//creating the runner boy
runnerBoy = createSprite(100, displayHeight-200,80,50);
runnerBoy.addImage("runner", runnerBoyImg);
runnerBoy.scale = 0.35;
runnerBoy.visible = false;

//creating the invisible ground
invisibleGround = createSprite(300,displayHeight-80,displayWidth,5);
invisibleGround.visible = false;

//image for starting the game
gameImage = createSprite(500,200,80,50);
gameImage.addImage("game", startImg);  
gameImage.scale = 0.3;
gameImage.visible = false;

//making group for obstacles and collectables
covidG = new Group();
glovesG = new Group();
maskG = new Group();
sanitizerG = new Group();
vaccineG = new Group();
washHandsG = new Group();

//variables for scoring and lives system
score = 0;
lives = 3;

}

function draw() {
 background("turquoise");
 
 drawSprites();

 //game state start
 if(gameState === START){

    //WELCOME TEXT

    fill("white");
    textSize(50);
    text("WELCOME",170,50);
    textSize(20);
    text("This game is called Keep Away Corona.",25,100);
    text("To win, avoid the virus to not lose a life.",25,150);
    text("Also, collect the gloves, masks, sanitizers",25,200);
    text("vaccines & wash your hands!",25,225);   
    text("Get a score higher than 15 to win!",25,275);
    text("You have 3 lives, if all lives are lost - You lose.",25,325);
    text("Press enter to begin playing! Good Luck!",25,375);

    //game starting image
    gameImage.visible = true;

    //hiding the track and background
    runningTrack.visible = false;
    runningTrack.velocityX = 0;

    //hiding the player boy
    runnerBoy.visible = false;

    //if enter is pressed, game state is switched to play
    if(keyDown("enter")){
      gameState = PLAY;
    }

  } else
  if (gameState === PLAY) {

    //showed the score and lives variable
    textSize(15);
    fill(0);
    text("Score: "+score,450,30);
    text("Lives: "+lives,30,30);

    //creating edges and invisible ground
    edges = createEdgeSprites();
    runnerBoy.collide(edges);
    runnerBoy.collide(invisibleGround);

    //running track/background is now visible
    runningTrack.visible = true;
    runningTrack.velocityX = -5;

    //runner boy is now visible
    runnerBoy.visible = true;
    
    //game image is hidden
    gameImage.visible = false;

    //resets the background
    if(runningTrack.x < displayWidth-600){
      runningTrack.x = displayWidth-500;
    }

    //makes runner boy able to jump
    if(keyWentDown("space") || touches.length > 0){
      runnerBoy.velocityY = -10;

      touches = [];
    }

    //makes the gravity force
    runnerBoy.velocityY = runnerBoy.velocityY + 0.5;

    //creates/spawns the obstacles and collectables
    createCovid();
    createGloves();
    createMask();
    createSanitizer();
    createVaccine();
    createWashHands();
    spawnBirds();

    //if runner boy is touching the obstacles and collectables
    if (covidG.isTouching(runnerBoy)) {
      //code to destroy covid group
      covidG.destroyEach();

      //score is decreasing
      score = score - 3;

      //losing a life 
      lives = lives - 1;

    } else if (glovesG.isTouching(runnerBoy)) {
      //code to destroy gloves group
      glovesG.destroyEach();
      
      //score is increasing
      score = score + 1;

    } else if (maskG.isTouching(runnerBoy)) {
      //code to destroy mask group
      maskG.destroyEach();

      //score is increasing
      score = score + 3;

    } else if (sanitizerG.isTouching(runnerBoy)) {
      //code to destroy sanitizer group
      sanitizerG.destroyEach();

      //score is increasing
      score = score + 2;

    } else if (vaccineG.isTouching(runnerBoy)) {
      //code to destroy vaccine group
      vaccineG.destroyEach();

      //score is increasing
      score = score + 5;

    } else if (washHandsG.isTouching(runnerBoy)) {
      //code to destroy wash hands group
      washHandsG.destroyEach();

      //score is increasing
      score = score + 4;

    }

    //code that switches game state play to game state end
    if (score >= 15 || lives < 1) {
      gameState = END;
    }
  } else if (gameState===END){

    //changing game image animation to game over text animation
    gameImage.addAnimation("game", endImg);
    gameImage.scale = gameImage.scale + 0.01;
    gameImage.x=width/2;
    gameImage.y=height/2;

    //setting the game image as visible
    gameImage.visible = true;

    //bird is invisible
    bird.destroy();

    //stopping the game over animation from growing and growing
    if(gameImage.scale >= 0.9) {
      gameImage.scale = 0.9;
    }

    // if score is greater than 15, you win image & lives,score is shown
    if (score >= 15) {
      runnerBoy.addAnimation("runner", youWinImg);
      runnerBoy.x =300;
      runnerBoy.y = 65;
      runnerBoy.scale = 0.15;

      //bird is invisible
      bird.destroy();

      //showing score
      textSize(30);
      fill("black");
      text("Lives Remaining: "+lives,50,350);
      text("Score: "+score,350,350);

      // press r to play again
      text("Press r to play again",150,380);
    }

    // if lives is less than 1, you lose image & score,lives is shown
    if(lives < 1) {
      runnerBoy.addAnimation("runner", youLoseImg);
      runnerBoy.x = 300;
      runnerBoy.y = 60;

      //bird is invisible
      bird.destroy();

      //showing score
      textSize(30);
      fill("black");
      text("Lives Remaining: "+lives,50,350);
      text("Score: "+score,350,350);

      // press r to play again
      text("Press r to play again",150,380);
    }

    //stopping the running track from moving on and on
    runningTrack.velocityX = 0;

    //destroying covid group
    covidG.destroyEach();
    covidG.setVelocityYEach(0);
   
    //destorying gloves group
    glovesG.destroyEach();
    glovesG.setVelocityYEach(0);

    //destorying mask group
    maskG.destroyEach();
    maskG.setVelocityYEach(0);

    //destorying sanitizer group
    sanitizerG.destroyEach();
    sanitizerG.setVelocityYEach(0);

    //destorying vaccine group
    vaccineG.destroyEach();
    vaccineG.setVelocityYEach(0);

    //destorying wash hands group
    washHandsG.destroyEach();
    washHandsG.setVelocityYEach(0);
    
//if r is pressed, the infinite game is resetted
if (keyWentDown("r")) {
  //resetting score and lives remaining
  score=0;
  lives=3;

  //setting game state to start
  gameState=START;

  //game image is resetted
  gameImage.addImage("game", startImg);
  gameImage.scale = 0.3;
  gameImage.x = 500;
  gameImage.y = 200;

  //emptying array
  //touches = [ ];

  //changing animation of runner boy & resetting the runner boy
  runnerBoy.addImage("runner", runnerBoyImg);
  runnerBoy.scale = 0.35;
  runnerBoy.x = 200;
  runnerBoy.y = 270;
  runnerBoy.visible = true;
  
  //making the running track move
  runningTrack.velocityX = -5;

}

}

//drawSprites();

//side texts in game
var select_text = Math.round(random(1,3));

textSize(width/15);
fill(0);

if (World.frameCount % 100 == 0 && gameState == PLAY) { 
  switch(select_text){
    case 1: text("COLLECT THE PROTECTORS! ",10,100);
    break;
    case 2: text("AVOID THE VIRUS!",100,100);
    break;
    case 3: text("TO WIN, GET SCORE TO 15",50,100);
    break;
    default: break;
} 
}

 //drawSprites();
}

function createCovid() {

  // spawning covid images/sprites
    if (World.frameCount % 200 == 0) {
    var covid = createSprite(displayWidth-600,displayHeight-200);
    covid.y = Math.round(random(displayHeight-100, displayHeight-200));
    covid.scale = 0.05;
    covid.rotationSpeed = 3;
    covid.velocityX = -10;
    covid.lifetime = 80;
    covidG.add(covid);

    // selects if red or green covid image is shown
    var select_color = Math.round(random(1,2));

    switch(select_color){
      case 1: covid.addImage(covidImg1);
      break;
      case 2: covid.scale = 0.02;
      covid.addImage(covidImg2);
      break;
      default: break;
  }
    }
  }

  function createGloves() {

    // spawning gloves images/sprites
    if (World.frameCount % 320 == 0) {
    var gloves = createSprite(800,100);
    gloves.y = Math.round(random(displayHeight-100, displayHeight-150));
    gloves.addImage(glovesImg);
    gloves.scale = 0.1;
    gloves.rotationSpeed = -3;
    gloves.velocityX = -8;
    gloves.lifetime = 80;
    glovesG.add(gloves);
    }
  }

  function createMask() {

    // spawning mask images/sprites
    if (World.frameCount % 470 == 0) {
    var mask = createSprite(800,100);
    mask.y = Math.round(random(displayHeight-100, displayHeight-150));
    mask.addImage(maskImg);
    mask.scale = 0.1;
    mask.rotationSpeed = 3;
    mask.velocityX = -8;
    mask.lifetime = 80;
    maskG.add(mask);
    }
  }

  function createSanitizer() {

    // spawning sanitizer images/sprites
    if (World.frameCount % 600 == 0) {
    var sanitizer = createSprite(800,100);
    sanitizer.y = Math.round(random(displayHeight-100, displayHeight-200));
    sanitizer.addImage(sanitizerImg);
    sanitizer.scale = 0.08;
    sanitizer.rotationSpeed = 3;
    sanitizer.velocityX = -8;
    sanitizer.lifetime = 80;
    sanitizerG.add(sanitizer);
    }
  }

  function createVaccine() {

    // spawning vaccine images/sprites
    if (World.frameCount % 720 == 0) {
    var vaccine = createSprite(800,100);
    vaccine.y = Math.round(random(displayHeight-100, displayHeight-200));
    vaccine.addImage(vaccineImg);
    vaccine.scale = 0.08;
    vaccine.rotationSpeed = 3;
    vaccine.velocityX = -8;
    vaccine.lifetime = 80;
    vaccineG.add(vaccine);
    }
  }

  function createWashHands() {

    // spawning wash hands images/sprites
    if (World.frameCount % 850 == 0) {
    var washHands = createSprite(800,100);
    washHands.y = Math.round(random(displayHeight-100, displayHeight-150));
    washHands.addImage(washHandsImg);
    washHands.scale = 0.15;
    washHands.rotationSpeed = 3;
    washHands.velocityX = -8;
    washHands.lifetime = 80;
    washHandsG.add(washHands);
    }
  }

  function spawnBirds () {
   //spawning birds in the sky
   //creating a bird flying for the background
   if (World.frameCount % 200 == 0) {
    bird = createSprite(800,350);
    bird.addImage("bird", birdImg);
    bird.scale = 0.08;
    bird.velocityX = -5;
    bird.lifetime = 180;

   }
  }
  