'use strict';

let initial_offset;

function initCage() {
  startPointCage();
}

function startPointCage() {
  setParameters();
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

  rememberState();
  changePreview();
}

function deleteCage() {
  cage.removeEventListener("mousedown", startPointCage);
}

function initVertical() {
  startPointVertical();
}

function startPointVertical(e) {
  setParameters();
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function deleteVertical() {
  vertical.removeEventListener("mousedown", startPointVertical);
}

function initHorizontal() {
  startPointHorizontal();
}

function startPointHorizontal(e) {
  setParameters();
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function deleteHorizontal() {
  horizontal.removeEventListener("mousedown", startPointHorizontal);
}

function initDiagonal() {
  startPointDiagonal();
}

function startPointDiagonal(e) {
  setParameters();
  correctInitialOffset();

  let shift = canvas.height/Math.tan(inclinationAngle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function deleteDiagonal() {
  diagonal.removeEventListener("mousedown", startPointDiagonal);
}

function initDoubleDiagonal() {
  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal(e) {
  setParameters();
  correctInitialOffset();

  let shift = canvas.height/Math.tan(inclinationAngle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }

  shift = -canvas.height/Math.tan(inclinationAngle);
  for (let x = initial_offset; x < canvas.width - shift; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function deleteDoubleDiagonal() {
  doubleDiagonal.removeEventListener("mousedown", startPointDoubleDiagonal);
}

function initWavy() {
  startPointWavy();
}

function startPointWavy(e) {
  setParameters();
  correctInitialOffset();

  let cx = 0;
  for (let cy = initial_offset + inclinationAngle; cy < canvas.height + inclinationAngle; cy += markingInterval) {
    context.moveTo(cx, cy);
    for (let i = 1; i < canvas.width; i++) {
      let x = 3 * i;
      let y = inclinationAngle * Math.sin(6 * i / 180 * Math.PI);
      context.lineTo(cx + x, cy + y);
    }
  }
  context.stroke();

  rememberState();
  changePreview();
}

function deleteWavy() {
  wavy.removeEventListener("mousedown", startPointWavy);
}

function correctInitialOffset() {
  if (markingSize < 5) {
    initial_offset = -0.5;
  } else {
    initial_offset = 0.5;
  }
}

function setParameters() {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
}
