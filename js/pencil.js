'use strict';

function initPencil() {
  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.removeEventListener("mousedown", startPointPencil);
  canvas.removeEventListener("mousemove", drawLinePencil);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointPencil(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Pencil");

  context.lineWidth = curToolSize;
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  drawLinePencil(e);

  canvas.addEventListener("mousemove", drawLinePencil);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLinePencil(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState].cords.push([e.offsetX, e.offsetY]);

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
