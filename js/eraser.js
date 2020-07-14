'use strict'

let eraserButton = document.getElementById("eraser");

function initEraser() {
  canvas.addEventListener("mousedown", erase);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", erase);
  canvas.removeEventListener("mouseout", eraserOut);
  canvas.removeEventListener("mouseup", eraserUp);
}

function erase(eventClick) {
  let startX = eventClick.offsetX;
  let startY = eventClick.offsetY;

  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curCanvasColor);
  context.lineCap = "round";

  erasePoint(startX, startY);

  canvas.addEventListener("mousemove", eraseLines);
  canvas.addEventListener("mouseup", eraserUp);
  canvas.addEventListener("mouseout", eraserOut);
}

function eraserUp(eventUp) {
  context.lineTo(eventUp.offsetX, eventUp.offsetY);
  context.stroke();
  canvas.removeEventListener("mousemove", eraseLines);
  context.beginPath();
}

function eraserOut(eventOut) {
  canvas.removeEventListener("mousemove", eraseLines);
  context.beginPath();
}

function eraseLines(eventMove) {
  context.lineTo(eventMove.offsetX, eventMove.offsetY);
  context.stroke();
  context.moveTo(eventMove.offsetX, eventMove.offsetY);
}

function erasePoint(startX, startY) {
  context.moveTo(startX, startY);
  context.lineTo(startX, startY);
  context.stroke();
}
