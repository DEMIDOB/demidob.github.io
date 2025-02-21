let points;
let scale = 100;
let radius = 20;

let selectedPoint = -1;

let pointsCount = 3;
let s = 1;

let isEvolutionGoing = false;
let bestSum = Infinity;
let bestPoints;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let url = new URL(window.location.href);
  let c = url.searchParams.get("n");
  console.log(c);
  if (c != null) {
    pointsCount = parseInt(c);
  }
  
  points = new Array(pointsCount).fill().map(() => [random(-1, 1), random(-1, 1)]);
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
    // move selected point
    if (selectedPoint >= 0 && selectedPoint < pointsCount) {
      points[selectedPoint][0] = (mouseX - width / 2) / scale;
      points[selectedPoint][1] = (mouseY - height / 2) / scale;
    }

    // calculate and draw the value
  
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

    // translate(-width / 2, -height / 2);
    // fill(0);
    // text(`${sum}, s = ${s}`, 20, radius * 1.5);
  } else {
    points = bestPoints;
    let newPoints = new Array(pointsCount).fill().map(() => [random(-1, 1), random(-1, 1)]);
    
      for (let i = 0; i < pointsCount; i++) {
        let x_i = newPoints[i][0];
        let y_i = newPoints[i][1];
    
        let r_i = dist(0, 0, x_i, y_i);
    
        for (let j = i + 1; j < pointsCount; j++) {
          let x_j = newPoints[j][0];
          let y_j = newPoints[j][1];
    
          let r_j = dist(0, 0, x_j, y_j);
    
          let d_ij = dist(x_i, y_i, x_j, y_j);
    
          sum += (pow(r_i, s) + pow(r_j, s)) / d_ij;
        }
    
        denSum += pow(r_i, s - 1);
      }

      sum = sum / (pointsCount - 1) / denSum;
      if (sum < bestSum) {
        points = newPoints;
        bestSum = sum;
        bestPoints = newPoints;
      }
  }

  
  textAlign(LEFT, BASELINE);
  textSize(radius);
  translate(-width / 2, -height / 2);
  fill(0);
  text(`${sum}, s = ${s}`, 20, radius * 1.5);
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