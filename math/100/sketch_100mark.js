let points;
let scale = 100;
let radius = 20;

let selectedPoint = -1;

let pointsCount = 3;
let s = 2;
let evolutionSteps = 0;

let isEvolutionGoing = false;
let bestSum = Infinity;
let bestPoints;

let heatMap;

const heatMapScale = 10;

var ruleNormalizePoints = false;
var ruleAutoPlaceZero = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let url = new URL(window.location.href);
  let c = url.searchParams.get("n");
  console.log(c);
  if (c != null) {
    pointsCount = parseInt(c);
  }
  
  points = new Array(pointsCount).fill().map(() => [random(-1, 1), random(-1, 1)]);
  points[1] = [1, 0];
  if (ruleNormalizePoints) {
    normalizeAllPoints();
  }

  heatMap = createImage(int(width / heatMapScale), int(height / heatMapScale));
  heatMap.loadPixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setS() {
  s = parseInt(prompt("Enter a new value of s"));
  bestS = Infinity;
}


function draw() {
  background(isEvolutionGoing ? color(255, 200, 200) : 255);
  if (!isEvolutionGoing) {
    heatMap.updatePixels();
    image(heatMap, 0, 0, width, height);
    clearImage(heatMap);
  }
  translate(width / 2, height / 2);

  // draw axes
  line(-width / 2, 0, width / 2, 0);
  line(0, -height / 2, 0, height / 2);

  // draw points
  textAlign(CENTER, CENTER);
  textSize(radius);

  for (let i = 0; i < pointsCount; i++) {
    let x = points[i][0] * scale;
    let y = points[i][1] * scale;
    fill(i == selectedPoint ? 0 : 255);
    circle(x, y, radius * 2);
    fill(i == selectedPoint ? 255 : 0);
    text(i, x, y);
    fill(0); // Reset text color to ensure visibility
  }

  let sum = 0;
    let denSum = 0;

  if (!isEvolutionGoing) {
    // move selected point(s)
    if (keyIsPressed && keyCode === 16) {
      for (let i = 0; i < pointsCount; ++i) {
        points[i][0] += (mouseX - pmouseX) / scale;
        points[i][1] += (mouseY - pmouseY) / scale;
      }
    }
    else if (selectedPoint >= 0 && selectedPoint < pointsCount) {
      points[selectedPoint][0] = (mouseX - width / 2) / scale;
      points[selectedPoint][1] = (mouseY - height / 2) / scale;
      if (selectedPoint == 0) {
        points[selectedPoint][1] = 0;
      }
      

      if (ruleNormalizePoints) {
        normalizePoint(selectedPoint);
      }
    }

    // calculate and draw the value
  
    sum = F(points);

    // translate(-width / 2, -height / 2);
    // fill(0);
    // text(`${sum}, s = ${s}`, 20, radius * 1.5);

    fill(0, 255, 0);
    let ax = 0, ay = 0;
    for (let i = 0; i < pointsCount; ++i) {
      ax += points[i][0];
      ay += points[i][1];
    }
    circle(ax / pointsCount * scale, ay / pointsCount * scale, 10);

    let testPoints = JSON.parse(JSON.stringify(points));
    let bestS = Infinity;
    let bestPos = [0, 0];

    for (let x = 0; x < width; x += heatMapScale) {
      testPoints[0][0] = (x - width/2) / scale;
      for (let y = 0; y < height; y += heatMapScale) {
        testPoints[0][1] = (y - height/2) / scale;
        let val = F(testPoints);
        // console.log(val);
        heatMap.set(x / heatMapScale, y / heatMapScale, (exp(val - 0.5) - 1) * 255);
        if (val < bestS) {
          bestS = val;
          bestPos = JSON.parse(JSON.stringify(testPoints[0]));
        }
      }
    }

    fill(0, 0, 255);
    circle(bestPos[0] * scale, bestPos[1] * scale, 10);

    if (ruleAutoPlaceZero) {
      points[0] = JSON.parse(JSON.stringify(bestPos));
    }

    // let pr = 0;
    // for (let i = 0; i < pointsCount; ++i) {
    //   pr += pow(dist(0, 0, points[i][0], points[i][1]), s);
    // }

    // pr = pow(pr / (pointsCount), 1/s);

    // fill(0, 0);
    // circle(0, 0, pr * scale * 2);
  } else {
    points = bestPoints;
    let newPoints = new Array(pointsCount).fill().map(() => [random(-1, 1), random(-1, 1)]);
      newPoints[0][1] = 0;

      sum = F(newPoints);
      if (sum < bestSum) {
        points = newPoints;
        bestSum = sum;
        bestPoints = newPoints;
      }

      evolutionSteps++;
  }

  translate(-width / 2, -height / 2);
  fill(255);
  rect(0, 0, width, 45);
  textAlign(LEFT, BASELINE);
  textSize(radius);
  fill(0);
  text(`${sum}, s = ${s}, evolution steps = ${evolutionSteps}`, 20, radius * 1.5);
}

function mousePressed() {
  if (selectedPoint != -1) {
    return;
  }

  selectPointIfNeeded();
}

function mouseReleased() {
  selectedPoint = -1;
}

function selectPointIfNeeded() {
  let closestDist = Infinity;
  let closestIdx = -1;

  for (let i = 0; i < pointsCount; i++) {
    let x = points[i][0] * scale;
    let y = points[i][1] * scale;
    let currentDist = dist(mouseX - width / 2, mouseY - height / 2, x, y);
    if (currentDist < closestDist) {
      closestDist = currentDist;
      closestIdx = i;
    }
  }

  if (closestDist < radius) {
    selectedPoint = closestIdx;
  }
}

function toggleEvolution() {
  isEvolutionGoing = !isEvolutionGoing;
}

function F(points) {
  let pointsCount = points.length;
  let sum = 0, denSum = 0;

  for (let i = 0; i < pointsCount; i++) {
    let x_i = points[i][0];
    let y_i = points[i][1];

    let r_i = dist(0, 0, x_i, y_i);

    for (let j = i + 1; j < pointsCount; j++) {
      let x_j = points[j][0];
      let y_j = points[j][1];

      let r_j = dist(0, 0, x_j, y_j);

      let d_ij = dist(x_i, y_i, x_j, y_j);

      sum += (pow(r_i, s) + pow(r_j, s)) / d_ij;
    }

    denSum += pow(r_i, s - 1);
  }

  sum = sum / (pointsCount - 1) / denSum;
  return sum;
}

function clearImage(img) {
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      img.set(x, y, 255);
    }
  }
}

function keyPressed() {
  switch (keyCode) {
    case 78:
      ruleNormalizePoints = !ruleNormalizePoints;
      break;
    case 65:
      normalizeAllPoints();
      break;
  }
}

function normalizePoint(idx) {
  let d = dist(0, 0, points[idx][0], points[idx][1]);
  points[idx][0] /= d;
  points[idx][1] /= d;
}

function normalizeAllPoints() {
  for (let i = 0; i < pointsCount; ++i) {
    normalizePoint(i);
  }
}