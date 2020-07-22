'use strict';

function initPencil() {
  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.removeEventListener("mousedown", startPointPencil);
  canvas.removeEventListener("mousemove", drawPencil);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointPencil(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Pencil");

  context.lineWidth = curToolSize;
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  drawPencil(e);

  canvas.addEventListener("mousemove", drawPencil);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawPencil(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
