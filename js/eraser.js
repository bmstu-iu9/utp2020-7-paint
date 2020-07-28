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
  canvas.removeEventListener("mousemove", drawEraser);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalCompositeOperation = "source-over";
}

function startPointEraser(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Eraser");
  
  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;

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
  
  canvas.addEventListener("mousemove", drawEraser);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawEraser(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  eraserParameters.distance = Math.sqrt(Math.pow(e.offsetX - eraserParameters.oldX, 2) + Math.pow(e.offsetY - eraserParameters.oldY, 2));
  eraserParameters.angle = Math.atan2(e.offsetX - eraserParameters.oldX, e.offsetY - eraserParameters.oldY);

  for (let i = 0; i < eraserParameters.distance; i++) {
    eraserParameters.newX = eraserParameters.oldX + i * Math.sin(eraserParameters.angle);
    eraserParameters.newY = eraserParameters.oldY + i * Math.cos(eraserParameters.angle);
    context.beginPath();
    context.arc(eraserParameters.newX, eraserParameters.newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;
  
  changePreview();
}
