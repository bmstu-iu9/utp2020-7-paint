'use strict';

function initEraser() {
  canvas.addEventListener("mousedown", startPointEraser);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", startPointEraser);
  canvas.removeEventListener("mousemove", drawLineEraser);
  canvas.removeEventListener("mouseup", endPoint);
}

function startPointEraser(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curCanvasColor);

  drawLineEraser(e);

  canvas.addEventListener("mousemove", drawLineEraser);
  canvas.addEventListener("mouseup", endPoint);
}

function drawLineEraser(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
