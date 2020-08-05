'use strict';

let shift, initial_offset;

let back = document.getElementById('patternForCanvas');
let ctx = back.getContext('2d');

function initCage() {
  showBackground();
  startPointCage();
}

function initVertical() {
  showBackground();
  startPointVertical();
}

function initHorizontal() {
  showBackground();
  startPointHorizontal();
}

function initDiagonal() {
  showBackground();
  startPointDiagonal();
}

function initDoubleDiagonal() {
  showBackground();
  startPointDoubleDiagonal();
}

function initWavy() {
  showBackground();
  startPointWavy();
}

function deleteCage() {
  canvas.removeEventListener("mousedown", showBackground);
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

function startPointCage() {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.width, x);
  }
  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function startPointVertical(e) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.width; x += markingInterval) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function startPointHorizontal(e) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  for (let x = initial_offset; x < canvas.height; x += markingInterval) {
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.width, x);
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function startPointDiagonal(e) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclinationAngle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + shift, canvas.height);
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function startPointDoubleDiagonal(e) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  shift = canvas.height/Math.tan(inclinationAngle);

  for (let x = initial_offset - shift; x < canvas.width; x += markingInterval) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + shift, canvas.height);
  }

  shift = -canvas.height/Math.tan(inclinationAngle);
  for (let x = initial_offset; x < canvas.width - shift; x += markingInterval) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + shift, canvas.height);
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function startPointWavy(e) {
  context.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = markingSize;
  ctx.strokeStyle = arrayToRgb(curColor);
  correctInitialOffset();

  let cx = 0;
  for (let cy = initial_offset + inclinationAngle; cy < canvas.height + inclinationAngle; cy += markingInterval) {
    ctx.moveTo(cx, cy);
    for (let i = 1; i < canvas.width; i++) {
      let x = 3 * i;
      let y = inclinationAngle * Math.sin(6 * i / 180 * Math.PI);
      ctx.lineTo(cx + x, cy + y);
    }
  }
  ctx.stroke();
  changeButton();

  //rememberState();
  //changePreview();
}

function correctInitialOffset() {
  if (markingSize >= 5) {
    initial_offset = 0.5;
  }
  if (markingSize < 5) {
    initial_offset = -0.5;
  }
}

function changeButton() {
  cage.addEventListener("mousedown", deleteMarking);
  vertical.addEventListener("mousedown", deleteMarking);
  horizontal.addEventListener("mousedown", deleteMarking);
  diagonal.addEventListener("mousedown", deleteMarking);
  doubleDiagonal.addEventListener("mousedown", deleteMarking);
  wavy.addEventListener("mousedown", deleteMarking);
}


function deleteMarking() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //back.style.opacity = 0;
}

function showBackground() {
  if (back.style.opacity) {
    back.style.opacity = 0;
  } else {
    back.style.opacity = 1;
  }
}
