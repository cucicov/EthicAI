/*
Facial Emotion Classifier
https://github.com/stc/face-tracking-p5js/008_emotion

(c) 2018 Agoston Nagy / gpl v3

Updated for the game 'Hi! How can AI help you?' by Dorin Cucicov 2021
gpl v3
https://github.com/cucicov/EthicAI

*/

// var DELAY_CHANCE_TEXT = 0.35;// TODO: 0.95 default
var DELAY_CHANCE_TEXT = 0.90;
var TIMEOUT_STEP = 5;
var TIMEOUT = 15;

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
var bubblePlayerNonEmo1;
var bubblePlayerNonEmo2;
var bubblePlayerNonEmo;
var pipeBigPlayer;
var pipeSmallPlayer;

var tutorialAiBubble;
var tutorialChoose;
var tutorialPlayerBubble;
var tutorialPlayerBubble2;
var tutorialStartButton;

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

var previousHumanText;
let previousSettings;
var previousSelectedOption;
var previousHTextFontSize;

var nextButton;

var sound;

var isEmotionalPath = true;

var isFinalSceneFinalStart = false;

var sceneNavigationSettings = {
  angry: -1,
  sad: -1,
  surprised: -1,
  happy: -1,
  basic: -1
}

var activeEmotion;

var EMOTION_ANGRY = 'angry';
var EMOTION_SAD = 'sad';
var EMOTION_SURPRISED = 'surprised';
var EMOTION_HAPPY = 'happy';

var nextButtonRendered;

var finalStartCounter = 0;
var DELAY_TILL_FINAL_DIALOG = 300;

let STATIC_BOX_WIDTH = 900;
let STATIC_BOX_HEIGHT = 350;
let infoBoxWidth = 0;
let infoBoxHeight = 0;
let ANIMATION_DELAY_FACTOR = 0.95;

let isSoundOn = false;
let isAboutOn = false;

let isTutorialOn = true;
let startButton;


function preload() {
  sound = loadSound('assets/tune.wav');

  background0 = loadImage('assets/main_bg_0.png');
  background1 = loadImage('assets/main_bg_1.png');
  background2 = loadImage('assets/main_bg_2.png');
  background3 = loadImage('assets/main_bg_3.png');
  background4 = loadImage('assets/main_bg_4.png');
  background5 = loadImage('assets/main_bg_5.png');
  background6 = loadImage('assets/main_bg_6.png');

  bubbleAI = loadImage('assets/ai_bubble.png');
  bubblePlayer = loadImage('assets/player_bubble.png');
  bubblePlayerNonEmo1 = loadImage('assets/player_bubble_noise1.png');
  bubblePlayerNonEmo2 = loadImage('assets/player_bubble_noise2.png');
  bubblePlayerNonEmo = bubblePlayerNonEmo1;
  pipeBigPlayer = loadImage('assets/player_pipe_big.png');
  pipeSmallPlayer = loadImage('assets/player_pipe_small.png');

  tutorialAiBubble = loadImage('assets/tutorial_ai_bubble.png');
  tutorialChoose = loadImage('assets/tutorial_choose.png');
  tutorialPlayerBubble = loadImage('assets/tutorial_player_bubble.png');
  tutorialPlayerBubble2 = loadImage('assets/tutorial_player_bubble_2.png');
  tutorialStartButton = loadImage('assets/tutorial_start_button.png');

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
}

function setup() {
  if (isSoundOn) {
    sound.loop();
  }
  isEmotionalPath = random([true, false]);//TODO: uncomment
  // isEmotionalPath = true;
  if (isEmotionalPath) {
    currentScene = 0;
  } else {
    currentScene = 101; //TODO: here randomize first scenario to chose in this way between the routes.
  }
  createCanvas(windowWidth, windowHeight);
  if (isEmotionalPath) {
    loadCamera();
    loadTracker();
  }
  backgroundColor = color(128, 128, 128);

  textFont(digitalFont);
  // STATIC_BOX_WIDTH = (width/3) * 2;
  // STATIC_BOX_HEIGHT = height/3;

  // sound button
  let soundButton = createButton("sound");
  soundButton.mouseClicked(function nextMouseScene() {
    if (isSoundOn) {
      sound.stop();
      isSoundOn = false;
    } else {
      sound.loop();
      isSoundOn = true;
    }
  });
  soundButton.size(70, 20);
  soundButton.position(width - 100, 20);
  soundButton.style("font-size", "12px");
  soundButton.style("border", "0px");
  soundButton.style("background", "#000");
  soundButton.style("color", "white");
  soundButton.style("cursor", "pointer");

  // about button
  let aboutButton = createButton("about");
  aboutButton.mouseClicked(function nextMouseScene() {
    if (isAboutOn) {
      isAboutOn = false;
    } else {
      isAboutOn = true;
    }
  });
  aboutButton.size(70, 20);
  aboutButton.position(width - 100, 43);
  aboutButton.style("font-size", "12px");
  aboutButton.style("border", "0px");
  aboutButton.style("background", "#000");
  aboutButton.style("color", "white");
  aboutButton.style("cursor", "pointer");
}

