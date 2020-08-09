'use strict';

let initial_offset, inter;

function initCage() {
  startPointCage();
}

function startPointCage() {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteCage() {
  cage.removeEventListener('mousedown', undo.click());
}

function initVertical() {
  startPointVertical();
}

function startPointVertical(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteVertical() {
  vertical.removeEventListener('mousedown', undo.click());
}

function initHorizontal() {
  startPointHorizontal();
}

function startPointHorizontal(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let inter = markingInterval;
  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteHorizontal() {
  horizontal.removeEventListener('mousedown', undo.click());
}

function initDiagonal() {
  startPointDiagonal();
}

function startPointDiagonal(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let shift, angleInRadians;
  if (inclinationAngle == 90) {
    startPointHorizontal();
  }
  if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, canvas.height);
      context.lineTo(x + shift/2, 0);
    }
  }
  if  (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, 0);
      context.lineTo(x + shift/2, canvas.height);
    }
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteDiagonal() {
  diagonal.removeEventListener('mousedown', undo.click());
}

function initDoubleDiagonal() {
  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let shift, angleInRadians;

  angleInRadians = inclinationAngle * Math.PI / 180;
  shift = canvas.height * Math.tan(angleInRadians);

  for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
    context.moveTo(x - shift/2, canvas.height);
    context.lineTo(x + shift/2, 0);
  }

  for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
    context.moveTo(x - shift/2, 0);
    context.lineTo(x + shift/2, canvas.height);
  }

  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteDoubleDiagonal() {
  doubleDiagonal.removeEventListener('mousedown', undo.click());
}

function initWavy() {
  startPointWavy();
}

function startPointWavy(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let cx = 0;

  for (let cy = initial_offset - inclinationAngle; cy < canvas.height + inclinationAngle; cy += markingInterval) {
    context.moveTo(cx, cy);
    for (let i = 1; i < canvas.width; i++) {
      let x = 3 * i;
      let y = inclinationAngle * Math.sin(6 * i / 180 * Math.PI);
      context.lineTo(cx + x, cy + y);
    }
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteWavy() {
  wavy.removeEventListener('mousedown', undo.click());
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
