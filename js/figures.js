'use strict'

function initRectangle() {
  canvas.addEventListener("mousedown", startPointRectangle);
}

function deleteRectangle() {
  canvas.removeEventListener("mousedown", startPointRectangle);
  canvas.removeEventListener("mousemove", drawLineRectangle);
  canvas.removeEventListener("mouseup", endPointRectangle);
}

function startPointRectangle(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;

  drawLineRectangle(e);

  canvas.addEventListener("mousemove", drawLineRectangle);
  canvas.addEventListener("mouseup", endPointRectangle);
}

function drawLineRectangle(e) {
  if (!isDrawing) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(oldX, oldY, e.offsetX - oldX, e.offsetY - oldY);
  context.beginPath();
}

function endPointRectangle() {
  isDrawing = false;
  context.beginPath();
}


let centerX, centerY, radius;

function initCircle() {
  canvas.addEventListener("mousedown", startPointCircle);
}

function deleteCircle() {
  canvas.removeEventListener("mousedown", startPointCircle);
  canvas.removeEventListener("mousemove", drawLineCircle);
  canvas.removeEventListener("mouseup", endPointCircle);
}

function startPointCircle(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawLineCircle(e);

  canvas.addEventListener("mousemove", drawLineCircle);
  canvas.addEventListener("mouseup", endPointCircle);
}

function drawLineCircle(e) {
  if (!isDrawing) return;

  radius = Math.sqrt(Math.pow(e.offsetX - centerX, 2) + Math.pow(e.offsetY - centerY, 2));

  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.stroke();
}

function endPointCircle() {
  isDrawing = false;
  context.beginPath();
}


function initEllipse() {
  canvas.addEventListener("mousedown", startPointEllipse);
}

function deleteEllipse() {
  canvas.removeEventListener("mousedown", startPointEllipse);
  canvas.removeEventListener("mousemove", drawLineEllipse);
  canvas.removeEventListener("mouseup", endPointEllipse);
}

function startPointEllipse(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawLineEllipse(e);

  canvas.addEventListener("mousemove", drawLineEllipse);
  canvas.addEventListener("mouseup", endPointEllipse);
}

function drawLineEllipse(e) {
  if (!isDrawing) return;

  radius = Math.sqrt(Math.pow(e.offsetX - centerX, 2) + Math.pow(e.offsetY - centerY, 2));

  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.moveTo(centerX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(centerX, centerY, e.offsetX, centerY, e.offsetX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(e.offsetX, e.offsetY, centerX, e.offsetY, centerX, centerY + (e.offsetY - centerY) / 2);
  context.stroke();
}

function endPointEllipse() {
  isDrawing = false;
  context.beginPath();
}