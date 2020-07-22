'use strict';

function initStraightLine() {
  canvas.addEventListener("mousedown", startPointStraightLine);
}

function deleteStraightLine() {
  canvas.removeEventListener("mousedown", startPointStraightLine);
  canvas.removeEventListener("mousemove", drawStraightLine);
  canvas.removeEventListener("mouseup", endStraightLine);
  canvas.removeEventListener("mouseleave", endStraightLine);
}

function startPointStraightLine(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("StraightLine", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;

  drawStraightLine(e);

  canvas.addEventListener("mousemove", drawStraightLine);
  canvas.addEventListener("mouseup", endStraightLine);
}

function drawStraightLine(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo (oldX, oldY);
  context.lineTo (e.offsetX, e.offsetY);
  context.stroke();
}

function endStraightLine(e) {
  isDrawing = false;
  context.beginPath();
}
