'use strict';

function initStraightLine() {
  canvas.addEventListener("mousedown", startStraightLine);
}

function deleteStraightLine() {
  canvas.removeEventListener("mousedown", startStraightLine);
  canvas.removeEventListener("mousemove", drawStraightLine);
  canvas.removeEventListener("mouseup", endStraightLine);
  canvas.removeEventListener("mouseleave", endStraightLine);
}

function startStraightLine(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("StraightLine");

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
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo (oldX, oldY);
  context.lineTo (e.clientX, e.clientY);
  context.stroke();
}

function endStraightLine() {
  isDrawing = false;
  context.beginPath();
}
