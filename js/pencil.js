'use strict';

function initPencil() {
  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.removeEventListener("mousedown", startPointPencil);
  canvas.removeEventListener("mousemove", drawLinePencil);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPointLeave);
}

function startPointPencil(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  drawLinePencil(e);

  canvas.addEventListener("mousemove", drawLinePencil);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPointLeave);
}

function drawLinePencil(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
