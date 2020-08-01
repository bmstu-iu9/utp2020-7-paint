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
  canvas.removeEventListener("mouseenter", returnPoint);
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
  canvas.removeEventListener("mouseenter", returnPoint);
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
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointSketchBrush);
}

function deleteSketchBrush() {
  canvas.removeEventListener("mousedown", startPointSketchBrush);
  document.removeEventListener("mousemove", drawSketchBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
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

  pointsCounter++;

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


function initPatternBrush() {
  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointPatternBrush);
}

function deletePatternBrush() {
  canvas.removeEventListener("mousedown", startPointPatternBrush);
  document.removeEventListener("mousemove", drawPatternBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  context.globalAlpha = "1";
  toolSizeRange.max = 300;
  toolSizeText.value = '5px';
  toolSizeRange.value = 5;
  curToolSize = 5;
}

function startPointPatternBrush(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("PatternBrush");

  context.lineWidth = curToolSize;
  context.globalAlpha = "0.1";

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.strokeStyle = arrayToRgb(curColor);

  prevPoints = new Array();
  pointsCounter = 0;

  drawPatternBrush(e);

  document.addEventListener("mousemove", drawPatternBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawPatternBrush(e) {
  let dx, dy, d;

  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  prevPoints[pointsCounter] = [curX, curY];

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.stroke();

  for (let i = 0; i < prevPoints.length; i++) {
    dx = prevPoints[i][0] - prevPoints[pointsCounter][0];
    dy = prevPoints[i][1] - prevPoints[pointsCounter][1];
    d = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (d < 1000) {
      context.beginPath();
      context.moveTo(prevPoints[pointsCounter][0] + (dx * 0.2), prevPoints[pointsCounter][1] + (dy * 0.2));
      context.lineTo(prevPoints[i][0] - (dx * 0.2), prevPoints[i][1] - (dy * 0.2));
      context.stroke();
    }
  }

  oldX = curX;
  oldY = curY;

  pointsCounter++;

  changePreview();
}


function initFurBrush() {
  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointFurBrush);
}

function deleteFurBrush() {
  canvas.removeEventListener("mousedown", startPointFurBrush);
  document.removeEventListener("mousemove", drawFurBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  context.globalAlpha = "1";
  toolSizeRange.max = 300;
}

function startPointFurBrush(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("FurBrush");

  context.lineWidth = curToolSize;
  context.globalAlpha = "0.1";

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.strokeStyle = arrayToRgb(curColor);

  prevPoints = new Array();
  pointsCounter = 0;

  drawFurBrush(e);

  document.addEventListener("mousemove", drawFurBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawFurBrush(e) {
  let dx, dy, d;

  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  prevPoints[pointsCounter] = [curX, curY];

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.stroke();

  for (let i = 0; i < prevPoints.length; i++) {
    dx = prevPoints[i][0] - prevPoints[pointsCounter][0];
    dy = prevPoints[i][1] - prevPoints[pointsCounter][1];
    d = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (d < 4000) {
      context.beginPath();
      context.moveTo(curX + (dx * 0.3), curY + (dy * 0.3));
      context.lineTo(curX - (dx * 0.3), curY - (dy * 0.3));
      context.stroke();
    }
  }

  oldX = curX;
  oldY = curY;

  pointsCounter++;

  changePreview();
}


function initRectangleBrush() {
  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointRectangleBrush);
}

function deleteRectangleBrush() {
  canvas.removeEventListener("mousedown", startPointRectangleBrush);
  document.removeEventListener("mousemove", drawRectangleBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  toolSizeRange.max = 300;
}

function startPointRectangleBrush(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("RectangleBrush");

  context.lineWidth = curToolSize;

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.strokeStyle = arrayToRgb(curColor);

  drawRectangleBrush(e);

  document.addEventListener("mousemove", drawRectangleBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawRectangleBrush(e) {
  let dx, dy, nx, ny, angle;

  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  dx = curX - oldX;
  dy = curY - oldY;
  angle = 1.5;
  nx = Math.cos(angle) * dx - Math.sin(angle) * dy;
  ny = Math.sin(angle) * dx + Math.cos(angle) * dy;

  context.beginPath();
  context.moveTo(oldX - nx, oldY - ny);
  context.lineTo(oldX + nx, oldY + ny);
  context.lineTo(curX + nx, curY + ny);
  context.lineTo(curX - nx, curY - ny);
  context.lineTo(oldX - nx, oldY - ny);
  context.stroke();

  oldX = curX;
  oldY = curY;

  changePreview();
}


function initCircleBrush() {
  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;
  canvas.addEventListener("mousedown", startPointCircleBrush);
}

function deleteCircleBrush() {
  canvas.removeEventListener("mousedown", startPointCircleBrush);
  document.removeEventListener("mousemove", drawCircleBrush);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  toolSizeRange.max = 300;
  toolSizeText.value = '5px';
  toolSizeRange.value = 5;
  curToolSize = 5;
}

function startPointCircleBrush(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("CircleBrush");

  context.lineWidth = curToolSize;

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  context.strokeStyle = arrayToRgb(curColor);

  drawCircleBrush(e);

  document.addEventListener("mousemove", drawCircleBrush);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawCircleBrush(e) {
  let dx, dy, d;

  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  dx = curX - oldX;
  dy = curY - oldY;
  d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  context.beginPath();
  context.arc(curX, curY, d, 0, Math.PI * 2, true);
  context.stroke();

  oldX = curX;
  oldY = curY;

  changePreview();
}
