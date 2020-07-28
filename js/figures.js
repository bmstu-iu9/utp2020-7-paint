'use strict';

function endPointFigures() {
  isDrawing = false;
  context.beginPath();
}

function initRectangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointRectangle);
}

function deleteRectangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointRectangle);
  canvas.removeEventListener("mousemove", drawRectangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointRectangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Rectangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  oldX = e.offsetX;
  oldY = e.offsetY;

  drawRectangle(e);

  canvas.addEventListener("mousemove", drawRectangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawRectangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.strokeRect(oldX, oldY, e.offsetX - oldX, e.offsetY - oldY);
  
  changePreview();
}


let centerX, centerY, radius;

function initCircle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointCircle);
}

function deleteCircle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointCircle);
  canvas.removeEventListener("mousemove", drawCircle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointCircle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Circle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawCircle(e);

  canvas.addEventListener("mousemove", drawCircle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawCircle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  radius = Math.sqrt(Math.pow(e.offsetX - centerX, 2) + Math.pow(e.offsetY - centerY, 2));

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.stroke();
  
  changePreview();
}


function initEllipse() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointEllipse);
}

function deleteEllipse() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointEllipse);
  canvas.removeEventListener("mousemove", drawEllipse);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointEllipse(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Ellipse", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  centerX = e.offsetX;
  centerY = e.offsetY;

  drawEllipse(e);

  canvas.addEventListener("mousemove", drawEllipse);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawEllipse(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(centerX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(centerX, centerY, e.offsetX, centerY, e.offsetX, centerY + (e.offsetY - centerY) / 2);
  context.bezierCurveTo(e.offsetX, e.offsetY, centerX, e.offsetY, centerX, centerY + (e.offsetY - centerY) / 2);
  context.stroke();
  
  changePreview();
}


let startX, startY;

function initEqTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointEqTriangle);
}

function deleteEqTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointEqTriangle);
  canvas.removeEventListener("mousemove", drawEqTriangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointEqTriangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("EqTriangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;

  drawEqTriangle(e);

  canvas.addEventListener("mousemove", drawEqTriangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawEqTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(e.offsetX, e.offsetY);
  context.lineTo(startX + (startX - e.offsetX), e.offsetY);
  context.lineTo(startX, startY);
  context.stroke();
  
  changePreview();
}


function initRightTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("mousedown", startPointRightTriangle);
}

function deleteRightTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointRightTriangle);
  canvas.removeEventListener("mousemove", drawRightTriangle);
  canvas.removeEventListener("mouseup", endPointFigures);
  canvas.removeEventListener("mouseleave", endPointFigures);
}

function startPointRightTriangle(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("RightTriangle", [e.offsetX, e.offsetY]);

  saveImg();

  context.lineWidth = curToolSize;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.strokeStyle = arrayToRgb(curColor);

  startX = e.offsetX;
  startY = e.offsetY;

  drawEqTriangle(e);

  canvas.addEventListener("mousemove", drawRightTriangle);
  canvas.addEventListener("mouseup", endPointFigures);
}

function drawRightTriangle(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords[1] = [e.offsetX, e.offsetY];

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.moveTo(startX, startY);
  context.lineTo(e.offsetX, e.offsetY);
  context.lineTo(startX, e.offsetY);
  context.lineTo(startX, startY);
  context.stroke();
  
  changePreview();
}
