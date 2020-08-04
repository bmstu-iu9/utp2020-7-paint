'use strict';

let shift, initial_offset;
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
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
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
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
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
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
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
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclination_angle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
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
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclination_angle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }

  shift = -canvas.height/Math.tan(inclination_angle);
  for (let x = initial_offset; x < canvas.width - shift; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  context.stroke();
  //changePreview();
}

function correctInitialOffset() {
  if (curToolSize >= 5) {
    initial_offset = 0.5;
  }
  if (curToolSize < 5) {
    initial_offset = -0.5;
  }
}
