'use strict';

let markingModal = document.getElementById('markingModal');
let openMarkingModal = document.getElementById('marking');
let initialOffset, currentElement;

openMarkingModal.addEventListener('click', toggleMarkingModal);
closeMarkingWithoutSaving.addEventListener('click', toggleMarkingModal);
closeMarkingWithSaving.addEventListener('click', toggleMarkingModal);

function toggleMarkingModal() {
  markingModal.classList.toggle('show-modal');
}

function initCage() {
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';

  startPointCage();
}

function startPointCage() {
  setParameters();
  initialOffset = getInitialOffset();
  context.beginPath();

  drawVertical();
  drawHorizontal();

  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteCage() {
  toolMarkingRange.max = 600;
}

function initVertical() {
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
  toolMarkingRange.max = 300;

  startPointVertical();
}

function startPointVertical() {
  setParameters();
  initialOffset = getInitialOffset();
  context.beginPath();

  drawVertical();

  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteVertical() {
  toolMarkingRange.max = 600;
}

function initHorizontal() {
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';

  startPointHorizontal();
}

function startPointHorizontal() {
  setParameters();
  initialOffset = getInitialOffset();
  context.beginPath();

  drawHorizontal();

  context.stroke();
  context.beginPath();

  rememberState();
  changePreview();
}

function deleteHorizontal() {
  toolMarkingRange.max = 600;
}

function initSingleDiagonal() {
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
  toolMarkingRange.max = 2000;

  startPointSingleDiagonal();
}

function startPointSingleDiagonal() {
  setParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  context.beginPath();

  if (inclinationAngle == 90) {
    drawHorizontal();
  } else if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    drawDiagonal(canvas.height, 0, shift);
  } else if (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    drawDiagonal(0, canvas.height, shift);
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
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
  toolMarkingRange.max = 2000;

  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal() {
  setParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  context.beginPath();

  if (inclinationAngle == 90) {
    drawHorizontal();
  } else if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    drawDiagonal(canvas.height, 0, shift);
    drawDiagonal(0, canvas.height, shift);
  } else if (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = canvas.height * Math.tan(angleInRadians);

    drawDiagonal(canvas.height, 0, shift);
    drawDiagonal(0, canvas.height, shift);
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
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
  toolMarkingRange.max = 300;

  startPointVerticalWavy();
}

function startPointVerticalWavy() {
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
  if (isMarkingButtonClicked()) { undo.click(); }

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
  toolMarkingRange.max = 400;

  startPointHorizontalWavy();
}

function startPointHorizontalWavy() {
  setParameters();
  initialOffset = getInitialOffset();
  context.beginPath();

  let cx = 0;

  for (let cy = initialOffset + markingAmplitude; cy < canvas.height + markingAmplitude; cy += markingInterval) {
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



function drawVertical() {
  for (let x = initialOffset; x < canvas.width; x += markingInterval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
}

function drawHorizontal() {
  for (let x = initialOffset; x < canvas.height; x += markingInterval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
}

function drawDiagonal(drawLineFrom, drawLineTo, shift) {
  for (let x = initialOffset - shift; x < canvas.width + shift; x += markingInterval) {
    context.moveTo(x - shift/2, drawLineFrom);
    context.lineTo(x + shift/2, drawLineTo);
  }
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
  if (activeInstrument.id == 'cage') {
    undo.click();
    startPointCage();
  }
  if (activeInstrument.id == 'vertical') {
    undo.click();
    startPointVertical();
  }
  if (activeInstrument.id == 'horizontal') {
    undo.click();
    startPointHorizontal();
  }
  if (activeInstrument.id == 'singleDiagonal') {
    undo.click();
    startPointSingleDiagonal();
  }
  if (activeInstrument.id == 'doubleDiagonal') {
    undo.click();
    startPointDoubleDiagonal();
  }
  if (activeInstrument.id == 'verticalWavy') {
    undo.click();
    startPointVerticalWavy();
  }
  if (activeInstrument.id == 'horizontalWavy') {
    undo.click();
    startPointHorizontalWavy();
  }
}

function isMarkingButtonClicked() {
  let markingTypes = ['cage', 'vertical', 'horizontal',
                      'singleDiagonal', 'doubleDiagonal',
                      'verticalWavy', 'horizontalWavy']

  return markingTypes.includes(currentElement);
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
  markingSize = parseInt(toolMarkingSizeRange.value);
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
