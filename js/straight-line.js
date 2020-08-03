'use strict';

function initStraightLine() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointStraightLine);
}

function deleteStraightLine() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointStraightLine);
  document.removeEventListener("mousemove", drawStraightLine);
  document.removeEventListener("mouseup", endPoint);
}

function startPointStraightLine(e) {
  e.preventDefault();
  isDrawing = true;

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  drawStraightLine(e);

  document.addEventListener("mousemove", drawStraightLine);
  document.addEventListener("mouseup", endPoint);
}

function drawStraightLine(e) {
  if (!isDrawing) return;

  curX = e.pageX - deltaX;
  curY = e.pageY - deltaY;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo (oldX, oldY);
  context.lineTo (curX, curY);
  context.stroke();

  changePreview();
}
