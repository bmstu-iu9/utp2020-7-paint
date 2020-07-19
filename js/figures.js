'use strict'

function endPointFigures() {
  isDrawing = false;
  context.beginPath();
}

function initRectangle() {
  canvas.addEventListener("mousedown", startPointRectangle);
}

function deleteRectangle() {
  canvas.removeEventListener("mousedown", startPointRectangle);
  canvas.removeEventListener("mousemove", drawLineRectangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointRectangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Rectangle");

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;

  drawLineRectangle(e);

  canvas.addEventListener("mousemove", drawLineRectangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawLineRectangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.strokeRect(oldX, oldY, e.offsetX - oldX, e.offsetY - oldY);
}


let centerX, centerY, radius;

function initCircle() {
  canvas.addEventListener("mousedown", startPointCircle);
}

function deleteCircle() {
  canvas.removeEventListener("mousedown", startPointCircle);
  canvas.removeEventListener("mousemove", drawLineCircle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointCircle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Circle");

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawLineCircle(e);

  canvas.addEventListener("mousemove", drawLineCircle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawLineCircle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  radius = Math.sqrt(Math.pow(e.offsetX - centerX, 2) + Math.pow(e.offsetY - centerY, 2));

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.stroke();
}


function initEllipse() {
  canvas.addEventListener("mousedown", startPointEllipse);
}

function deleteEllipse() {
  canvas.removeEventListener("mousedown", startPointEllipse);
  canvas.removeEventListener("mousemove", drawLineEllipse);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointEllipse(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Ellipse");

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawLineEllipse(e);

  canvas.addEventListener("mousemove", drawLineEllipse);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawLineEllipse(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(centerX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(centerX, centerY, e.offsetX, centerY, e.offsetX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(e.offsetX, e.offsetY, centerX, e.offsetY, centerX, centerY + (e.offsetY - centerY) / 2);
  context.stroke();
}


let startX, startY;

function initEqTriangle() {
  canvas.addEventListener("mousedown", startPointEqTriangle);
}

function deleteEqTriangle() {
  canvas.removeEventListener("mousedown", startPointEqTriangle);
  canvas.removeEventListener("mousemove", drawLineEqTriangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointEqTriangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("EqTriangle");

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;

  drawLineEqTriangle(e);

  canvas.addEventListener("mousemove", drawLineEqTriangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawLineEqTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(e.offsetX, e.offsetY);
  context.lineTo(startX + (startX - e.offsetX), e.offsetY);
  context.lineTo(startX, startY);
  context.stroke();
}


function initRightTriangle() {
  canvas.addEventListener("mousedown", startPointRightTriangle);
}

function deleteRightTriangle() {
  canvas.removeEventListener("mousedown", startPointRightTriangle);
  canvas.removeEventListener("mousemove", drawLineRightTriangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointRightTriangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("RightTriangle");

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;

  drawLineEqTriangle(e);

  canvas.addEventListener("mousemove", drawLineRightTriangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawLineRightTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(e.offsetX, e.offsetY);
  context.lineTo(startX, e.offsetY);
  context.lineTo(startX, startY);
  context.stroke();
}
