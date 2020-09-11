'use strict';

function initFigure(e) {
  e.preventDefault();
  isDrawing = true;

  if (isThereSelection) rememberCanvasWithoutSelection();

  saveImg();

  context.save();
  context.lineWidth = curToolSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = arrayToRgb(curColor);

  [oldX, oldY] = getCoordsOnCanvas(e);

  if (isThereSelection) uniteRememberAndSelectedImages();
}

function updateCanvasFigures(e) {
  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
}


function initStraightLine() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointStraightLine);
}

function deleteStraightLine() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointStraightLine);
  document.removeEventListener('mousemove', drawStraightLine);
  document.removeEventListener('mouseup', endPoint);
}

function startPointStraightLine(e) {
  initFigure(e);

  drawStraightLine(e);

  document.addEventListener('mousemove', drawStraightLine);
  document.addEventListener('mouseup', endPoint);
}

function drawStraightLine(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initRectangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointRectangle);
}

function deleteRectangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointRectangle);
  document.removeEventListener('mousemove', drawRectangle);
  document.removeEventListener('mouseup', endPoint);
}

function startPointRectangle(e) {
  initFigure(e);

  drawRectangle(e);

  document.addEventListener('mousemove', drawRectangle);
  document.addEventListener('mouseup', endPoint);
}

function drawRectangle(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.strokeRect(oldX, oldY, curX - oldX, curY - oldY);

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


let radius;

function initCircle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointCircle);
}

function deleteCircle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointCircle);
  document.removeEventListener('mousemove', drawCircle);
  document.removeEventListener('mouseup', endPoint);
}

function startPointCircle(e) {
  initFigure(e);

  drawCircle(e);

  document.addEventListener('mousemove', drawCircle);
  document.addEventListener('mouseup', endPoint);
}

function drawCircle(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  radius = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2));
  context.arc(oldX, oldY, radius, 0, 2 * Math.PI, false);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initEllipse() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointEllipse);
}

function deleteEllipse() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointEllipse);
  document.removeEventListener('mousemove', drawEllipse);
  document.removeEventListener('mouseup', endPoint);
}

function startPointEllipse(e) {
  initFigure(e);

  drawEllipse(e);

  document.addEventListener('mousemove', drawEllipse);
  document.addEventListener('mouseup', endPoint);
}

function drawEllipse(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.moveTo(oldX, oldY + (curY - oldY) / 2);
  context.bezierCurveTo(oldX, oldY, curX, oldY, curX, oldY + (curY - oldY) / 2);
  context.bezierCurveTo(curX, curY, oldX, curY, oldX, oldY + (curY - oldY) / 2);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initEqTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointEqTriangle);
}

function deleteEqTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointEqTriangle);
  document.removeEventListener('mousemove', drawEqTriangle);
  document.removeEventListener('mouseup', endPoint);
}

function startPointEqTriangle(e) {
  initFigure(e);

  drawEqTriangle(e);

  document.addEventListener('mousemove', drawEqTriangle);
  document.addEventListener('mouseup', endPoint);
}

function drawEqTriangle(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.lineTo(oldX + (oldX - curX), curY);
  context.lineTo(oldX, oldY);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initRightTriangle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointRightTriangle);
}

function deleteRightTriangle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointRightTriangle);
  document.removeEventListener('mousemove', drawRightTriangle);
  document.removeEventListener('mouseup', endPoint);
}

function startPointRightTriangle(e) {
  initFigure(e);

  drawEqTriangle(e);

  document.addEventListener('mousemove', drawRightTriangle);
  document.addEventListener('mouseup', endPoint);
}

function drawRightTriangle(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.lineTo(oldX, curY);
  context.lineTo(oldX, oldY);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}
