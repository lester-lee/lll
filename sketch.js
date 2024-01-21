// Portal
const portal = document.querySelector("#portal");
const loading = document.querySelector("#loading");
const choices = document.querySelectorAll("#portal button");
let choice;
choices.forEach((button) => {
  button.addEventListener("click", () => {
    const { choice: _choice } = button.dataset;
    choice = _choice;
    console.log(choice);

    // Go to next page
    portal.style.display = "none";
    loading.style.display = "block";
  });
});

// Start canvas & camera
const canvas = document.querySelector("#canvas");
const results = document.querySelector("#results");
const startButton = document.querySelector("#loading button");
let chosen;
startButton.addEventListener("click", () => {
  // Go to next page
  loading.style.display = "none";
  canvas.classList.remove("visually_hidden");

  // Randomly select resulting face
  chosen = Math.random() < 0.5 ? "angel" : "rat";
  results.textContent =
    (choice === chosen ? `you're so right...` : `sorry...`) +
    `\nit's ${chosen}s all around you!`;

  on = true;

  const constraints = {
    video: {
      facingMode: "environment",
    },
    audio: false,
  };
  video = createCapture(constraints);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, () => console.log("Model Loaded"));
  poseNet.on("pose", (results) => (poses = results));
});

// Canvas

let video;
let poseNet;
let poses = [];

const parts = {
  angel: {
    face: "😇",
    size: 70,
    mouth: "👄",
    offset: 15,
    hand: "🙏🏽",
  },
  rat: {
    face: "🐭",
    mouth: "👄",
    size: 50,
    offset: 50,
    hand: "💅🏽",
  },
};

let on = false;

let positions = {
  nose: { x: 0, y: 0 },
  leftHand: { x: 0, y: 0 },
  rightHand: { x: 0, y: 0 },
};

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas");
}

function draw() {
  if (!on) return;

  background("#c394fc");
  // image(video, 0, 0, width, height);
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
    text(parts[chosen].face, positions.nose.x, positions.nose.y);

    textSize(parts[chosen].size);
    text(
      parts[chosen].mouth,
      positions.nose.x,
      positions.nose.y + parts[chosen].offset
    );

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
      text(parts[chosen].hand, 0, 0);
      pop();
    };

    drawHand(positions.leftHand.x, positions.leftHand.y, true);
    drawHand(positions.rightHand.x, positions.rightHand.y);
  });
}
