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
  canvas.style.cursor = 'url(\"img/cursors/eraser_cursor.png\") 0 25, auto';

  canvas.addEventListener('mousedown', startPointEraser);
}

function deleteEraser() {
  canvas.style.cursor = 'default';

  canvas.removeEventListener('mousedown', startPointEraser);
  document.removeEventListener('mousemove', drawEraser);
  document.removeEventListener('mouseup', endPoint);

  context.globalCompositeOperation = 'source-over';
}

function startPointEraser(e) {
  e.preventDefault();
  isDrawing = true;

  if (isThereSelection) rememberCanvasWithoutSelection();

  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;
  deltaX = e.pageX - e.offsetX;
  deltaY = e.pageY - e.offsetY;

  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.lineWidth = 0.1;
  context.fillStyle = arrayToRgb(curColor);
  context.strokeStyle = arrayToRgb(curColor);

  context.beginPath();
  context.arc(eraserParameters.oldX, eraserParameters.oldY, curToolSize / 2, 0, Math.PI * 2, false);
  context.fill();
  context.stroke();
  context.closePath();

  if (isThereSelection) uniteRememberAndSelectedImages();

  drawEraser(e);

  document.addEventListener('mousemove', drawEraser);
  document.addEventListener('mouseup', endPoint);
}

function drawEraser(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  curX = e.pageX - deltaX;
  curY = e.pageY - deltaY;

  context.globalCompositeOperation = 'destination-out';

  eraserParameters.distance = Math.sqrt(Math.pow(curX - eraserParameters.oldX, 2) + Math.pow(curY - eraserParameters.oldY, 2));
  eraserParameters.angle = Math.atan2(curX - eraserParameters.oldX, curY - eraserParameters.oldY);

  for (let i = 0; i < eraserParameters.distance; i++) {
    eraserParameters.newX = eraserParameters.oldX + i * Math.sin(eraserParameters.angle);
    eraserParameters.newY = eraserParameters.oldY + i * Math.cos(eraserParameters.angle);
    context.beginPath();
    context.arc(eraserParameters.newX, eraserParameters.newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  }

  eraserParameters.oldX = curX;
  eraserParameters.oldY = curY;

  context.globalCompositeOperation = 'source-over';

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}
