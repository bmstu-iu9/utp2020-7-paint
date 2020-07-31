'use strict';

function initRectangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointRectangle);
}

function deleteRectangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointRectangle);
  document.removeEventListener("mousemove", drawRectangle);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointRectangle(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("Rectangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  drawRectangle(e);

  document.addEventListener("mousemove", drawRectangle);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawRectangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.strokeRect(oldX, oldY, curX - oldX, curY - oldY);

  changePreview();
}


let centerX, centerY, radius;

function initCircle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointCircle);
}

function deleteCircle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointCircle);
  document.removeEventListener("mousemove", drawCircle);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointCircle(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("Circle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;
  deltaX = e.pageX - centerX;
  deltaY = e.pageY - centerY;

  drawCircle(e);

  document.addEventListener("mousemove", drawCircle);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawCircle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  radius = Math.sqrt(Math.pow(curX - centerX, 2) + Math.pow(curY - centerY, 2));

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.stroke();

  changePreview();
}


function initEllipse() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointEllipse);
}

function deleteEllipse() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointEllipse);
  document.removeEventListener("mousemove", drawEllipse);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointEllipse(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("Ellipse", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;
  deltaX = e.pageX - centerX;
  deltaY = e.pageY - centerY;

  drawEllipse(e);

  document.addEventListener("mousemove", drawEllipse);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawEllipse(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(centerX, centerY + (curY - centerY) / 2);
  context.bezierCurveTo(centerX, centerY, curX, centerY, curX, centerY + (curY - centerY) / 2);
  context.bezierCurveTo(curX, curY, centerX, curY, centerX, centerY + (curY - centerY) / 2);
  context.stroke();

  changePreview();
}

let startX, startY;

function initEqTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointEqTriangle);
}

function deleteEqTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointEqTriangle);
  document.removeEventListener("mousemove", drawEqTriangle);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointEqTriangle(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("EqTriangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;
  deltaX = e.pageX - startX;
  deltaY = e.pageY - startY;

  drawEqTriangle(e);

  document.addEventListener("mousemove", drawEqTriangle);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawEqTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(curX, curY);
  context.lineTo(startX + (startX - curX), curY);
  context.lineTo(startX, startY);
  context.stroke();

  changePreview();
}


function initRightTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointRightTriangle);
}

function deleteRightTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointRightTriangle);
  document.removeEventListener("mousemove", drawRightTriangle);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointRightTriangle(e) {
  isDrawing = true;
  isOnCanvas = true;
  if (!isReplaying) rememberDrawingTool("RightTriangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;
  deltaX = e.pageX - startX;
  deltaY = e.pageY - startY;

  drawEqTriangle(e);

  document.addEventListener("mousemove", drawRightTriangle);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawRightTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  curX = e.offsetX;
  curY = e.offsetY;
  
  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(curX, curY);
  context.lineTo(startX, curY);
  context.lineTo(startX, startY);
  context.stroke();

  changePreview();
}
