/*
Facial Emotion Classifier
https://github.com/stc/face-tracking-p5js/008_emotion

(c) 2018 Agoston Nagy / gpl v3

*/

var TIMEOUT = 20;
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
var pipeBigPlayer;
var pipeSmallPlayer;

var emoSad;
var emoHappy;
var emoAngry;
var emoSuprised;

var emoSadBlank;
var emoHappyBlank;
var emoAngryBlank;
var emoSuprisedBlank;

var currentBg = 0;

var offsetBubbleAIx = 0;
var offsetBubbleAIy = 0;
var offsetBubblePersonX = 0;
var offsetBubblePersonY = 0;

var backgroundColor;

var digitalFont;
var humanFont;

var wordCountAI = 0;
var isAIDialogFinishedRendering = false;
var isHumanDialogFinishedRendering = false;
var currentText = "";

var humanText;
var aiText;

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadCamera();
  loadTracker();
  backgroundColor = color(128, 128, 128);

  background0 = loadImage('assets/main_bg_0.png');
  background1 = loadImage('assets/main_bg_1.png');
  background2 = loadImage('assets/main_bg_2.png');
  background3 = loadImage('assets/main_bg_3.png');
  background4 = loadImage('assets/main_bg_4.png');
  background5 = loadImage('assets/main_bg_5.png');
  background6 = loadImage('assets/main_bg_6.png');

  bubbleAI = loadImage('assets/ai_bubble.png');
  bubblePlayer = loadImage('assets/player_bubble.png');
  pipeBigPlayer = loadImage('assets/player_pipe_big.png');
  pipeSmallPlayer = loadImage('assets/player_pipe_small.png');

  emoSad = loadImage('assets/emoticons_sad.png');
  emoAngry = loadImage('assets/emoticons_angry.png');
  emoHappy = loadImage('assets/emoticons_happy.png');
  emoSuprised = loadImage('assets/emoticons_surprised.png');

  emoSadBlank = loadImage('assets/emoticons_sad_blank.png');
  emoAngryBlank = loadImage('assets/emoticons_angry_blank.png');
  emoHappyBlank = loadImage('assets/emoticons_happy_blank.png');
  emoSuprisedBlank = loadImage('assets/emoticons_surprised_blank.png');

  digitalFont = loadFont('assets/digital-7.regular.ttf');
  humanFont = loadFont('assets/bonita.regular.ttf');
  textFont(digitalFont);
}

const DELAY_CHANCE_TEXT = 0.95;


function delayedWriteText(fullText, xPos, yPos, xOffset, yOffset) {
  let aiSplit = split(fullText, " ");
  if (wordCountAI < aiSplit.length) {
    if (random(1) > DELAY_CHANCE_TEXT) {
      currentText = "";
      for (ix = 0; ix <= wordCountAI; ix++) {
        currentText += aiSplit[ix];
        currentText += " ";
      }
      wordCountAI++;
    }
    text(currentText, xPos + xOffset, yPos + yOffset);
  } else {
    currentText = "";
    wordCountAI = 0;
    return 1;
  }
}

function setAITextSTyle() {
  textFont(digitalFont);
  textSize(30);
  fill(0, 102, 153);
}

function setHumanTextStyle() {
  textFont(humanFont);
  textSize(24);
  fill(0);
}

