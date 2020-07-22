'use strict';

let isDrawing = false;

function endPoint() {
  isDrawing = false;
  context.beginPath();
}


let oldX, oldY, newX, newY, distance, angle;

function initBasicBrush() {
  canvas.addEventListener("mousedown", startPointBasicBrush);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPointBasicBrush);
  canvas.removeEventListener("mousemove", drawBasicBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointBasicBrush(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("BasicBrush");

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.lineWidth = 0.1;
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  context.beginPath();
  context.arc(oldX, oldY, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();

  drawBasicBrush(e);

  canvas.addEventListener("mousemove", drawBasicBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawBasicBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  distance = Math.sqrt(Math.pow(e.offsetX - oldX, 2) + Math.pow(e.offsetY - oldY, 2))
  angle = Math.atan2(e.offsetX - oldX, e.offsetY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  oldX = e.offsetX;
  oldY = e.offsetY;
}


function initNeonBrush() {
  canvas.addEventListener("mousedown", startPointNeonBrush);
}

function deleteNeonBrush() {
  canvas.removeEventListener("mousedown", startPointNeonBrush);
  canvas.removeEventListener("mousemove", drawNeonBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.shadowBlur = 0;
}

function startPointNeonBrush(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("NeonBrush");

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor)
  context.shadowBlur = curToolSize;
  context.shadowColor = arrayToRgb(curColor)

  drawNeonBrush(e);

  canvas.addEventListener("mousemove", drawNeonBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawNeonBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

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
  canvas.removeEventListener("mousemove", drawSmoothBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalAlpha = "1";
}

function startPointSmoothBrush(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("SmoothBrush");

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.lineWidth = 0.1;
  context.globalAlpha = "0.01";
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  context.beginPath();
  context.arc(oldX, oldY, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();

  drawSmoothBrush(e);

  canvas.addEventListener("mousemove", drawSmoothBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawSmoothBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  distance = Math.sqrt(Math.pow(e.offsetX - oldX, 2) + Math.pow(e.offsetY - oldY, 2))
  angle = Math.atan2(e.offsetX - oldX, e.offsetY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  oldX = e.offsetX;
  oldY = e.offsetY;
}


let pointsCounter, prevPoints;

function initSketchBrush() {
  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = `1px`;
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointSketchBrush);
}

function deleteSketchBrush() {
  canvas.removeEventListener("mousedown", startPointSketchBrush);
  canvas.removeEventListener("mousemove", drawSketchBrush);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalAlpha = "1";
  toolSizeRange.max = 300;
}


function startPointSketchBrush(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("SketchBrush");

  context.lineWidth = curToolSize;

  oldX = e.offsetX;
  oldY = e.offsetY;

  context.strokeStyle = arrayToRgb(curColor);
  context.globalAlpha = "0.1";

  prevPoints = new Array(10);
  pointsCounter = 0;
  prevPoints[pointsCounter] = [e.offsetX, e.offsetY];

  drawSketchBrush(e);

  canvas.addEventListener("mousemove", drawSketchBrush);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawSketchBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

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
