/*
Facial Emotion Classifier
https://github.com/stc/face-tracking-p5js/008_emotion

(c) 2018 Agoston Nagy / gpl v3

*/

var TIMEOUT = 40;
var timer = 0;
var currentScene = 0;

var background0;
var background1;
var background2;
var background3;
var background4;
var background5;
var background6;

var bubbleAI;
var bubblePlayer;

var emoSad;
var emoHappy;
var emoAngry;
var emoSuprised;

var emoSadBlank;
var emoHappyBlank;
var emoAngryBlank;
var emoSuprisedBlank;

var currentBg = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadCamera();
    loadTracker();

  background0 = loadImage('assets/main_bg_0.png');
  background1 = loadImage('assets/main_bg_1.png');
  background2 = loadImage('assets/main_bg_2.png');
  background3 = loadImage('assets/main_bg_3.png');
  background4 = loadImage('assets/main_bg_4.png');
  background5 = loadImage('assets/main_bg_5.png');
  background6 = loadImage('assets/main_bg_6.png');

  bubbleAI = loadImage('assets/ai_bubble.png');
  bubblePlayer = loadImage('assets/player_bubble.png');

  emoSad = loadImage('assets/emoticons_sad.png');
  emoAngry = loadImage('assets/emoticons_angry.png');
  emoHappy = loadImage('assets/emoticons_happy.png');
  emoSuprised = loadImage('assets/emoticons_surprised_blank.png');

  emoSadBlank = loadImage('assets/emoticons_sad_blank.png');
  emoAngryBlank = loadImage('assets/emoticons_angry_blank.png');
  emoHappyBlank = loadImage('assets/emoticons_happy_blank.png');
  emoSuprisedBlank = loadImage('assets/emoticons_surprised.png');
}

function calculateBackground() {
  if (frameCount % 30 == 0) {
    currentBg++;
    if (currentBg > 6) {
      currentBg = 0;
    }
  }
  switch (currentBg) {
    case 0:
      // image(background0, 0, 0);
      background(background0);
      break;
    case 1:
      // image(background1, 0, 0);
      background(background1);
      break;
    case 2:
      // image(background2, 0, 0);
      background(background2);
      break;
    case 3:
      // image(background3, 0, 0);
      background(background3);
      break;
    case 4:
      // image(background4, 0, 0);
      background(background4);
      break;
    case 5:
      // image(background5, 0, 0);
      background(background5);
      break;
    case 6:
      // image(background6, 0, 0);
      background(background6);
      break;

  }
}

function draw() {
  clear();
  calculateBackground();

  // load speech bubbles
  push();
  scale(0.8);
  image(bubbleAI, 20, 20);
  image(bubblePlayer, 20, height - 300);
  pop();

  if (currentScene == 0) {
    fill(0, 102, 153);
    textSize(40);
    text("Hello. I'll be your therapist today. \nWhat would you like to discuss in this \nsession?", 100, 140);

    textSize(30);
    fill(123, 0, 55);
    text("I'm feeling a little lonely these days. ", 600, height - 250);
    image(emoSuprisedBlank, 1100, height - 300);
  } else if (currentScene == 1) {
     fill(0, 102, 153);
    textSize(40);
    text("How long have you been feeling \na little lonely these days? ", 100, 140);

    textSize(30);
    fill(123, 0, 55);
    text("About a month.", 600, height - 250);
    image(emoSuprisedBlank, 830, height - 300);
  } else if (currentScene == 2) {
    fill(0, 102, 153);
    textSize(40);
    text("Tell me more... ", 100, 140);

    textSize(30);
    fill(123, 0, 55);
    text("Okay", 600, height - 250);
    image(emoSuprisedBlank, 700, height - 300);

    text("I am feeling lonely these days", 600, height - 200);
    image(emoSuprisedBlank, 1000, height - 250);

    text("I'm a little anxious", 600, height - 150);
    image(emoSuprisedBlank, 850, height - 200);


    textSize(20);
    text("I have a fear about exams. When I take an exam,\n" +
        "I suddenly have a stomach ache. I could not manage myself \n" +
        "and my heart started beating very fast.", 600, height - 100);
    image(emoSuprisedBlank, 1100, height - 150);
  }

  textSize(15);

  getPositions();
  getEmotions();

  push();
  translate(30, height - 300);
  drawPoints();
  drawEmotionBars();
  pop();
    
}


function decideScene() {
  if (currentScene == 0) {
    if (predictedEmotions[2] !== undefined
        && predictedEmotions[2].value > predictedEmotions[0].value
        && predictedEmotions[2].value > predictedEmotions[1].value
        && predictedEmotions[2].value > predictedEmotions[3].value) {
      updateTimer();
      if (timer == TIMEOUT) {
        currentScene = 1;
        // timer = 0;
      }
    } else {
      timer = 0;
    }
  }

  if (currentScene == 1) {
    if (predictedEmotions[1] !== undefined
        && predictedEmotions[1].value > predictedEmotions[0].value
        && predictedEmotions[1].value > predictedEmotions[2].value
        && predictedEmotions[1].value > predictedEmotions[3].value) {
      updateTimer();
      if (timer == TIMEOUT) {
        currentScene = 2;
        timer = 0;
      }
    } else {
      timer = 0;
    }
  }
}

function drawEmotionBars() {
  push();
  noStroke();
  fill(0);
  translate(30, -50);
  scale(0.95);
  if (emotions) {
    // andry=0, sad=1, surprised=2, happy=3
    for (var i = 0; i < predictedEmotions.length; i++) {
      rect(i * 110 + 20, 300 - 80, 30, -predictedEmotions[i].value * 30);
    }
    decideScene();
  }

  // text("ANGRY", 20, 300-40);
  scale(0.2);
  image(emoAngry, 70, height + 50);
  // text("SAD", 130, 300-40);
  image(emoSad, 600, height + 50);
  // text("SURPRISED", 220, 300-40);
  image(emoSuprised, 1150, height + 50);
  // text("HAPPY", 340, 300-40);
  image(emoHappy, 1700, height + 50);
}

function updateTimer() {
  if (timer < TIMEOUT) {
    timer++;
  } else {
    timer = 0;
  }
}

function drawPoints() {

  push();
  translate(50, -40);
  scale(0.85);
  // image(videoInput,0,0);
  // rect(0, 0, 100, 100);
  noStroke();

  fill(0);
  for (var i=0; i<positions.length -3; i++) {
      ellipse(positions[i][0], positions[i][1], 5, 5);
  }

  pop();
}

function mousePressed() {
  currentScene++;
}