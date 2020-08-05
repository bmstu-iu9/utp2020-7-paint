'use strict';

let shift, initial_offset;

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

function initWavy() {
  startPointWavy();
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

function deleteWavy() {
  wavy.removeEventListener("mousedown", startPointWavy);
}

function startPointCage(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
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

  rememberState();
  changePreview();
}

function startPointVertical(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function startPointHorizontal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();

  rememberState();
  changePreview();
}

function startPointDiagonal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclinationAngle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x + shift, canvas.height);
  }
  markingContext.stroke();

  rememberState();
  changePreview();
}

function startPointDoubleDiagonal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclinationAngle);

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

function startPointWavy(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = markingSize;
  context.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  let cx = 0;
  for (let cy = inclinationAngle + initial_offset; cy < canvas.height + inclinationAngle; cy += markingInterval) {
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

function correctInitialOffset() {
  if (markingSize >= 5) {
    initial_offset = 0.5;
  }
  if (markingSize < 5) {
    initial_offset = -0.5;
  }
}
