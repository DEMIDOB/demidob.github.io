let a = 3;
let b = 2;

let mt = 0.1;

let pic;

let osc, fft;

function setup() {
  createCanvas(500, 500);
  colorMode(RGB);
  pic = createImage(width, height);

  osc_a = new p5.SinOsc(); // set frequency and type
  osc_b = new p5.SinOsc();

  fft = new p5.FFT();

  osc_a.amp(0.5);
  osc_b.amp(0.5);
}

function draw() {
  pic = createImage(width, height);
  background(255);

  drawFreq(a);
  drawFreq(b);

  image(pic, 0, 0);

  textSize(30);
  fill(255, 0, 0);
  text(a + "/" + b, 10, 40);

  // let waveform = fft.waveform(); // analyze the waveform
  // beginShape();
  // strokeWeight(5);
  // for (let i = 0; i < waveform.length; i++) {
  //   let x = map(i, 0, waveform.length, 0, width);
  //   let y = map(waveform[i], -1, 1, height, 0);
  //   vertex(x, y);
  // }
  // endShape();

  osc_a.freq(a * 200);
  osc_b.freq(b * 200);

  // let amp = map(mouseY, 0, height, 1, 0.01);
  // osc.amp(amp);
}

function drawFreq(base) {
  pic.loadPixels();

  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      let loc = int(x + y * width);

      let c = pic.pixels[loc * 4];
      let val = (255 * (cos(base * x * mt) + 1) / 2 + c) / 2;

      pic.pixels[loc * 4] = val;
      pic.pixels[loc * 4 + 1] = val;
      pic.pixels[loc * 4 + 2] = val;
      pic.pixels[loc * 4 + 3] = 255;
    }
  }

  pic.updatePixels();
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      a -= 0.5;
      break;
    case RIGHT_ARROW:
      a += 0.5;
      break;
    case UP_ARROW:
      b += 0.5;
      break;
    case DOWN_ARROW:
      b -= 0.5;
      break;
  }
}

// function mouseWheel(event) {
//   mt += event.delta * 0.0001; // Adjusting factor to match p5.js units
// }

function run() {
  a = 3;
  b = 2;

  osc_a.start();
  osc_b.start();
}