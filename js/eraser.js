'use strict'

let eraserButton = document.getElementById("eraser");
let lastX, lastY, mouseX, mouseY;
let isMouseDown = false;

function initEraser() {
  canvas.addEventListener("mousedown", eraseLines);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", eraseLines);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseout", handleMouseOut);
  canvas.removeEventListener("mouseup", handleMouseUp);
  context.globalCompositeOperation="source-over";
}

function eraseLines(e) {
  isMouseDown = true;

  mouseX = e.offsetX;
  mouseY = e.offsetY;
  lastX = mouseX;
  lastY = mouseY;

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseout", handleMouseOut);
}

function handleMouseUp(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  isMouseDown = false;
}

function handleMouseOut(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
  isMouseDown = false;
  context.beginPath();
}

function handleMouseMove(e) {
  mouseX = e.offsetX;
  mouseY = e.offsetY;

  if(isMouseDown) {
    context.beginPath();
    context.globalCompositeOperation = "destination-out";
    context.arc(lastX, lastY, curToolSize, 0, Math.PI*2);
    context.fill();
    lastX = mouseX;
    lastY = mouseY;
  }
}