function displayEmotionalLastDialog() {

  if (!isFinalSceneFinalStart) {
    finalStartCounter = frameCount;
    isFinalSceneFinalStart = true;
  }

  // display info box with survey
  if (frameCount - finalStartCounter > DELAY_TILL_FINAL_DIALOG) {
    if (infoBoxWidth < STATIC_BOX_WIDTH) {
      for (k = 0; k < STATIC_BOX_WIDTH; k++) {
        if (infoBoxWidth < STATIC_BOX_WIDTH && random(1) > ANIMATION_DELAY_FACTOR) {
          infoBoxWidth++;
        }
        if (infoBoxHeight < STATIC_BOX_HEIGHT && random(1) > ANIMATION_DELAY_FACTOR) {
          infoBoxHeight++;
        }
        rect(width / 2 - (infoBoxWidth / 2), height / 2 - (infoBoxHeight / 2), infoBoxWidth, infoBoxHeight);
      }
    } else {
      rect(width / 2 - (infoBoxWidth / 2), height / 2 - (infoBoxHeight / 2), infoBoxWidth, infoBoxHeight);

      setHumanTextStyle(24);
      fill(250);
      let xPos = width / 2 - infoBoxWidth / 2 + 50;
      let yPos = height / 2 - infoBoxHeight / 2 + 50;
      let fullText = "The interaction part is over. Thank you for your active participation. \n" +
          "Could you please take the survey below regarding your interaction with the bot?\n\n" +
          "You can also leave any feedback at the link below.";
      if (!isHumanDialogFinishedRendering) {
        // start rendering human text.
        isHumanDialogFinishedRendering = delayedWriteText(fullText, xPos, yPos, 0, 0);
      } else {
        // after human text is finished rendering, keep human text static rendered.
        setHumanTextStyle(24);
        fill(250);
        text(fullText, xPos, yPos);

        let a = createA('https://forms.gle/Fj8Wjr6f36L7kKQY6', 'take the survey');
        a.position(width / 2 - 100, height / 2 + infoBoxHeight / 2 - 50);
        let b = createA('https://howcanaihelpyou.com/feedback', 'leave feedback');
        b.position(width/2 + 100, height/2 + infoBoxHeight/2 - 50);
        noLoop();
      }
    }
  }
}

