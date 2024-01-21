const canvas = document.querySelector("#canvas");

let video;
let poseNet;
let poses = [];

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
  image(video, 0, 0);

  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
