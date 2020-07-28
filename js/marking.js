'use strict';

let interval = 100;

function initCage() {
  startPointCage();
}

function initVertical() {
  startPointVertical();
}

function deleteCage() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function deleteVertical() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function startPointCage(e) {
  context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  for (let x = 0.5; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
}

function startPointVertical(e) {
  context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
}
