'use strict'

let isDrawing = false;

function initBasicBrush() {
  canvas.addEventListener("mousedown", startPointBasic);
}

function deleteBasicBrush() {
  canvas.removeEventListener("mousedown", startPointBasic);
  canvas.removeEventListener("mousemove", drawLine);
  canvas.removeEventListener("mouseup", endPoint);
}

function startPointBasic(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = 'rgb(' + curColor[0] + ',' + curColor[1] + ',' + curColor[2] + ')';

  drawLine(e);

  canvas.addEventListener("mousemove", drawLine);
  canvas.addEventListener("mouseup", endPoint);
}

function endPoint() {
  isDrawing = false;
  context.beginPath();
}

function drawLine(e) {
  if (!isDrawing) return;

  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  context.beginPath();
  context.moveTo(e.offsetX, e.offsetY);
}


function initNeonBrush() {
  canvas.addEventListener("mousedown", startPointNeon);
}

function deleteNeonBrush() {
  canvas.removeEventListener("mousedown", startPointNeon);
  canvas.removeEventListener("mousemove", drawLine);
  canvas.removeEventListener("mouseup", endPoint);
  context.shadowBlur = 0;
}

function startPointNeon(e) {
  isDrawing = true;

  context.lineWidth = curToolSize;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.strokeStyle = 'rgb(' + curColor[0] + ',' + curColor[1] + ',' + curColor[2] + ')';
  context.shadowBlur = curToolSize + 2;
  context.shadowColor = 'rgb(' + curColor[0] + ',' + curColor[1] + ',' + curColor[2] + ')';

  drawLine(e);

  canvas.addEventListener("mousemove", drawLine);
  canvas.addEventListener("mouseup", endPoint);
}