'use strict';

let isDrawing = false;

function endPoint() {
  isDrawing = false;
  context.beginPath();
}


function initNeonBrush() {
  canvas.addEventListener("mousedown", startPointNeonBrush);
}

function deleteNeonBrush() {
  canvas.removeEventListener("mousedown", startPointNeonBrush);
  canvas.removeEventListener("mousemove", drawLineNeonBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.shadowBlur = 0;
}

function startPointNeonBrush(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor)
  context.shadowBlur = curToolSize;
  context.shadowColor = arrayToRgb(curColor)

  drawLineNeonBrush(e);

  canvas.addEventListener("mousemove", drawLineNeonBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLineNeonBrush(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}


function initSmoothBrush() {
  canvas.addEventListener("mousedown", startPointSmoothBrush);
}

function deleteSmoothBrush() {
  canvas.removeEventListener("mousedown", startPointSmoothBrush);
  canvas.removeEventListener("mousemove", drawLineSmoothBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalAlpha = "1";
}

let oldX, oldY, newX, newY, distance, angle;

function startPointSmoothBrush(e) {
  isDrawing = true;

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.lineWidth = 0;
  context.globalAlpha = "0.01";
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  canvas.addEventListener("mousemove", drawLineSmoothBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLineSmoothBrush(e) {
  if (!isDrawing) return;

  distance = Math.sqrt(Math.pow(e.offsetX - oldX, 2) + Math.pow(e.offsetY - oldY, 2))
  angle = Math.atan2(e.offsetX - oldX, e.offsetY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    context.stroke();
  }

  oldX = e.offsetX;
  oldY = e.offsetY;
}


function initSketchBrush() {
  canvas.addEventListener("mousedown", startPointSketchBrush);
}

function deleteSketchBrush() {
  canvas.removeEventListener("mousedown", startPointSketchBrush);
  canvas.removeEventListener("mousemove", drawLineSketchBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalAlpha = "1";
}

let pointsCounter, prevPoints;

function startPointSketchBrush(e) {
  isDrawing = true;

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.strokeStyle = arrayToRgb(curColor);
  context.globalAlpha = "0.1";

  context.lineWidth = Math.min(5, curToolSize);

  prevPoints = new Array(10);
  pointsCounter = 0;
  prevPoints[pointsCounter] = [e.offsetX, e.offsetY];

  drawLineSketchBrush(e);

  canvas.addEventListener("mousemove", drawLineSketchBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLineSketchBrush(e) {
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
