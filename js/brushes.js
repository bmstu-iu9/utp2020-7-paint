'use strict';

let isDrawing = false;
let oldX, oldY, newX, newY, distance, angle;

function initBasicBrush() {
  canvas.addEventListener("mousedown", startPointBasicBrush);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPointBasicBrush);
  document.removeEventListener("mousemove", drawBasicBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointBasicBrush(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("BasicBrush");

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.lineWidth = 0.1;
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  context.beginPath();
  context.arc(oldX, oldY, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();

  drawBasicBrush(e);

  document.addEventListener("mousemove", drawBasicBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawBasicBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  oldX = curX;
  oldY = curY;

  changePreview();
}


function initNeonBrush() {
  canvas.addEventListener("mousedown", startPointNeonBrush);
}

function deleteNeonBrush() {
  canvas.removeEventListener("mousedown", startPointNeonBrush);
  document.removeEventListener("mousemove", drawNeonBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  context.shadowBlur = 0;
}

function startPointNeonBrush(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("NeonBrush");

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor)
  context.shadowBlur = curToolSize;
  context.shadowColor = arrayToRgb(curColor)

  deltaX = e.pageX - e.offsetX;
  deltaY = e.pageY - e.offsetY;

  drawNeonBrush(e);

  document.addEventListener("mousemove", drawNeonBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawNeonBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  context.lineTo(curX, curY);
  context.stroke();
  context.beginPath();
  context.moveTo(curX, curY);

  changePreview();
}


function initSmoothBrush() {
  canvas.addEventListener("mousedown", startPointSmoothBrush);
}

function deleteSmoothBrush() {
  canvas.removeEventListener("mousedown", startPointSmoothBrush);
  document.removeEventListener("mousemove", drawSmoothBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  context.globalAlpha = "1";
}

function startPointSmoothBrush(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("SmoothBrush");

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

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

  document.addEventListener("mousemove", drawSmoothBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawSmoothBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  oldX = curX;
  oldY = curY;

  changePreview();
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
  document.removeEventListener("mousemove", drawSketchBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  context.globalAlpha = "1";
  toolSizeRange.max = 300;
}


function startPointSketchBrush(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("SketchBrush");

  context.lineWidth = curToolSize;

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.strokeStyle = arrayToRgb(curColor);
  context.globalAlpha = "0.1";

  prevPoints = new Array(10);
  pointsCounter = 0;
  prevPoints[pointsCounter] = [e.offsetX, e.offsetY];

  drawSketchBrush(e);

  document.addEventListener("mousemove", drawSketchBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawSketchBrush(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;
  
  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  pointsCounter = pointsCounter + 1;

  if (pointsCounter == 10) pointsCounter = 0;

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);

  if (prevPoints[pointsCounter]) {
    newX = prevPoints[pointsCounter][0];
    newY = prevPoints[pointsCounter][1];

    context.moveTo(newX, newY);
    context.lineTo(curX, curY);
  }

  context.stroke();

  oldX = curX;
  oldY = curY;

  prevPoints[pointsCounter] = [curX, curY];

  changePreview();
}