function draw() {
  clear();
  if (frameCount % 5 == 0) {
    backgroundColor = color(red(backgroundColor)+ random(-1, 1),
        green(backgroundColor) + random(-1, 1),
        blue(backgroundColor) + random(-1, 1));
  }
  background(backgroundColor);
  calculateBackground();

  // load speech bubbles
  if (frameCount % 50 == 0) {
    offsetBubbleAIx = random(0, 5);
    offsetBubbleAIy = random(0, 5);
  }
  if (frameCount % 30 == 0) {
    offsetBubblePersonX = random(0, 2);
    offsetBubblePersonY = random(0, 2);
  }
  image(bubbleAI, 20 + offsetBubbleAIx, -120 + offsetBubbleAIy);
  image(pipeSmallPlayer, 400+offsetBubblePersonY, height - 300+offsetBubblePersonX);
  image(pipeBigPlayer, 1200+offsetBubblePersonX, height - 300+offsetBubblePersonY);
  image(bubblePlayer, 20, height - 400);

  if (currentScene == 0) {
    aiText = "Hello. I'll be your therapist today. \n" +
        "What would you like to discuss in this \n" +
        "session?";
    humanText = "I'm feeling a little lonely these days. \n\n\n" +
        "Some othe options?>?>";


    if (!isAIDialogFinishedRendering) {
      setAITextSTyle();
      isAIDialogFinishedRendering = delayedWriteText(aiText, 100, 140, offsetBubbleAIx, offsetBubbleAIy);
    } else {
      setAITextSTyle();
      text(aiText, 100 + offsetBubbleAIx, 140 + offsetBubbleAIy);

      setHumanTextStyle();
      if (!isHumanDialogFinishedRendering) {
        isHumanDialogFinishedRendering = delayedWriteText(humanText, 670, height - 270, 0, 0);
      } else {
        setHumanTextStyle();
        text(humanText, 670, height - 270);
        image(emoSuprisedBlank, 600, height - 300);
        image(emoAngryBlank, 610, height - 220);
      }
    }

    // if (!isAIDialogFinishedRendering) {
    //   textFont(digitalFont);
    //   textSize(30);
    //   let aiSplit = split(aiText, " ");
    //   if (wordCountAI < aiSplit.length) {
    //     if (random(1) > DELAY_CHANCE_TEXT) {
    //       currentText = "";
    //       for (ix = 0; ix <= wordCountAI; ix++) {
    //         currentText += aiSplit[ix];
    //         currentText += " ";
    //       }
    //       wordCountAI++;
    //     }
    //     text(currentText, 100 + offsetBubbleAIx, 140 + offsetBubbleAIy);
    //   } else {
    //     wordCountAI = 0;
    //     isAIDialogFinishedRendering = true;
    //   }
    // } else {
    //   textFont(digitalFont);
    //   textSize(30);
    //   text(aiText, 100 + offsetBubbleAIx, 140 + offsetBubbleAIy);
    //
    //   textFont(humanFont);
    //   textSize(24);
    //   fill(0);
    //   text(humanText1, 670, height - 270);
    //   image(emoSuprisedBlank, 600, height - 300);
    // }

  } else if (currentScene == 1) {
    //  fill(0, 102, 153);
    // textSize(40);
    // text("How long have you been feeling \na little lonely these days? ", 100, 140);
    //
    // textSize(30);
    // fill(123, 0, 55);
    // text("About a month.", 600, height - 250);
    // image(emoSuprisedBlank, 830, height - 300);
    let aiText = "aaaa aaaa aaaaaaaaaaa s\n" +
        "aaaaaa aaaaaaa aaaaa!!";
    let humanText1 = "just testing stuffz";
    let humanText2 = "I'm feeling a little lonely these days. \n\n\n" +
        "Some othe options?>?>";


    if (!isAIDialogFinishedRendering) {
      textFont(digitalFont);
      textSize(30);
      fill(0, 102, 153);
      isAIDialogFinishedRendering = delayedWriteText(aiText, 100, 140, offsetBubbleAIx, offsetBubbleAIy);

      // keep player options from previous interaction
      textFont(humanFont);
      textSize(24);
      fill(200, 0, 20, 70);
      noStroke();
      rect(640, height - 300, 500, 45);
      fill(0);
      text(humanText2, 670, height - 270);
      image(emoSuprisedBlank, 600, height - 300);
      image(emoAngryBlank, 610, height - 220);

    } else {
      textFont(digitalFont);
      textSize(30);
      fill(0, 102, 153);
      text(aiText, 100 + offsetBubbleAIx, 140 + offsetBubbleAIy);

      textFont(humanFont);
      textSize(24);
      fill(0);
      if (!isHumanDialogFinishedRendering) {
        isHumanDialogFinishedRendering = delayedWriteText(humanText1, 670, height - 270, 0, 0);
      } else {
        text(humanText1, 670, height - 270);
        image(emoSadBlank, 600, height - 300);
      }
    }

  }
  // else if (currentScene == 2) {
  //   fill(0, 102, 153);
  //   textSize(40);
  //   text("Tell me more... ", 100, 140);
  //
  //   textSize(30);
  //   fill(123, 0, 55);
  //   text("Okay", 600, height - 250);
  //   image(emoSuprisedBlank, 700, height - 300);
  //
  //   text("I am feeling lonely these days", 600, height - 200);
  //   image(emoSuprisedBlank, 1000, height - 250);
  //
  //   text("I'm a little anxious", 600, height - 150);
  //   image(emoSuprisedBlank, 850, height - 200);
  //
  //
  //   textSize(20);
  //   text("I have a fear about exams. When I take an exam,\n" +
  //       "I suddenly have a stomach ache. I could not manage myself \n" +
  //       "and my heart started beating very fast.", 600, height - 100);
  //   image(emoSuprisedBlank, 1100, height - 150);
  // }

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
        nextScene();
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
        nextScene();
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
  fill(0, 100);
  translate(20, -90);
  if (emotions) {
    // andry=0, sad=1, surprised=2, happy=3
    for (var i = 0; i < predictedEmotions.length; i++) {
      rect(i * 80 + 40, 300 - 50, 30, -predictedEmotions[i].value * 30);
    }
    if (isHumanDialogFinishedRendering && isAIDialogFinishedRendering) {
      decideScene();
    }
  }

  // text("ANGRY", 20, 300-40);
  // scale(0.2);
  image(emoAngry, 35, 260);
  // text("SAD", 130, 300-40);
  image(emoSad, 115, 260);
  // text("SURPRISED", 220, 300-40);
  image(emoSuprised, 185, 260);
  // text("HAPPY", 340, 300-40);
  image(emoHappy, 270, 260);
  pop();
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
  translate(30, -10);
  scale(0.80);
  // image(videoInput,0,0);
  // rect(0, 0, 100, 100);
  noStroke();

  fill(0);
  for (var i=0; i<positions.length -3; i++) {
      rect(positions[i][0], positions[i][1], 5, 5);
  }
  pop();
}


function calculateBackground() {
  if (frameCount % 30 == 0) {
    currentBg++;
    if (currentBg > 6) {
      currentBg = 0;
    }
  }
  push();
  translate(width/2-400, height/2 - 350);

  switch (currentBg) {
    case 0:
      image(background0, 0, 0);
      // background(background0);
      break;
    case 1:
      image(background1, 0, 0);
      // background(background1);
      break;
    case 2:
      image(background2, 0, 0);
      // background(background2);
      break;
    case 3:
      image(background3, 0, 0);
      // background(background3);
      break;
    case 4:
      image(background4, 0, 0);
      // background(background4);
      break;
    case 5:
      image(background5, 0, 0);
      // background(background5);
      break;
    case 6:
      image(background6, 0, 0);
      // background(background6);
      break;

  }
  pop();
}

function mousePressed() {
  nextScene();
}

function nextScene() {
  currentScene++;
  isAIDialogFinishedRendering = false;
  currentText = "";
  isHumanDialogFinishedRendering = false;
}