/*
Facial Emotion Classifier
https://github.com/stc/face-tracking-p5js/008_emotion

(c) 2018 Agoston Nagy / gpl v3

*/

var TIMEOUT = 100; 
var timer = 0;
var currentScene = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    loadCamera();
    loadTracker();
    bg = loadImage('assets/speech.jpg');
}
      
function draw() {
  clear();
  background(bg);
  if (currentScene == 0) {
    fill(0, 102, 153);
    textSize(40);
    text("The Bot: I am a conversational agent. \n I have the capability to talk with you.", 100, 340);
    text("User: .... O_o", 100, 470);
  } else if (currentScene == 1) {
     fill(0, 102, 153);
    textSize(40);
    text("The Bot: I am a conversational agent. \n I have the capability to talk with you.", 100, 340);
    text("User: Ok. What can we talk about? ", 100, 470);
    text("The Bot: Whatever you want.", 100, 540);
    text("User: .... :(", 100, 600);
  } else if (currentScene == 2) {
    fill(0, 102, 153);
    textSize(40);
    text("The Bot: I am a conversational agent. \n I have the capability to talk with you.", 100, 340);
    text("User: Ok. What can we talk about? ", 100, 470);
    text("The Bot: Whatever you want.", 100, 540);
    text("User: Hmm. I feel depressed. ", 100, 600);
  }
    textSize(15);

    getPositions();
    getEmotions();
    
    image(videoInput,0,0);
    // rect(0, 0, 100, 100);
    noStroke();
    fill(0,150);
    
    drawPoints();

    if (emotions) {
        // andry=0, sad=1, surprised=2, happy=3
        for (var i = 0;i < predictedEmotions.length;i++) {
            rect(i * 110+20, 300-80, 30, -predictedEmotions[i].value * 30);
        }
      if (currentScene == 0) {
        if (predictedEmotions[2] !== undefined 
           && predictedEmotions[2].value > predictedEmotions[0].value 
           && predictedEmotions[2].value > predictedEmotions[1].value
           && predictedEmotions[2].value > predictedEmotions[3].value) {
          print("detected suprise " + timer + " \n");
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
          print("detected sadness " + timer + " \n");
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
    
    text("ANGRY", 20, 300-40);
    text("SAD", 130, 300-40);
    text("SURPRISED", 220, 300-40);
    text("HAPPY", 340, 300-40);
  
  if (timer == TIMEOUT) {
    print("bang!");
  }
    
}

function updateTimer() {
  if (timer < TIMEOUT) {
    timer++;
  } else {
    timer = 0;
  }
}

function drawPoints() {
    fill(0);
    for (var i=0; i<positions.length -3; i++) {
        ellipse(positions[i][0], positions[i][1], 4, 4);
    }
}