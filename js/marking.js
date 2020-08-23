'use strict';

let undoMarking = document.getElementById('undoMarking');
let redoMarking = document.getElementById('redoMarking');
let deletingChangesMarking = document.getElementById('deletingChangesMarking');

let markingModal = document.getElementById('markingModal');
let openMarkingModal = document.getElementById('marking');

openMarkingModal.addEventListener('click', openModalMarking);
closeMarkingWithoutSaving.addEventListener('click', closeModalMarking);
closeMarkingWithSaving.addEventListener('click', closeModalMarking);

let markingModalCanvas = document.getElementById('markingModalCanvas');
let markingModalContext = markingModalCanvas.getContext('2d');
markingModalCanvas.setAttribute('width', markingModalCanvas.width);
markingModalCanvas.setAttribute('height', markingModalCanvas.height);

let markingCanvas = document.createElement('canvas');
let markingContext = markingCanvas.getContext('2d');

let markingHistory = [], curStateMarking;

let maxMarkingCanvasHeight = document.getElementById('markingCanvasWrapper').clientHeight;
let maxMarkingCanvasWidth = document.getElementById('markingCanvasWrapper').clientWidth;

let initialOffset, markingColor, curMarking = null;

const allMarkings = ['cage','vertical', 'horizontal', 'singleDiagonal',
 'doubleDiagonal', 'verticalWavy', 'horizontalWavy'];

 allMarkings.forEach((marking) => {
   let button = document.getElementById(mark);
   button.onclick = window['init' + firstToUpper(marking)];
 });


function openModalMarking() {
  markingModal.classList.toggle('show-modal');
  useMarkingModal();
}

function closeModalMarking() {
  markingModal.classList.toggle('show-modal');
}

function useMarkingModal() {
  originalCanvas = canvas;

  changeModalCanvasSize(maxMarkingCanvasHeight, maxMarkingCanvasWidth, markingModalCanvas);

  markingHistory = [];
  curStateMarking = -1;
  markingColor = 'black';
  markingColorBtn.style.background = 'black';

  disabledMarkingAndMarkingSize(true);
  disabledAngle(true);
  disabledAmplitude(true);

  markingCanvas.setAttribute('width', canvas.width);
  markingCanvas.setAttribute('height', canvas.height);

  markingContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);

  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(canvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);

  undoMarking.addEventListener('click', applyPrevState);
  redoMarking.addEventListener('click', applyNextState);

  deletingChangesMarking.addEventListener('click', deleteChangesMarking);
  closeMarkingWithSaving.addEventListener('click', closeModalWithSaving);
  closeMarkingWithoutSaving.addEventListener('click', closeModalWithoutSaving);

  rememberMarkingState();
}

addEventListener('keydown', escapeExitMarking);

function escapeExitMarking(event) {
  if (event.code == 'Escape') {
    closeMarkingWithoutSaving.click();
  }
}

function closeModalWithoutSaving() {
  canvas = originalCanvas;
  context = canvas.getContext('2d');

  deleteMarking();
  removeEventListener('keydown', escapeExitMarking);
}

function closeModalWithSaving() {
  let originalContext = originalCanvas.getContext('2d');
  originalContext.putImageData(markingContext.getImageData(0, 0, markingCanvas.width, markingCanvas.height), 0, 0);
  canvas = originalCanvas;
  context = canvas.getContext('2d');

  rememberState();
  deleteMarking();
  changePreview();
}

function deleteMarking() {
  undoMarking.removeEventListener('click', applyPrevState);
  redoMarking.removeEventListener('click', applyNextState);
  deletingChangesMarking.removeEventListener('click', deleteChangesMarking);
  closeMarkingWithSaving.removeEventListener('click', closeModalWithSaving);
  closeMarkingWithoutSaving.removeEventListener('click', closeModalWithoutSaving);
}

function applyPrevState() {
  if (curStateMarking > 0) {
    --curStateMarking;
    markingContext.putImageData(markingHistory[curStateMarking], 0, 0);
    markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
    markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
  }
}