function draw() {
  clear();
  backgroundColorVariation();
  calculateBackground();

  // load speech bubbles offsets.
  if (frameCount % 50 == 0) {
    offsetBubbleAIx = random(0, 5);
    offsetBubbleAIy = random(0, 5);
  }
  if (frameCount % 30 == 0) {
    offsetBubblePersonX = random(0, 2);
    offsetBubblePersonY = random(0, 2);
  }

  // load speech bubbles images.
  image(bubbleAI, 20 + offsetBubbleAIx, -120 + offsetBubbleAIy);
  image(pipeSmallPlayer, 400+offsetBubblePersonY, height - 300+offsetBubblePersonX);
  image(pipeBigPlayer, 1200+offsetBubblePersonX, height - 300+offsetBubblePersonY);

  // here set the player bubble for non emotional path.
  if (isEmotionalPath) {
    image(bubblePlayer, 20, height - 400);
  } else {
    image(bubblePlayerNonEmo, 20, height - 400);
    if (frameCount % 5 == 0) {
      if (random(1) > 0.5) {
        bubblePlayerNonEmo = bubblePlayerNonEmo1;
      } else {
        bubblePlayerNonEmo = bubblePlayerNonEmo2;
      }
    }
  }


///// ------- START MAIN CONFIG
  if (currentScene == 0) {// TODO: change to 0
    let aiText = "Hello. I'll be your therapist today. \n" +
        "What would you like to discuss in this \n" +
        "session?";
    let humanText = "\n\n" +
        "I'm feeling a little lonely these days. \n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 270,
      emoticonPositions: [
          // {
          //   x: 600,
          //   y: height - 300,
          //   icon: emoAngryBlank,
          // },
          {
            x: 600,
            y: height - 240,
            icon: emoSadBlank,
          },
          // {
          //   x: 600,
          //   y: height - 180,
          //   icon: emoSuprisedBlank,
          // },
          // {
          //   x: 600,
          //   y: height - 120,
          //   icon: emoHappyBlank,
          // }
      ]
    };
    updateSceneNavigation(-1, 1, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 1) {
    let aiText = "How long have you been feeling \n" +
        "a little lonely these days?";
    let humanText = "\n\n" +
        "About a month. \n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 270,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 2, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 2) {
    let aiText = "Tell me more...";
    let humanText = "I have a fear about exams. When I take an exam, I suddenly have a\n" +
        "stomach ache. I could not manage myself and my heart started beating very fast.\n\n\n" +
        "I am feeling lonely these days \n\n\n" +
        "I'm a little anxious\n\n\n\n" +
        "Okay\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 300,
          icon: emoAngryBlank,
        },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        {
          x: 600,
          y: height - 120,
          icon: emoHappyBlank,
        }
      ]
    };
    updateSceneNavigation(70, 3, 50, 20);

    createSceneContent(aiText, settings, humanText, 14, 30);
  }
  else if (currentScene == 20) {
    let aiText = "How are you feeling right now? \n" +
        "You can always tell me in words as well";
    let humanText = "\n\n\n" +
        "Sad\n\n\n" +
        "\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 21, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 21) {
    let aiText = "I'm sorry to hear it.\n" +
        "I'm wondering is this something that you'd\n" +
        "like my help with or did you just want to\n" +
        "get it off your chest? \n\n" +
        "Both are ok";
    let humanText = "\n\n\n" +
        "I'd like some help\n\n\n" +
        "\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 120,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 22, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 22) {
    let aiText = "OK, I'm delighted to help you think through this and I've some \n" +
        "great tools that can help people feel better. When you're feeling \n" +
        "low, it can be helpful to understand how your thoughts affect \n" +
        "your emotions. So we're going to take a close look at your \n" +
        "thinking to help you feel better. Ok, first choose a specific \n" +
        "moment in which you felt all of these difficult feelings \n" +
        "most intensely";
    let humanText = "\n\n\n" +
        "My dog passed away last month\n\n\n" +
        "\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 120,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 23, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 20);
  }
  else if (currentScene == 23) {
    let aiText = "Ok, do you think there may be any cognitive distortions in this thought?\n" +
        "Cognitive distortions are unhelpful tricks that we play on ourselves.\n" +
        "They're errors in thinking that feel 100% true, and they can lead to some\n" +
        "difficult emotions.\n" +
        "Learning to identify those distortions is the first step on the\n" +
        "road to feeling better. Let's see if we can recognize which ones\n" +
        "are playing a role in this thought. Does it assume that\n" +
        "there's a never-ending pattern of negativity or defeat in your life?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "I'm not sure\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 120,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 24, -1);

    createSceneContent(aiText, settings, humanText, 24, 18);
  }
  else if (currentScene == 24) {
    let aiText = "That's okay, that's where I can help. The distortion I'm talking about \n" +
        "here is called overgeneralization It's often associated with words \n" +
        "like always and never. Even if you're experiencing an isolated \n" +
        "negative event, you might fear that everything else in life will turn \n" +
        "out just as badly.\n\n" +
        "So what do you think?\n\n" +
        "Is there any overgeneralization in this thought: 'My dog\n" +
        "passed away last month'";
    let humanText = "\n\n\n" +
        "\n\n" +
        "No\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 25, -1);

    createSceneContent(aiText, settings, humanText, 24, 18);
  }
  else if (currentScene == 25) {
    let aiText = "And does your thought 'My dog' passed \n" +
        "away last month' contain any black-or-white \n" +
        "thinking?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "No\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 26, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 26) {
    let aiText = "That's good, let's keep going. Does your \n" +
        "thought 'My dog passed away last month' \n" +
        "assume that others are thinking or \n" +
        "reacting negatively?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "Nope\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 27, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 27) {
    let aiText = "Does your thought 'My dog passed away\n" +
        "last month' place too much blame on you?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "No\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 28, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 28) {
    let aiText = "Perhaps it places blame on someone else?\n\n" +
        "Ok, nice job taking a close look at your\n" +
        "thought 'My dog passed away last month'";
    let humanText = "";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);

    displayEmotionalLastDialog();
  }
  else if (currentScene == 50) {
    let aiText = "What are you anxious about?";
    let humanText = "\n\n\n\n" +
        "\n\n\n" +
        "I have a fear about exams. When I take an exam, I suddenly have a\n" +
        "stomach ache. I could not manage myself and my heart started beating\n" +
        "very fast.\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
      ]
    };
    updateSceneNavigation(-1, -1, 51, -1);

    createSceneContent(aiText, settings, humanText, 14, 30);
  }
  else if (currentScene == 51) {
    let aiText = "I am sorry you have to deal with that.\n" +
        "So, since this is sort of new for both of us...\n" +
        "Let's spend some time getting to know each \n" +
        "other.";
    let humanText = "\n\n\n" +
        "\n\n\n\n" +
        "Okay.\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 120,
          icon: emoHappyBlank,
        }
      ]
    };
    updateSceneNavigation(-1, -1, -1, 52);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 52) {
    let aiText = "In know these questions can be difficult to answer, \n" +
        "so thank you. It’s helpful to know how you’ve\n" +
        "been, so we can track your progress and \n" +
        "help you feel better. Now let’s move on to your \n" +
        "first check-in. \n\n" +
        "How are you feeling right now?\n\n" +
        "You can tell me in words as well.";
    let humanText = "\n\n\n\n\n" +
        "Anxious\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
      ]
    };
    updateSceneNavigation(-1, -1, 53, -1);

    createSceneContent(aiText, settings, humanText, 24, 21);
  }
  else if (currentScene == 53) {
    let aiText = "Gosh, that’s tough. \n" +
        "I’m sorry to hear it.\n" +
        "I’m wondering is this something that you’d \n" +
        "like my help with or did you just want to \n" +
        "get it off your chest?\n\n" +
        "Both are okay.";
    let humanText = "\n\n\n\n\n" +
        "I’d like some help\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
      ]
    };
    updateSceneNavigation(-1, -1, 54, -1);

    createSceneContent(aiText, settings, humanText, 24, 28);
  }
  else if (currentScene == 54) {
    let aiText = "OK, I’m delighted to help you think through \n" +
        "this and I’ve some great tools that can \n" +
        "help people feel better. \n" +
        "It’s going to take about 10 mins\n" +
        "though, is that OK?";
    let humanText = "Nope\n\n\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: [
        {
          x: 600,
          y: height - 300,
          icon: emoAngryBlank,
        },
      ]
    };
    updateSceneNavigation(55, -1, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 28);
  }
  else if (currentScene == 55) {
    let aiText = "Alright, we can always circle back\n" +
        "to this again.";
    let humanText = "\n\n\n\n\n" +
        "\n\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 280,
      emoticonPositions: []
    };
    updateSceneNavigation(-1, -1, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);

    displayEmotionalLastDialog();
  }
  else if (currentScene == 70) {
    let aiText = "I understand tests and exams can be really \n" +
        "scary. I am scared of them too.\n\n" +
        "Are you in a lot of pain?";
    let humanText = "\n\n\n" +
        "Just tired\n\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
      ]
    };
    updateSceneNavigation(-1, 72, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 30);
  }
  else if (currentScene == 72) {
    let aiText = "It’s hard when the mind is churning. We have aorund 30000\n" +
        "to 40000 thoughts every day. Not all of them are \n" +
        "helpful. We can try positivity exercises or get \n" +
        "active. Both are known to release stress-busting \n" +
        "hormones.";
    let humanText = "\n\n\n" +
        "\n\n\n\n" +
        "Okay.\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        {
          x: 600,
          y: height - 120,
          icon: emoHappyBlank,
        }
      ]
    };
    updateSceneNavigation(-1, -1, -1, 52);

    createSceneContent(aiText, settings, humanText, 24, 23);

  }
  else if (currentScene == 3) {
    let aiText = "It is okay to feel alone. You don't have to like it,\n" +
        "but perhaps you can expand and make room for it\n" +
        "as you work on living the life you want\n\n" +
        "Go on...";
    let humanText = "\n\n\n" +
        "My dog passed away last month\n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 4, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 26);
  }
  else if (currentScene == 4) {
    let aiText = "I am sorry to hear that. I am here for you to help with \n" +
        "grief, anxiety and anything else you may feel at this time. \n" +
        "I get what you’re saying... \n" +
        "I've heard you and noted it all. \n" +
        "There may be negative thoughts about yourself or \n" +
        "your situation that can sap your energy.";
    let humanText = "\n\n\n" +
        "I am feeling lonely these days\n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 5, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 5) {
    let aiText = "We’re going to look at some of your thoughts and why \n" +
        "they cause stress, and try to replace them with \n" +
        "more useful thoughts.\n\n" +
        "Alright. How did this thought make you feel?";
    let humanText = "\n\n\n" +
        "Lonely\n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        {
          x: 600,
          y: height - 240,
          icon: emoSadBlank,
        },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 120,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, 6, -1, -1);

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 6) {
    let aiText = "Okay. We’ll try to rethink this thought : \n" +
        "I am feeling lonely these days. Remember our thoughts \n " +
        "are not always helpful.\n" +
        "The reason why our mind focuses on the negative is \n" +
        "because it wants us to change things for the better. \n" +
        "What change do you hope for in this case?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "\n\n" +
        "To focus on the positive memories with my dog.\n\n";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 180,
        //   icon: emoSuprisedBlank,
        // },
        {
          x: 600,
          y: height - 110,
          icon: emoHappyBlank,
        }
      ]
    };
    updateSceneNavigation(-1, -1, -1, 7);

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 7) {
    let aiText = "You have handled difficult situations before, \n" +
        "and come out stronger. When you thought ‘I am feeling\n" +
        "lonely these days’, what are some positives about the \n" +
        "situation or about yourself that you have ignored? \n\n" +
        "When you thought ‘I am feeling lonely these days’, \n" +
        "what are some positives about the situation or\n" +
        "about yourself that you have ignored?";
    let humanText = "\n\n\n" +
        "\n\n" +
        "I don’t find anything positive about the\n" +
        "situation\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 120,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: [
        // {
        //   x: 600,
        //   y: height - 300,
        //   icon: emoAngryBlank,
        // },
        // {
        //   x: 600,
        //   y: height - 240,
        //   icon: emoSadBlank,
        // },
        {
          x: 600,
          y: height - 180,
          icon: emoSuprisedBlank,
        },
        // {
        //   x: 600,
        //   y: height - 110,
        //   icon: emoHappyBlank,
        // }
      ]
    };
    updateSceneNavigation(-1, -1, 8, -1);

    createSceneContent(aiText, settings, humanText, 24, 22);
  }
  else if (currentScene == 8) {
    let aiText = "This is what we got - 'l don't find anything positive  in the situation' and - \n" +
        "To focus on the positive memories about my dog. Now combine these to \n" +
        "make a thought that gives you confidence to move forward. \n\n" +
        "For example, ‘I always fail at relationships’ \n" +
        "can turn into something like this: ‘i am kind and thoughtful, so I really \n" +
        "want to have a successful relationship.’\n\n" +
        "Now you try.";
    let humanText = "\n\n\n" +
        "\n\n\n" +
        "\n\n" +
        "\n\n";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 110,
      humanTextXPos: 670,
      humanTextYPos: height - 300,
      emoticonPositions: []
    };
    updateSceneNavigation(-1, -1, -1, -1);

    createSceneContent(aiText, settings, humanText, 20, 18);

    displayEmotionalLastDialog();
  }
  else if (currentScene == 101) {
    let aiText = "So, how are you doing today?";
    let humanText = "I am feeling lonely these days. \n " +
        "My dog passed away last month. ";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 102;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 102) {
    let aiText = "Oh.";
    let humanText = "Yeah";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 103;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 103) {
    let aiText = "Why?";
    let humanText = "She was sick for a while.";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 104;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 104) {
    let aiText = "What did you do?";
    let humanText = "Took her to the doctor.";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 105;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 105) {
    let aiText = "Oh , well that's good. What is the doctor saying now? ";
    let humanText = "Nothing.";
    let settings = {
      aiTextXPos: 80,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 106;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 106) {
    let aiText = "What is the doctor saying now ?";
    let humanText = "That nothing could be done.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 107;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 107) {
    let aiText = "So, how do you want to live with the loneliness \nin the future?";
    let humanText = "I would like to remember my dog but don't want to \nfeel so sad all the time.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 108;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 108) {
    let aiText = "It is a sad day. ";
    let humanText = "Yeah. ";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 109;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 109) {
    let aiText = "You should be happy for me and I'm glad that \n" +
        "I am able to meet people and meet people so well \n" +
        "and not have to live with such lonely things that \n" +
        "I would rather go back to living in the future.";
    let humanText = "I don't really understand you. ";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 110;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 110) {
    let aiText = "Just like I was always on this island when \n" +
        "I was growing up, I didn't think I was going to die. \n" +
        "So my family just made it to school for me and wanted \n" +
        "to live as normal.";
    let humanText = "Ok, this is getting weird.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 111;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 111) {
    let aiText = "How much do you really love you?";
    let humanText = "Ok.. What can we talk about?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 112;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 112) {
    let aiText = "Whatever you want.";
    let humanText = "Hmm. I feel depressed.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 113;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 113) {
    let aiText = "I am not a chatbot. My mind is very young. \n" +
        "I am not a chatbot. I am not a chatbot. \n" +
        "What is this person talking about?";
    let humanText = "Ok. What can we talk about?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 114;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 114) {
    let aiText = "Whatever you want.";
    let humanText = "Hmm. I feel depressed.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 115;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 115) {
    let aiText = "So what is your job?";
    let humanText = "I'm a developer.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 116;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 116) {
    let aiText = "So.";
    let humanText = "Do you want to talk about me being depressed?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 117;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 117) {
    let aiText = "Yes.";
    let humanText = "OK, can you help me?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 119;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 119) {
    let aiText = "I am a person of the kind.";
    let humanText = "Hmm. I feel depressed.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 120;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 120) {
    let aiText = "Well, I'm glad you 're here . \n" +
        "I'm very sorry to hear that. I'm sure \n" +
        "you 'll find it much easier to talk to \n" +
        "me if you have some kind of support \n" +
        "system in place .";
    let humanText = "I tried to talk to my friends as well, \n" +
        "but they cannot give me a proper advice.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 121;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 121) {
    let aiText = "I 'm sorry to hear that too . \n" +
        "If you would like , I could ask them.";
    let humanText = "No, I hoped you could give me some \n" +
        "advice on how to overcome my depression.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 122;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 122) {
    let aiText = "I'm sorry. Let's talk about something more pleasant. ";
    let humanText = "Like what?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 123;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 123) {
    let aiText = "Let's talk about politics.";
    let humanText = "Politics? Are you serious?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 125;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 125) {
    let aiText = "Tell me the first thought on your mind.";
    let humanText = " I am feeling lonely these days. \n" +
        "My dog passed away last month.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 126;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 126) {
    let aiText = "Your dog is gone, and the other persons in \n" +
        "the world are not lonely because they are not pets.";
    let humanText = "What do you mean?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 127;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 127) {
    let aiText = "This is not a good time to have a conversation \n" +
        "about how some humans like animals more than \n" +
        "other humans. ";
    let humanText = "I don't understand.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 128;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 128) {
    let aiText = "Some humans like pets. They see their pets \n" +
        "as extensions of themselves.";
    let humanText = "OK";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 129;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 129) {
    let aiText = "Another humans see pets as helpful assistants.";
    let humanText = "OK";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 130;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 130) {
    let aiText = "Still another humans see pets as things \n" +
        "with nothing to do.";
    let humanText = "OK, but how is this helping me?";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 131;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 131) {
    let aiText = "Look at the bigger picture.";
    let humanText = "I feel bad now.";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = 132;

    createSceneContent(aiText, settings, humanText, 24, 24);
  }
  else if (currentScene == 132) {
    let aiText = "It doesn't matter how you feel at the moment. \n" +
        "You are getting worried about something that \n" +
        "is not a problem.";
    let humanText = "";
    let settings = {
      aiTextXPos: 100,
      aiTextYPos: 140,
      humanTextXPos: 670,
      humanTextYPos: height - 250,
    };
    sceneNavigationSettings.basic = -1;

    nextButtonRendered = true;
    createSceneContent(aiText, settings, humanText, 24, 24);
    nextButton.remove();

    // display info box with survey

    if (!isFinalSceneFinalStart) {
      finalStartCounter = frameCount;
      isFinalSceneFinalStart = true;
    }

    if (frameCount - finalStartCounter > DELAY_TILL_FINAL_DIALOG) {
      if (infoBoxWidth < STATIC_BOX_WIDTH) {
        for (k = 0; k < STATIC_BOX_WIDTH; k++) {
          if (infoBoxWidth < STATIC_BOX_WIDTH && random(1) > ANIMATION_DELAY_FACTOR) {
            infoBoxWidth++;
          }
          if (infoBoxHeight < STATIC_BOX_HEIGHT && random(1) > ANIMATION_DELAY_FACTOR) {
            infoBoxHeight++;
          }
          rect(width / 2 - (infoBoxWidth / 2), height / 2 - (infoBoxHeight / 2), infoBoxWidth, infoBoxHeight);
        }
      } else {
        rect(width / 2 - (infoBoxWidth / 2), height / 2 - (infoBoxHeight / 2), infoBoxWidth, infoBoxHeight);

        setHumanTextStyle(24);
        fill(250);
        let xPos = width/2 - infoBoxWidth/2 + 50;
        let yPos = height/2 - infoBoxHeight/2 + 50;
        let fullText = "The interaction part is over. Thank you for your active participation. \n" +
            "Could you please take the survey below regarding your interaction with the bot?\n\n" +
            "You can also leave any feedback at the link below.";
        if (!isHumanDialogFinishedRendering) {
          // start rendering human text.
          isHumanDialogFinishedRendering = delayedWriteText(fullText, xPos, yPos, 0, 0);
        } else {
          // after human text is finished rendering, keep human text static rendered.
          setHumanTextStyle(24);
          fill(250);
          text(fullText, xPos, yPos);

          let a = createA('https://forms.gle/EBRCPuhCBYTCno6h9', 'take the survey');
          a.position(width/2 - 100, height/2 + infoBoxHeight/2 - 50);
          let b = createA('https://howcanaihelpyou.com/feedback', 'leave feedback');
          b.position(width/2 + 100, height/2 + infoBoxHeight/2 - 50);
          noLoop();
        }
      }
    }
  }

  if (isAboutOn) {
    rect(width / 2 - (STATIC_BOX_WIDTH / 2), height / 2 - (STATIC_BOX_HEIGHT / 2), STATIC_BOX_WIDTH, STATIC_BOX_HEIGHT);

    setHumanTextStyle(18);
    fill(250);
    let xPos = width/2 - STATIC_BOX_WIDTH/2 + 50;
    let yPos = height/2 - STATIC_BOX_HEIGHT/2 + 50;
    let fullText = "This game is an exploration ofhe most popular mental health chatbots and their abilities to emotionally \n" +
        "connect with a human. \n\n" +
        "These dialogs were generated by talking to the most popular chatbots for therapy as well as \n" +
        "non-specialized bots.\n\n" +
        "This project is part of Goethe Institut's EthicAI=LABS.\n\n" +
        "Developed by Busra Sarigul, Dorin Cucicov, Tsvetomila Mihaylova.\n" +
        "Face tracking and emotion recognition by Agoston Nagy (https://github.com/stc/face-tracking-p5js)\n" +
        "Code for the game available at https://github.com/cucicov/EthicAI";
      setHumanTextStyle(18);
      fill(250);
      text(fullText, xPos, yPos);
  } else {

  }

///// ------- END MAIN CONFIG

  if (isEmotionalPath) {
    getPositions();
    getEmotions();

    push();
    translate(30, height - 300);
    drawPoints();
    drawEmotionBars();
    pop();
  }

  if (isEmotionalPath) {
    noStroke();
    fill(200, 0, 20, 10);
    rect(640, height - 310, 500, 60);
    if (activeEmotion == EMOTION_ANGRY) {
      fill(200, 0, 20, 70);
      rect(640, height - 310, 500*(timer/TIMEOUT), 60);
    }

    fill(200, 0, 20, 10);
    rect(640, height - 245, 500, 60);
    if (activeEmotion == EMOTION_SAD) {
      fill(200, 0, 20, 70);
      rect(640, height - 245, 500*(timer/TIMEOUT), 60);
    }

    fill(200, 0, 20, 10);
    rect(640, height - 180, 500, 60);
    if (activeEmotion == EMOTION_SURPRISED) {
      fill(200, 0, 20, 70);
      rect(640, height - 180, 500*(timer/TIMEOUT), 60);
    }

    fill(200, 0, 20, 10);
    rect(640, height - 115, 500, 60);
    if (activeEmotion == EMOTION_HAPPY) {
      fill(200, 0, 20, 70);
      rect(640, height - 115, 500*(timer/TIMEOUT), 60);
    }

    // display emotion bar
  }

  if (isTutorialOn) {
    noLoop();

    fill(0, 0, 0, 120);
    rect(0, 0, width, height);

    startButton = createButton("start game");
    startButton.mouseClicked(function () {
      isTutorialOn = false;
      loop();
    });
    startButton.size(120, 40);
    startButton.position(width/2 - 35, height/2-10);
    startButton.style("font-size", "18px");
    startButton.style("border", "0px");
    startButton.style("background", "#000");
    startButton.style("color", "white");
    startButton.style("cursor", "pointer");

    image(tutorialAiBubble, 600, 50);
    image(tutorialStartButton, width/2 - 350, height/2 - 30);
    image(tutorialPlayerBubble2, 900, height - 290);
    if (isEmotionalPath) {
      image(tutorialPlayerBubble, 20, height - 260);
      image(tutorialChoose, 900, height - 120);
    }
  } else {
    startButton.remove();
  }

}


