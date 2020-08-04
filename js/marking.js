'use strict';

let shift;
let interval = 100;
let inclination_angle = 45;

function initCage() {
  startPointCage();
}

function initVertical() {
  startPointVertical();
}

function initHorizontal() {
  startPointHorizontal();
}

function initDiagonal() {
  startPointDiagonal();
}

function initDoubleDiagonal() {
  startPointDoubleDiagonal();
}

function deleteCage() {
  cage.removeEventListener("mousedown", startPointCage);
}

function deleteVertical() {
  vertical.removeEventListener("mousedown", startPointVertical);
}

function deleteHorizontal() {
  horizontal.removeEventListener("mousedown", startPointHorizontal);
}

function deleteDiagonal() {
  diagonal.removeEventListener("mousedown", startPointDiagonal);
}

function deleteDoubleDiagonal() {
  doubleDiagonal.removeEventListener("mousedown", startPointDoubleDiagonal);
}

function startPointCage(e) {
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
  //changePreview();
}

function startPointVertical(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
  //changePreview();
}

function startPointHorizontal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();
  //changePreview();
}

function startPointDiagonal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);
  shift = canvas.height/Math.tan(inclination_angle);

  for (let x = 0.5 - shift; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  markingContext.stroke();
  //changePreview();
}

function startPointDoubleDiagonal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);
  shift = canvas.height/Math.tan(inclination_angle);

  for (let x = 0.5 - shift; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }

  shift = -canvas.height/Math.tan(inclination_angle);
  for (let x = 0.5; x < canvas.width - shift; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  context.stroke();
  //changePreview();
}
