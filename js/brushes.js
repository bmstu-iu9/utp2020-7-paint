'use strict'

let isDrawing = false;

function initBasicBrush() {
  canvas.addEventListener("mousedown", startPointBasic);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPointBasic);
  canvas.removeEventListener("mousemove", drawLineBasic);
  canvas.removeEventListener("mouseup", endPoint);
}

function startPointBasic(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor)

  drawLineBasic(e);

  canvas.addEventListener("mousemove", drawLineBasic);
  canvas.addEventListener("mouseup", endPoint);
}

function endPoint() {
  isDrawing = false;
  context.beginPath();
}

function drawLineBasic(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}


function initNeonBrush() {
  canvas.addEventListener("mousedown", startPointNeon);
}

function deleteNeonBrush() {
  canvas.removeEventListener("mousedown", startPointNeon);
  canvas.removeEventListener("mousemove", drawLineBasic);
  canvas.removeEventListener("mouseup", endPoint);
  context.shadowBlur = 0;
}

function startPointNeon(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor)
  context.shadowBlur = curToolSize;
  context.shadowColor = arrayToRgb(curColor)

  drawLineBasic(e);

  canvas.addEventListener("mousemove", drawLineBasic);
  canvas.addEventListener("mouseup", endPoint);
}


function initSmoothBrush() {
  canvas.addEventListener("mousedown", startPointSmooth);
}

function deleteSmoothBrush() {
  canvas.removeEventListener("mousedown", startPointSmooth);
  canvas.removeEventListener("mousemove", drawLineSmooth);
  canvas.removeEventListener("mouseup", endPoint);
  context.globalAlpha = "1";
}

let oldX, oldY, newX, newY, distance, angle;

function startPointSmooth(e) {
  isDrawing = true;

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.lineWidth = 0;
  context.globalAlpha = "0.01";
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  canvas.addEventListener("mousemove", drawLineSmooth);
  canvas.addEventListener("mouseup", endPoint);
}

function drawLineSmooth(e) {
  if (!isDrawing) return;

  distance = Math.sqrt(Math.pow(e.offsetX - oldX, 2) + Math.pow(e.offsetY - oldY, 2))
  angle = Math.atan2(e.offsetX - oldX, e.offsetY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize/2, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    context.stroke();
  }

  oldX = e.offsetX;
  oldY = e.offsetY;
}


function initSketchBrush() {
  canvas.addEventListener("mousedown", startPointSketch);
}

function deleteSketchBrush() {
  canvas.removeEventListener("mousedown", startPointSketch);
  canvas.removeEventListener("mousemove", drawLineSketch);
  canvas.removeEventListener("mouseup", endPoint);
  context.globalAlpha = "1";
}

let pointsCounter, prevPoints;

function startPointSketch(e) {
  isDrawing = true;

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.strokeStyle = arrayToRgb(curColor);
  context.globalAlpha = "0.1";

context.lineWidth = Math.min(5, curToolSize);

  prevPoints = new Array(10);
  pointsCounter = 0;
  prevPoints[pointsCounter] = [e.offsetX, e.offsetY];

  drawLineSketch(e);

  canvas.addEventListener("mousemove", drawLineSketch);
  canvas.addEventListener("mouseup", endPoint);
}

function drawLineSketch(e) {
  if (!isDrawing) return;

  pointsCounter = pointsCounter + 1;

  if (pointsCounter == 10) pointsCounter = 0;

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(e.offsetX, e.offsetY);

  if (prevPoints[pointsCounter]) {
    newX = prevPoints[pointsCounter][0];
    newY = prevPoints[pointsCounter][1];

    context.moveTo(newX, newY);
    context.lineTo(e.offsetX, e.offsetY);
  }

  context.stroke();

  oldX = e.offsetX;
  oldY = e.offsetY;

  prevPoints[pointsCounter] = [e.offsetX, e.offsetY];
}