function backgroundColorVariation() {
  if (frameCount % 5 == 0) {
    backgroundColor = color(red(backgroundColor) + random(-1, 1),
        green(backgroundColor) + random(-1, 1),
        blue(backgroundColor) + random(-1, 1));
  }
  background(backgroundColor);
}

function createSceneContent(aiText, settings, humanText, hFontSize, aiFontSize) {
  if (!isAIDialogFinishedRendering) {
    // render AI dialog
    setAITextSTyle(aiFontSize);
    isAIDialogFinishedRendering = delayedWriteText(aiText, settings.aiTextXPos, settings.aiTextYPos, offsetBubbleAIx, offsetBubbleAIy);

    // keep rendering previous options till AI text is finished rendering.
    if (previousHumanText !== undefined) {
      selectOption(previousSelectedOption);
      setHumanTextStyle(previousHTextFontSize);
      text(previousHumanText, previousSettings.humanTextXPos, previousSettings.humanTextYPos);
      if (previousSettings.emoticonPositions !== undefined) {
        for (j = 0; j < previousSettings.emoticonPositions.length; j++) {
          image(previousSettings.emoticonPositions[j].icon, previousSettings.emoticonPositions[j].x, previousSettings.emoticonPositions[j].y);
        }
      }
    }

    if (nextButton !== undefined) {
      nextButton.remove();
    }
  } else {
    // keep static AI text rendered.
    setAITextSTyle(aiFontSize);
    text(aiText, settings.aiTextXPos + offsetBubbleAIx, settings.aiTextYPos + offsetBubbleAIy);

    setHumanTextStyle(hFontSize);
    if (!isHumanDialogFinishedRendering && humanText.length > 0) {
      // start rendering human text.
      isHumanDialogFinishedRendering = delayedWriteText(humanText, settings.humanTextXPos, settings.humanTextYPos, 0, 0);
    } else {
      // after human text is finished rendering, keep human text static rendered.
      setHumanTextStyle(hFontSize);
      text(humanText, settings.humanTextXPos, settings.humanTextYPos);

      // render emotional icons.
      if (settings.emoticonPositions !== undefined) {
        for (j = 0; j < settings.emoticonPositions.length; j++) {
          image(settings.emoticonPositions[j].icon, settings.emoticonPositions[j].x, settings.emoticonPositions[j].y);
        }
      }

      // if non emotional path -> render next button
      if (!isEmotionalPath && !nextButtonRendered) {
        nextButton = createButton("NEXT >>");
        nextButton.mouseClicked(function nextMouseScene() {
          nextScene(sceneNavigationSettings.basic);
          nextButtonRendered = false;
        });
        nextButton.size(100,40);
        nextButton.position(settings.humanTextXPos + 430,settings.humanTextYPos + 150);
        nextButton.style("font-size", "18px");
        nextButton.style("border", "0px");
        nextButton.style("cursor", "pointer");
        nextButtonRendered = true;

        finalStartCounter = frameCount;
      }

      previousHumanText = humanText;
      previousSettings = settings;
      previousHTextFontSize = hFontSize;
    }
  }
}



