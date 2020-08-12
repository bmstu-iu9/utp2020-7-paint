'use strict';

let initialOffset, currentElement;

function initCage() {
  isMarkingButtonClicked();

  toolMarkingRange.max = 600;
  currentElement = document.getElementById('cage');

  startPointCage();
}

function startPointCage() {
  setParameters();
  initialOffset = getInitialOffset();
  context.beginPath();

  for (let x = initialOffset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }

  for (let x = initialOffset; x < canvas.width; x += markingInterval) {
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
  initialOffset = getInitialOffset();
  context.beginPath();

  for (let x = initialOffset; x < canvas.width; x += markingInterval) {
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
  initialOffset = getInitialOffset();
  context.beginPath();

  for (let x = initialOffset; x < canvas.height; x += markingInterval) {
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
  initialOffset = getInitialOffset();

  let shift, angleInRadians;
  if (inclinationAngle == 90) {
    startPointHorizontal();
  }

  if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    context.beginPath();
    for (let x = initialOffset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, canvas.height);
      context.lineTo(x + shift/2, 0);
    }
  }
  if  (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    context.beginPath();
    for (let x = initialOffset - shift; x < canvas.width + shift; x += markingInterval) {
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
  initialOffset = getInitialOffset();

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
    for (let x = initialOffset - shift; x < canvas.width + shift; x += markingInterval) {
      context.moveTo(x - shift/2, canvas.height);
      context.lineTo(x + shift/2, 0);
    }

    for (let x = initialOffset - shift; x < canvas.width + shift; x += markingInterval) {
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
  initialOffset = getInitialOffset();
  context.beginPath();

  let cy = 0;

  for (let cx = initialOffset - markingAmplitude; cx < canvas.width + markingAmplitude; cx += markingInterval) {
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
  initialOffset = getInitialOffset();
  context.beginPath();

  let cx = 0;

  for (let cy = initialOffset - markingAmplitude; cy < canvas.height + markingAmplitude; cy += markingInterval) {
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

function getInitialOffset() {
  return (markingSize < 5) ? -0.5 : 0.5;
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

let toolMarkingRange = document.getElementById("toolMarkingRange");
let toolMarkingText = document.getElementById("toolMarkingText");
let defaultMarking = markingInterval;

toolMarkingRange.value = markingInterval;
toolMarkingText.value = `${markingInterval}px`;

let toolAngleRange = document.getElementById("toolAngleRange");
let toolAngleText = document.getElementById("toolAngleText");
let defaultAngle = inclinationAngle;

toolAngleRange.value = inclinationAngle;
toolAngleText.value = `${inclinationAngle}px`;

let toolMarkingSizeRange = document.getElementById("toolMarkingSizeRange");
let toolMarkingSizeText = document.getElementById("toolMarkingSizeText");
let defaultMarkingSize = markingSize;

toolMarkingSizeRange.value = markingSize;
toolMarkingSizeText.value = `${markingSize}px`;

let toolAmplitudeRange = document.getElementById("toolAmplitudeRange");
let toolAmplitudeText = document.getElementById("toolAmplitudeText");
let defaultAmplitude = markingAmplitude;

toolAmplitudeRange.value = markingAmplitude;
toolAmplitudeText.value = `${markingAmplitude}px`;

toolMarkingRange.oninput = () => { onInputRange(toolMarkingText, toolMarkingRange); }

toolAngleRange.oninput = () => { onInputRange(toolAngleText, toolAngleRange); }

toolMarkingSizeRange.oninput = () => { onInputRange(toolMarkingSizeText, toolMarkingSizeRange); }

toolAmplitudeRange.oninput = () => { onInputRange(toolAmplitudeText, toolAmplitudeRange); }


toolMarkingRange.onchange = () => {
  markingInterval = parseInt(toolMarkingRange.value);
  updateButton();
}

toolAngleRange.onchange = () => {
  inclinationAngle = parseInt(toolAngleRange.value);
  updateButton();
}

toolMarkingSizeRange.onchange = () => {
  markingSize = toolMarkingSizeRange.value;
  updateButton();
}

toolAmplitudeRange.onchange = () => {
  markingAmplitude = parseInt(toolAmplitudeRange.value);
  updateButton();
}


toolMarkingText.oninput = () => {
  onInputText(toolMarkingText, toolMarkingRange, defaultMarking);
  markingInterval = newToolValue;
}

toolAngleText.oninput = () => {
  onInputText(toolAngleText, toolAngleRange, defaultAngle);
  inclinationAngle = newToolValue;
}

toolMarkingSizeText.oninput = () => {
  onInputText(toolMarkingSizeText, toolMarkingSizeRange, defaultMarkingSize);
  markingSize = newToolValue;
}

toolAmplitudeText.oninput = () => {
  onInputText(toolAmplitudeText, toolAmplitudeRange, defaultAmplitude);
  markingAmplitude = newToolValue;
}


toolMarkingText.onchange = () => {
  onChangeText(toolMarkingText, toolMarkingRange, markingInterval);
  updateButton();
}

toolAngleText.onchange = () => {
  onChangeText(toolAngleText, toolAngleRange, inclinationAngle);
  updateButton();
}

toolMarkingSizeText.onchange = () => {
  onChangeText(toolMarkingSizeText, toolMarkingSizeRange, markingSize);
  updateButton();
}

toolAmplitudeText.onchange = () => {
  onChangeText(toolAmplitudeText, toolAngleRange, markingAmplitude);
  updateButton();
}
