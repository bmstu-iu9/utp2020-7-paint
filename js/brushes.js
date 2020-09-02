'use strict';

let isDrawing = false;
let oldX, oldY, newX, newY, distance, angle;

function startCoordinates(e) {
  e.preventDefault();
  isDrawing = true;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [oldX, oldY] = getCoordsOnCanvas(e);

  context.save();
}

function drawArc(x, y) {
  context.beginPath();
  context.arc(x, y, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();
}

function returnSizeToDefault() {
  context.globalAlpha = '1';
  toolSizeRange.max = 300;
  toolSizeText.value = '5px';
  toolSizeRange.value = 5;
  curToolSize = 5;
}

function initBasicBrush() {
  canvas.style.cursor = 'url(\"img/cursors/basic_brush_cursor.png\") 0 25, auto';
  context.lineWidth = 0.1;

  canvas.addEventListener('mousedown', startPointBasicBrush);
}

function deleteBasicBrush() {
  canvas.style.cursor = 'default';

  canvas.removeEventListener('mousedown', startPointBasicBrush);
  document.removeEventListener('mousemove', drawBasicBrush);
  document.removeEventListener('mouseup', endPoint);
}


function initSmoothBrush() {
  canvas.style.cursor = 'url(\"img/cursors/smooth_brush_cursor.png\") 0 25, auto';

  canvas.addEventListener('mousedown', startPointBasicBrush);
}

function deleteSmoothBrush() {
  canvas.style.cursor = 'default';

  context.globalAlpha = '1';

  canvas.removeEventListener('mousedown', startPointBasicBrush);
  document.removeEventListener('mousemove', drawBasicBrush);
  document.removeEventListener('mouseup', endPoint);
}


function startPointBasicBrush(e) {
  startCoordinates(e);

  if (activeInstrument.id === 'smoothBrush') {
    context.globalAlpha = '0.01';
  }

  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  drawArc(oldX, oldY);

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawBasicBrush(e);

  document.addEventListener('mousemove', drawBasicBrush);
  document.addEventListener('mouseup', endPoint);
}

function drawBasicBrush(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    drawArc(newX, newY);
  }

  oldX = curX;
  oldY = curY;

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initNeonBrush() {
  canvas.style.cursor = 'url(\"img/cursors/neon_brush_cursor.png\") 0 0, auto';

  canvas.addEventListener('mousedown', startPointNeonBrush);
}

function deleteNeonBrush() {
  canvas.style.cursor = 'default';

  canvas.removeEventListener('mousedown', startPointNeonBrush);
  document.removeEventListener('mousemove', drawNeonBrush);
  document.removeEventListener('mouseup', endPoint);

  context.shadowBlur = 0;
}

function startPointNeonBrush(e) {
  e.preventDefault();
  isDrawing = true;

  if (isThereSelection) rememberCanvasWithoutSelection();

  context.save();
  context.lineWidth = curToolSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = arrayToRgb(curColor);
  context.shadowBlur = curToolSize;
  context.shadowColor = arrayToRgb(curColor);

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawNeonBrush(e);

  document.addEventListener('mousemove', drawNeonBrush);
  document.addEventListener('mouseup', endPoint);
}

function drawNeonBrush(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  context.lineTo(curX, curY);
  context.stroke();
  context.beginPath();
  context.moveTo(curX, curY);

  if (isThereSelection) uniteRememberAndSelectedImages();

  changePreview();
}


let pointsCounter, prevPoints;

function initSketchBrush() {
  canvas.style.cursor = 'url(\"img/cursors/sketch-cursor.png\") 0 25, auto';

  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;

  canvas.addEventListener('mousedown', startPointSketchBrush);
}

function deleteSketchBrush() {
  canvas.style.cursor = 'default';

  context.globalAlpha = '1';
  curToolSize = 5;
  toolSizeText.value = '5px';
  toolSizeRange.value = 5;
  toolSizeRange.max = 300;

  canvas.removeEventListener('mousedown', startPointSketchBrush);
  document.removeEventListener('mousemove', drawSketchBrush);
  document.removeEventListener('mouseup', endPoint);
}

function startPointSketchBrush(e) {
  startCoordinates(e);
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);
  context.globalAlpha = '0.1';

  prevPoints = new Array(10);
  pointsCounter = 0;
  prevPoints[pointsCounter] = getCoordsOnCanvas(e);

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawSketchBrush(e);

  document.addEventListener('mousemove', drawSketchBrush);
  document.addEventListener('mouseup', endPoint);
}

function drawSketchBrush(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  pointsCounter++;

  if (pointsCounter === 10) pointsCounter = 0;

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);

  if (prevPoints[pointsCounter]) {
    newX = prevPoints[pointsCounter][0];
    newY = prevPoints[pointsCounter][1];

    context.moveTo(newX, newY);
    context.lineTo(curX, curY);
  }

  context.stroke();

  oldX = curX;
  oldY = curY;

  prevPoints[pointsCounter] = [curX, curY];

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


let dx, dy, d;