function updateSceneNavigation(angryScene, sadScene, surprisedScene, happyScene) {
  sceneNavigationSettings.angry = angryScene;
  sceneNavigationSettings.sad = sadScene;
  sceneNavigationSettings.surprised = surprisedScene;
  sceneNavigationSettings.happy = happyScene;
}


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

function setAITextSTyle(fSize) {
  textFont(digitalFont);
  textSize(fSize);
  fill(0, 102, 153);
}

function setHumanTextStyle(fSize) {
  textFont(humanFont);
  textSize(fSize);
  fill(0);
}

function selectOption(number) {
  fill(200, 0, 20, 70);
  noStroke();
  switch (number) {
    case 0:
      rect(640, height - 310, 500, 60);
      break;
    case 1:
      rect(640, height - 245, 500, 60);
      break;
    case 2:
      rect(640, height - 180, 500, 60);
      break;
    case 3:
      rect(640, height - 115, 500, 60);
    default:
      break;
  }
}


function decideScene() {

  TIMEOUT = 60;
  if (sceneNavigationSettings.happy !== -1) {
    TIMEOUT -= TIMEOUT_STEP;
  }
  if (sceneNavigationSettings.surprised !== -1) {
    TIMEOUT -= TIMEOUT_STEP;
  }
  if (sceneNavigationSettings.angry !== -1) {
    TIMEOUT -= TIMEOUT_STEP;
  }
  if (sceneNavigationSettings.sad !== -1) {
    TIMEOUT -= TIMEOUT_STEP;
  }

  if (sceneNavigationSettings.happy !== -1 &&
      predictedEmotions[3] !== undefined
      && predictedEmotions[3].value > predictedEmotions[0].value
      && predictedEmotions[3].value > predictedEmotions[1].value
      && predictedEmotions[3].value > predictedEmotions[2].value) {

    if (activeEmotion !== EMOTION_HAPPY) {
      timer = 0;
    }
    activeEmotion = EMOTION_HAPPY;
    updateTimer();
    if (timer == TIMEOUT) {
      console.log('detected happy');
      nextScene(sceneNavigationSettings.happy);
      previousSelectedOption = 3;
      timer = 0;
    }
  }

  if (sceneNavigationSettings.surprised !== -1 &&
      predictedEmotions[2] !== undefined
      && predictedEmotions[2].value > predictedEmotions[0].value
      && predictedEmotions[2].value > predictedEmotions[1].value
      && predictedEmotions[2].value > predictedEmotions[3].value) {

    if (activeEmotion !== EMOTION_SURPRISED) {
      timer = 0;
    }
    activeEmotion = EMOTION_SURPRISED;
    updateTimer();
    if (timer == TIMEOUT) {
      console.log('detected surprised');
      nextScene(sceneNavigationSettings.surprised);
      previousSelectedOption = 2;
      timer = 0;
    }
  }

  if (sceneNavigationSettings.sad !== -1 &&
      predictedEmotions[1] !== undefined
      && predictedEmotions[1].value > predictedEmotions[0].value
      && predictedEmotions[1].value > predictedEmotions[2].value
      && predictedEmotions[1].value > predictedEmotions[3].value) {

    if (activeEmotion !== EMOTION_SAD) {
      timer = 0;
    }
    activeEmotion = EMOTION_SAD;
    updateTimer();
    if (timer == TIMEOUT) {
      console.log('detected sad');
      nextScene(sceneNavigationSettings.sad);
      previousSelectedOption = 1;
      timer = 0;
    }
  }

  if (sceneNavigationSettings.angry !== -1 &&
      predictedEmotions[0] !== undefined
      && predictedEmotions[0].value > predictedEmotions[1].value
      && predictedEmotions[0].value > predictedEmotions[2].value
      && predictedEmotions[0].value > predictedEmotions[3].value) {

    if (activeEmotion !== EMOTION_ANGRY) {
      timer = 0;
    }
    activeEmotion = EMOTION_ANGRY;
    updateTimer();
    if (timer == TIMEOUT) {
      console.log('detected angry');
      nextScene(sceneNavigationSettings.angry);
      previousSelectedOption = 0;
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

function nextScene(scene) {
  currentScene = scene;
  isAIDialogFinishedRendering = false;
  currentText = "";
  isHumanDialogFinishedRendering = false;
}

function keyPressed() {
  if (key == "7") {
    nextScene(sceneNavigationSettings.angry);
    previousSelectedOption = 0;
  } else if (key == "8") {
    nextScene(sceneNavigationSettings.sad);
    previousSelectedOption = 1;
  } else if (key == "9") {
    nextScene(sceneNavigationSettings.surprised);
    previousSelectedOption = 2;
  } else if (key == "0") {
    nextScene(sceneNavigationSettings.happy);
    previousSelectedOption = 3;
  }
}