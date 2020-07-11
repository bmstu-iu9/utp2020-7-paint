'use strict'

function initBasicBrush() {
  let isDrawing = false;

  function startPoint(e) {
    isDrawing = true;
    drawBasicBrush(e);
  }

  function endPoint() {
    isDrawing = false;
    context.beginPath();
  }

  function drawBasicBrush(e) {
    if (!isDrawing) return;

    context.lineWidth = curToolSize;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'rgb(' + curColor[0] + ',' + curColor[1] + ',' + curColor[2] + ')';

    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
  }

  canvas.addEventListener("mousedown", startPoint);
  canvas.addEventListener("mousemove", drawBasicBrush);
  canvas.addEventListener("mouseup", endPoint);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPoint);
  canvas.removeEventListener("mousemove", drawBasicBrush);
  canvas.removeEventListener("mouseup", endPoint);
}
