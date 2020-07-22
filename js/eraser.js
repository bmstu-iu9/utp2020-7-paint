'use strict';

function initEraser() {
  canvas.addEventListener("mousedown", startPointEraser);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", startPointEraser);
  canvas.removeEventListener("mousemove", drawEraser);
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

  drawEraser(e);

  canvas.addEventListener("mousemove", drawEraser);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawEraser(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}