function applyNextState() {
  if (curStateMarking + 1 < markingHistory.length) {
    ++curStateMarking;
    markingContext.putImageData(markingHistory[curStateMarking], 0, 0);
    markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
    markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
  }
}

function endMarking() {
  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
}

function rememberMarkingState() {
  markingHistory = markingHistory.slice(0, curStateMarking + 1);
  markingHistory.push(markingContext.getImageData(0, 0, markingCanvas.width, markingCanvas.height));
  ++curStateMarking;
}

function deleteChangesMarking() {
  markingContext.putImageData(markingHistory[0], 0, 0);
  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingHistory = markingHistory.slice(0, 1);
  curStateMarking = 0;
}

function initCage() {
  curMarking = 'cage';

  setTextAndRangeParameters();

  disabledMarkingAndMarkingSize(false);
  disabledAngle(true);
  disabledAmplitude(true);

  startPointCage();
}

function startPointCage() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawVertical();
  drawHorizontal();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initVertical() {
  curMarking = 'vertical';

  setTextAndRangeParameters();
  toolMarkingRange.max = 600;

  disabledMarkingAndMarkingSize(false);
  disabledAngle(true);
  disabledAmplitude(true);

  startPointVertical();
}

function startPointVertical() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawVertical();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initHorizontal() {
  curMarking = 'horizontal';

  setTextAndRangeParameters();
  toolMarkingRange.max = 300;

  disabledMarkingAndMarkingSize(false);
  disabledAngle(true);
  disabledAmplitude(true);

  startPointHorizontal();
}

function startPointHorizontal() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawHorizontal();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initSingleDiagonal() {
  curMarking = 'singleDiagonal';

  setTextAndRangeParameters();
  toolMarkingRange.max = 600;
  inclinationAngle = 45;
  toolAngleRange.value = 45;
  toolAngleText.value = '45°';

  disabledMarkingAndMarkingSize(false);
  disabledAngle(false);
  disabledAmplitude(true);

  startPointSingleDiagonal();
}

