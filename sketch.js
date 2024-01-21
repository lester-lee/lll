const canvas = document.querySelector("#canvas");

let video;
let poseNet;
let poses = [];

let face = "😔";
let mouth = "👄";
let hand = "💅🏽";

let positions = {
  nose: { x: 0, y: 0 },
  leftHand: { x: 0, y: 0 },
  rightHand: { x: 0, y: 0 },
};

function setup() {
  createCanvas(windowWidth, windowHeight, canvas);

  video = createCapture(VIDEO);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, () => console.log("Model Loaded"));
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", (results) => (poses = results));
}

function draw() {
  background("#c394fc");
  image(video, 0, 0);
  drawFace();
}

function drawFace() {
  const lerpFactor = 0.1;
  poses.forEach((pose) => {
    // Ignore low confidence keypoints
    if (pose.pose.score < 0.2) {
      return;
    }

    // Draw face
    const { x: noseX, y: noseY } = pose.pose.nose;
    positions.nose = {
      x: lerp(noseX, positions.nose.x, lerpFactor),
      y: lerp(noseY, positions.nose.y, lerpFactor),
    };

    textSize(150);
    textAlign(CENTER, CENTER);
    text(face, positions.nose.x, positions.nose.y);

    textSize(60);
    text(mouth, positions.nose.x, positions.nose.y + 30);

    // Draw hands
    const { x: leftHandX, y: leftHandY } = pose.pose.leftWrist;
    const { x: rightHandX, y: rightHandY } = pose.pose.rightWrist;

    positions.leftHand = {
      x: lerp(leftHandX, positions.leftHand.x, lerpFactor),
      y: lerp(leftHandY, positions.leftHand.y, lerpFactor),
    };

    positions.rightHand = {
      x: lerp(rightHandX, positions.rightHand.x, lerpFactor),
      y: lerp(rightHandY, positions.rightHand.y, lerpFactor),
    };

    textSize(60);
    const drawHand = (x, y, mirror = false) => {
      push();
      translate(x, y);
      if (mirror) {
        scale(-1, 1);
      }
      rotate(PI / 2);
      text(hand, 0, 0);
      pop();
    };

    drawHand(positions.leftHand.x, positions.leftHand.y, true);
    drawHand(positions.rightHand.x, positions.rightHand.y);
  });
}
