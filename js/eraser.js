'use strict';

function initEraser() {
  canvas.addEventListener("mousedown", startPointEraser);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", startPointEraser);
  canvas.removeEventListener("mousemove", drawLineEraser);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointEraser(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Eraser");

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curCanvasColor);

  drawLineEraser(e);

  canvas.addEventListener("mousemove", drawLineEraser);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLineEraser(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
