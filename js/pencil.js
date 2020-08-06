'use strict';

let curX, curY, deltaX, deltaY;

let pencilParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
};

function endPoint() {
  context.restore();
  if (isDrawing) {
    rememberState();
    isDrawing = false;
  }
  context.beginPath();
}

function initPencil() {
  canvas.style.cursor = "url('img/cursors/pencil_cursor.png') 0 25, auto";

  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.style.cursor = 'default';

  canvas.removeEventListener("mousedown", startPointPencil);
  document.removeEventListener("mousemove", drawPencil);
  document.removeEventListener("mouseup", endPoint);
}

function startPointPencil(e) {
  e.preventDefault();
  isDrawing = true;

  context.save();
  pencilParameters.oldX = e.offsetX;
  pencilParameters.oldY = e.offsetY;
  deltaX = e.pageX - e.offsetX;
  deltaY = e.pageY - e.offsetY;

  drawPointPencil(e.offsetX, e.offsetY);

  drawPencil(e);

  document.addEventListener("mousemove", drawPencil);
  document.addEventListener("mouseup", endPoint);
}

function drawPencil(e) {
  if (!isDrawing) return;

  curX = e.pageX - deltaX;
  curY = e.pageY - deltaY;

  pencilParameters.newX = e.curX;
  pencilParameters.newY = e.curY;

  pencilParameters.distance = Math.sqrt(Math.pow(curX - pencilParameters.oldX, 2) + Math.pow(curY - pencilParameters.oldY, 2));
  pencilParameters.angle = Math.atan2(curX - pencilParameters.oldX, curY - pencilParameters.oldY);

  for (let i = 0; i < pencilParameters.distance; i++) {
    pencilParameters.newX = Math.floor(pencilParameters.oldX + i * Math.sin(pencilParameters.angle));
    pencilParameters.newY = Math.floor(pencilParameters.oldY + i * Math.cos(pencilParameters.angle));

    drawPointPencil(pencilParameters.newX, pencilParameters.newY);
  }

  pencilParameters.oldX = curX;
  pencilParameters.oldY = curY;

  changePreview();
}

function drawPointPencil(x, y) {
  let radius = Math.floor(curToolSize / 2);
  drawBresenhamCircle();

  function drawBresenhamCircle() {
    context.beginPath();
    context.lineJoin = "miter";
    context.lineCap = "butt";
    context.lineWidth = 1;
    context.strokeStyle = arrayToRgb(curColor);
    let x0 = 0;
    let y0 = radius;
    let delta = 1 - 2 * radius;
    let error = 0;
    while (y0 >= 0) {
      drawLine(x - x0, x + x0, y - y0);
      drawLine(x - x0, x + x0, y + y0);

      error = 2 * (delta + y0) - 1;
      if ((delta < 0) && (error <= 0)) {
        delta += 2 * (++x0) + 1;
        continue;
      }
      if ((delta > 0) && (error > 0)) {
        delta -= 1 + 2 * (--y0);
        continue;
      }
      delta += 2 * (++x0 - --y0);
    }

    context.stroke();

    function drawLine(fromX, toX, y) {
      context.moveTo(fromX, y + 0.5);
      context.lineTo(toX + 1, y + 0.5);
    }
  }
}