function startPointSingleDiagonal() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  markingContext.beginPath();

  if (inclinationAngle == 90) {
    drawHorizontal();
  } else if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = markingCanvas.height * Math.tan(angleInRadians);

    drawDiagonal(markingCanvas.height, 0, shift);
  } else if (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = markingCanvas.height * Math.tan(angleInRadians);

    drawDiagonal(0, markingCanvas.height, shift);
  }

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initDoubleDiagonal() {
  curMarking = 'doubleDiagonal';

  setTextAndRangeParameters();
  toolMarkingRange.max = 600;
  inclinationAngle = 45;
  toolAngleRange.value = 45;
  toolAngleText.value = '45°';

  disabledMarkingAndMarkingSize(false);
  disabledAngle(false);
  disabledAmplitude(true);

  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  markingContext.beginPath();

  if (inclinationAngle == 90) {
    drawHorizontal();
  } else if (inclinationAngle < 90) {
    angleInRadians = inclinationAngle * Math.PI / 180;
    shift = markingCanvas.height * Math.tan(angleInRadians);

    drawDiagonal(markingCanvas.height, 0, shift);
    drawDiagonal(0, markingCanvas.height, shift);
  } else if (inclinationAngle > 90) {
    angleInRadians = (180 - inclinationAngle) * Math.PI / 180;
    shift = markingCanvas.height * Math.tan(angleInRadians);

    drawDiagonal(markingCanvas.height, 0, shift);
    drawDiagonal(0, markingCanvas.height, shift);
  }

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initVerticalWavy() {
  curMarking = 'verticalWavy';

  setTextAndRangeParameters();
  toolMarkingRange.max = 400;
  markingAmplitude = 45;
  toolAmplitudeRange.value = 45;
  toolAmplitudeText.value = '45°';

  disabledMarkingAndMarkingSize(false);
  disabledAmplitude(false);
  disabledAngle(true);

  startPointVerticalWavy();
}

function startPointVerticalWavy() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  let cy = 0;

  for (let cx = initialOffset - markingAmplitude; cx < markingCanvas.width + markingAmplitude; cx += markingInterval) {
    markingContext.moveTo(cx, cy);
    for (let i = 1; i < markingCanvas.height; i++) {
      let y = 3 * i;
      let x = markingAmplitude * Math.sin(6 * i / 180 * Math.PI);
      markingContext.lineTo(cx + x, cy + y);
    }
  }

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function initHorizontalWavy() {
  curMarking = 'horizontalWavy';

  setTextAndRangeParameters();
  toolMarkingRange.max = 400;
  markingAmplitude = 45;
  toolAmplitudeRange.value = 45;
  toolAmplitudeText.value = '45°';

  disabledMarkingAndMarkingSize(false);
  disabledAmplitude(false);
  disabledAngle(true);

  startPointHorizontalWavy();
}

function startPointHorizontalWavy() {
  applyPrevState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  let cx = 0;

  for (let cy = initialOffset - markingAmplitude; cy < markingCanvas.height + markingAmplitude; cy += markingInterval) {
    markingContext.moveTo(cx, cy);
    for (let i = 1; i < markingCanvas.width; i++) {
      let x = 3 * i;
      let y = markingAmplitude * Math.sin(6 * i / 180 * Math.PI);
      markingContext.lineTo(cx + x, cy + y);
    }
  }

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
  rememberMarkingState();
}



function drawVertical() {
  for (let x = initialOffset; x < markingCanvas.width + markingInterval; x += markingInterval) {
    markingContext.moveTo(x, 0);
    markingContext.lineTo(x, markingCanvas.height);
  }
}

function drawHorizontal() {
  for (let x = initialOffset; x < markingCanvas.height + markingInterval; x += markingInterval) {
    markingContext.moveTo(0, x);
    markingContext.lineTo(markingCanvas.width, x);
  }
}

function drawDiagonal(drawLineFrom, drawLineTo, shift) {
  let newInterval = shift / 5 + markingInterval;
  for (let x = initialOffset - shift; x < markingCanvas.width + shift; x += newInterval) {
    markingContext.moveTo(x - shift/2, drawLineFrom);
    markingContext.lineTo(x + shift/2, drawLineTo);
  }
}

function setContextParameters() {
  markingContext.lineCap = "round";
  markingContext.lineJoin = "round";
  markingContext.lineWidth = markingSize;
  markingContext.strokeStyle = arrayToRgb(markingColor);
}

function setTextAndRangeParameters() {
  markingSize = 1;
  toolMarkingSizeRange.value = 1;
  toolMarkingSizeText.value = '1px';

  markingInterval = 100;
  toolMarkingRange.value = 100;
  toolMarkingText.value = '100px';
}

function getInitialOffset() {
  return (markingSize < 5) ? -0.5 : (markingSize / 2);
}

function updateButton() {
  window["startPoint" + firstToUpper(curMarking)]();
}

function disabledMarkingAndMarkingSize(trueOrFalse) {
  document.getElementById('toolMarkingSizeText').disabled = trueOrFalse;
  document.getElementById('toolMarkingSizeRange').disabled = trueOrFalse;

  document.getElementById('toolMarkingText').disabled = trueOrFalse;
  document.getElementById('toolMarkingRange').disabled = trueOrFalse;
}

function disabledAngle(trueOrFalse) {
  document.getElementById('toolAngleText').disabled = trueOrFalse;
  document.getElementById('toolAngleRange').disabled = trueOrFalse;
}

function disabledAmplitude(trueOrFalse) {
  document.getElementById('toolAmplitudeText').disabled = trueOrFalse;
  document.getElementById('toolAmplitudeRange').disabled = trueOrFalse;
}



let toolMarkingRange = document.getElementById("toolMarkingRange");
let toolMarkingText = document.getElementById("toolMarkingText");
let defaultMarking = markingInterval;

toolMarkingRange.value = markingInterval;
toolMarkingText.value = `${markingInterval}px`;

let toolMarkingSizeRange = document.getElementById("toolMarkingSizeRange");
let toolMarkingSizeText = document.getElementById("toolMarkingSizeText");
let defaultMarkingSize = markingSize;

toolMarkingSizeRange.value = markingSize;
toolMarkingSizeText.value = `${markingSize}px`;

let toolAngleRange = document.getElementById("toolAngleRange");
let toolAngleText = document.getElementById("toolAngleText");
let defaultAngle = inclinationAngle;

toolAngleRange.value = inclinationAngle;
toolAngleText.value = `${inclinationAngle}°`;

let toolAmplitudeRange = document.getElementById("toolAmplitudeRange");
let toolAmplitudeText = document.getElementById("toolAmplitudeText");
let defaultAmplitude = markingAmplitude;

toolAmplitudeRange.value = markingAmplitude;
toolAmplitudeText.value = `${markingAmplitude}°`;



toolMarkingRange.oninput = () => { onInputRange(toolMarkingText, toolMarkingRange, 'px'); }

toolMarkingSizeRange.oninput = () => { onInputRange(toolMarkingSizeText, toolMarkingSizeRange, 'px'); }

toolAngleRange.oninput = () => { onInputRange(toolAngleText, toolAngleRange, '°'); }

toolAmplitudeRange.oninput = () => { onInputRange(toolAmplitudeText, toolAmplitudeRange, '°'); }



toolMarkingText.oninput = () => {
  onInputText(toolMarkingText, toolMarkingRange, defaultMarking, 'px');
  markingInterval = newToolValue;
}

toolMarkingSizeText.oninput = () => {
  onInputText(toolMarkingSizeText, toolMarkingSizeRange, defaultMarkingSize, 'px');
  markingSize = newToolValue;
}

toolAngleText.oninput = () => {
  onInputText(toolAngleText, toolAngleRange, defaultAngle, '°');
  inclinationAngle = newToolValue;
}

toolAmplitudeText.oninput = () => {
  onInputText(toolAmplitudeText, toolAmplitudeRange, defaultAmplitude, '°');
  markingAmplitude = newToolValue;
}



toolMarkingRange.onchange = () => {
  markingInterval = parseInt(toolMarkingRange.value);
  updateButton();
}

toolMarkingSizeRange.onchange = () => {
  markingSize = parseInt(toolMarkingSizeRange.value);
  updateButton();
}

toolAngleRange.onchange = () => {
  inclinationAngle = parseInt(toolAngleRange.value);
  updateButton();
}

toolAmplitudeRange.onchange = () => {
  markingAmplitude = parseInt(toolAmplitudeRange.value);
  updateButton();
}



toolMarkingText.onchange = () => {
  onChangeText(toolMarkingText, toolMarkingRange, markingInterval, 'px');
  updateButton();
}

toolMarkingSizeText.onchange = () => {
  onChangeText(toolMarkingSizeText, toolMarkingSizeRange, markingSize, 'px');
  updateButton();
}

toolAngleText.onchange = () => {
  onChangeText(toolAngleText, toolAngleRange, inclinationAngle, '°');
  updateButton();
}

toolAmplitudeText.onchange = () => {
  onChangeText(toolAmplitudeText, toolAngleRange, markingAmplitude, '°');
  updateButton();
}

function checkDegreeInput(str, min, max) {
  const degreeInputRegExp = new RegExp(`^\\d+(°|)$`, 'i');
  return  degreeInputRegExp.test(str) &&
         (parseInt(str) >= min) &&
         (parseInt(str) <= max);
}



let markingColorInput = document.getElementById('markingColor');
let markingColorBtn = document.getElementById('markingColorBtn');

markingColorInput.addEventListener('input', () => {
  let color = markingColorInput.value;
  markingColor = hexToRgb(color);
  markingColorBtn.style.background = color;
  updateButton();
});

markingColorBtn.onclick = () => { markingColorInput.click(); markingColorInput.focus(); }
