'use strict';

let initial_offset, currentElement;

function initCage() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 600;
  currentElement = document.getElementById('cage');
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
  toolMarkingRange.max = 600;
}

function initVertical() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 300;
  currentElement = document.getElementById('vertical');
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
  toolMarkingRange.max = 600;
}

function initHorizontal() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 600;
  currentElement = document.getElementById('horizontal');
  startPointHorizontal();
}

function startPointHorizontal(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

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
  toolMarkingRange.max = 600;
}

function initSingleDiagonal() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 2000;
  currentElement = document.getElementById('singleDiagonal');
  startPointSingleDiagonal();
}

function startPointSingleDiagonal(e) {
  setParameters();
  correctInitialOffset();

  let shift, angleInRadians;
  if (inclinationAngle == 90) {
    startPointHorizontal();
  }

  if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    context.beginPath();
    for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, canvas.height);
      context.lineTo(x + shift/2, 0);
    }
  }
  if  (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    context.beginPath();
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

function deleteSingleDiagonal() {
  toolMarkingRange.max = 600;
}

function initDoubleDiagonal() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 2000;
  currentElement = document.getElementById('doubleDiagonal');
  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal(e) {
  setParameters();
  correctInitialOffset();

  let shift, angleInRadians, doubleDiagonalFlag = true;

  if (inclinationAngle == 90) {
    startPointHorizontal();
    doubleDiagonalFlag = false;
  }

  if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
  }
  if  (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
  }
  shift = canvas.height * Math.tan(angleInRadians);

  if (doubleDiagonalFlag == true) {
    context.beginPath();
    for (let x = initial_offset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, canvas.height);
      context.lineTo(x + shift/2, 0);
    }

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

function deleteDoubleDiagonal() {
  toolMarkingRange.max = 600;
}

function initVerticalWavy() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 300;
  currentElement = document.getElementById('verticalWavy');
  startPointVerticalWavy();
}

function startPointVerticalWavy(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let cy = 0;

  for (let cx = initial_offset - markingAmplitude; cx < canvas.width + markingAmplitude; cx += markingInterval) {
    context.moveTo(cx, cy);
    for (let i = 1; i < canvas.height; i++) {
      let y = 3 * i;
      let x = markingAmplitude * Math.sin(6 * i / 180 * Math.PI);
      context.lineTo(cx + x, cy + y);
    }
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteVerticalWavy() {
  toolMarkingRange.max = 600;
}

function initHorizontalWavy() {
  isMarkingButtonClicked();
  toolMarkingRange.max = 600;
  currentElement = document.getElementById('horizontalWavy');
  startPointHorizontalWavy();
}

function startPointHorizontalWavy(e) {
  setParameters();
  correctInitialOffset();
  context.beginPath();

  let cx = 0;

  for (let cy = initial_offset - markingAmplitude; cy < canvas.height + markingAmplitude; cy += markingInterval) {
    context.moveTo(cx, cy);
    for (let i = 1; i < canvas.width; i++) {
      let x = 3 * i;
      let y = markingAmplitude * Math.sin(6 * i / 180 * Math.PI);
      context.lineTo(cx + x, cy + y);
    }
  }
  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteHorizontalWavy() {
  toolMarkingRange.max = 600;
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

function updateButton() {
  if (currentElement == document.getElementById('cage')) {
    undo.click();
    startPointCage();
  }
  if (currentElement == document.getElementById('vertical')) {
    undo.click();
    startPointVertical();
  }
  if (currentElement == document.getElementById('horizontal')) {
    undo.click();
    startPointHorizontal();
  }
  if (currentElement == document.getElementById('singleDiagonal')) {
    undo.click();
    startPointSingleDiagonal();
  }
  if (currentElement == document.getElementById('doubleDiagonal')) {
    undo.click();
    startPointDoubleDiagonal();
  }
  if (currentElement == document.getElementById('verticalWavy')) {
    undo.click();
    startPointVerticalWavy();
  }
  if (currentElement == document.getElementById('horizontalWavy')) {
    undo.click();
    startPointHorizontalWavy();
  }
}

function isMarkingButtonClicked() {
  if (currentElement == document.getElementById('cage')) { undo.click(); }
  if (currentElement == document.getElementById('vertical')) { undo.click(); }
  if (currentElement == document.getElementById('horizontal')) { undo.click(); }
  if (currentElement == document.getElementById('singleDiagonal')) { undo.click(); }
  if (currentElement == document.getElementById('doubleDiagonal')) { undo.click(); }
  if (currentElement == document.getElementById('verticalWavy')) { undo.click(); }
  if (currentElement == document.getElementById('horizontalWavy')) { undo.click(); }
}
