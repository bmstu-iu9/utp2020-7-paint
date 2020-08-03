'use strict';

let eraserParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
};

function initEraser() {
  canvas.addEventListener("mousedown", startPointEraser);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", startPointEraser);
  document.removeEventListener("mousemove", drawEraser);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  context.globalCompositeOperation = "source-over";
}

function startPointEraser(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;

  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;
  deltaX = e.pageX - e.offsetX;
  deltaY = e.pageY - e.offsetY;

  context.save();
  context.globalCompositeOperation = "destination-out";
  context.lineWidth = 0.1;
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  context.beginPath();
  context.arc(eraserParameters.oldX, eraserParameters.oldY, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();

  drawEraser(e);

  document.addEventListener("mousemove", drawEraser);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawEraser(e) {
  if (!isDrawing) return;

  context.globalCompositeOperation = "destination-out";
  
  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  eraserParameters.distance = Math.sqrt(Math.pow(curX - eraserParameters.oldX, 2) + Math.pow(curY - eraserParameters.oldY, 2));
  eraserParameters.angle = Math.atan2(curX - eraserParameters.oldX, curY - eraserParameters.oldY);

  for (let i = 0; i < eraserParameters.distance; i++) {
    eraserParameters.newX = eraserParameters.oldX + i * Math.sin(eraserParameters.angle);
    eraserParameters.newY = eraserParameters.oldY + i * Math.cos(eraserParameters.angle);
    context.beginPath();
    context.arc(eraserParameters.newX, eraserParameters.newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  eraserParameters.oldX = curX;
  eraserParameters.oldY = curY;

  context.globalCompositeOperation = "source-over";
  changePreview();
}