function startPointAdvancedBrush(e) {
  startCoordinates(e);

  context.lineWidth = curToolSize;
  context.globalAlpha = '0.1';
  context.strokeStyle = arrayToRgb(curColor);

  prevPoints = [];
  pointsCounter = 0;

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawAdvancedBrush(e);

  document.addEventListener('mousemove', drawAdvancedBrush);
  document.addEventListener('mouseup', endPoint);
}


function drawAdvancedBrush(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  prevPoints[pointsCounter] = [curX, curY];

  context.beginPath();
  context.moveTo(oldX, oldY);
  context.lineTo(curX, curY);
  context.stroke();
  for (let i = 0; i < prevPoints.length; i++) {
    dx = prevPoints[i][0] - prevPoints[pointsCounter][0];
    dy = prevPoints[i][1] - prevPoints[pointsCounter][1];
    d = Math.pow(dx, 2) + Math.pow(dy, 2);

    if (d < 1000) {
      context.beginPath();
      if (activeInstrument.id === 'patternBrush') {
        context.moveTo(prevPoints[pointsCounter][0] + (dx * 0.2), prevPoints[pointsCounter][1] + (dy * 0.2));
        context.lineTo(prevPoints[i][0] - (dx * 0.2), prevPoints[i][1] - (dy * 0.2));
      }
      else if (activeInstrument.id === 'furBrush'){
        context.moveTo(curX + (dx * 0.3), curY + (dy * 0.3));
        context.lineTo(curX - (dx * 0.3), curY - (dy * 0.3));
      }
      context.stroke();
    }
  }

  oldX = curX;
  oldY = curY;

  pointsCounter++;

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initPatternBrush() {
  canvas.style.cursor = 'url(\"img/cursors/pattern_brush_cursor.png\") 0 25, auto';

  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;

  canvas.addEventListener('mousedown', startPointAdvancedBrush);
}

function deletePatternBrush() {
  canvas.style.cursor = 'default';

  returnSizeToDefault();

  canvas.removeEventListener('mousedown', startPointAdvancedBrush);
  document.removeEventListener('mousemove', drawAdvancedBrush);
  document.removeEventListener('mouseup', endPoint);
}


function initFurBrush() {
  canvas.style.cursor = 'url(\"img/cursors/fur_brush_cursor.png\") 0 25, auto';

  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;

  canvas.addEventListener('mousedown', startPointAdvancedBrush);
}

function deleteFurBrush() {
  canvas.style.cursor = 'default';

  returnSizeToDefault();

  canvas.removeEventListener('mousedown', startPointAdvancedBrush);
  document.removeEventListener('mousemove', drawAdvancedBrush);
  document.removeEventListener('mouseup', endPoint);
}


function initRectangleBrush() {
  canvas.style.cursor = 'url(\"img/cursors/rectangle_brush_cursor.png\") 0 25, auto';

  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;

  canvas.addEventListener('mousedown', startPointRectangleBrush);
}

function deleteRectangleBrush() {
  canvas.style.cursor = 'default';

  returnSizeToDefault();

  canvas.removeEventListener('mousedown', startPointRectangleBrush);
  document.removeEventListener('mousemove', drawRectangleBrush);
  document.removeEventListener('mouseup', endPoint);
}

function startPointRectangleBrush(e) {
  startCoordinates(e);

  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawRectangleBrush(e);

  document.addEventListener('mousemove', drawRectangleBrush);
  document.addEventListener('mouseup', endPoint);
}

function drawRectangleBrush(e) {
  let nx, ny, angle;

  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  dx = curX - oldX;
  dy = curY - oldY;
  angle = 1.5;
  nx = Math.cos(angle) * dx - Math.sin(angle) * dy;
  ny = Math.sin(angle) * dx + Math.cos(angle) * dy;

  context.beginPath();
  context.moveTo(oldX - nx, oldY - ny);
  context.lineTo(oldX + nx, oldY + ny);
  context.lineTo(curX + nx, curY + ny);
  context.lineTo(curX - nx, curY - ny);
  context.lineTo(oldX - nx, oldY - ny);
  context.stroke();

  oldX = curX;
  oldY = curY;

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}


function initCircleBrush() {
  canvas.style.cursor = 'url(\"img/cursors/circle_brush_cursor.png\") 0 25, auto';

  curToolSize = 1;
  toolSizeRange.value = 1;
  toolSizeText.value = '1px';
  toolSizeRange.max = 5;

  canvas.addEventListener('mousedown', startPointCircleBrush);
}

function deleteCircleBrush() {
  canvas.style.cursor = 'default';

  returnSizeToDefault();

  canvas.removeEventListener('mousedown', startPointCircleBrush);
  document.removeEventListener('mousemove', drawCircleBrush);
  document.removeEventListener('mouseup', endPoint);
}

function startPointCircleBrush(e) {
  startCoordinates(e);

  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawCircleBrush(e);

  document.addEventListener('mousemove', drawCircleBrush);
  document.addEventListener('mouseup', endPoint);
}

function drawCircleBrush(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCoordsOnCanvas(e);

  dx = curX - oldX;
  dy = curY - oldY;
  d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  context.beginPath();
  context.arc(curX, curY, d, 0, Math.PI * 2, true);
  context.stroke();

  oldX = curX;
  oldY = curY;

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}
