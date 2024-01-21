let video;
const canvas = document.querySelector("#canvas");

function setup() {
  createCanvas(windowWidth, windowHeight, canvas);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);
}
