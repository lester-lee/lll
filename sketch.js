const canvas = document.querySelector("#canvas");

let video;
let poseNet;
let poses;

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

  drawSkeleton();
}

// A function to draw the skeletons
function drawSkeleton() {
  if (!poses) return;

  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
