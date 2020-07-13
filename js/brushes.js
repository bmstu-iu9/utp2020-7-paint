'use strict'

let isDrawing = false;

function initBasicBrush() {
  canvas.addEventListener("mousedown", startPoint);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPoint);
  canvas.removeEventListener("mousemove", drawLine);
  canvas.removeEventListener("mouseup", endPoint);
}

function startPoint(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = arrayToRgb(curColor)

  drawLine(e);

  canvas.addEventListener("mousemove", drawLine);
  canvas.addEventListener("mouseup", endPoint);
}

function endPoint() {
  isDrawing = false;
  context.beginPath();
}

function drawLine(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
