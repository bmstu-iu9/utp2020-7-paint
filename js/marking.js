'use strict';

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
let maxMarkingCanvasHeight = document.getElementById('markingCanvasWrapper').clientHeight;
let maxMarkingCanvasWidth = document.getElementById('markingCanvasWrapper').clientWidth;

let initialOffset, markingColor, curMarking = null;

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

  markingColor = 'black';
  markingColorBtn.style.background = 'black';

  disableMarkingTextAndRange(true, true, true);

  markingCanvas.setAttribute('width', canvas.width);
  markingCanvas.setAttribute('height', canvas.height);

  markingContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);

  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(canvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);

  deletingChangesMarking.addEventListener('click', deleteChangesMarking);
  closeMarkingWithSaving.addEventListener('click', closeModalWithSaving);
  closeMarkingWithoutSaving.addEventListener('click', closeModalWithoutSaving);

  addEventListener('keydown', escapeExitMarking);

  function escapeExitMarking(event) {
    if (event.code === 'Escape') {
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
    deletingChangesMarking.removeEventListener('click', deleteChangesMarking);
    closeMarkingWithSaving.removeEventListener('click', closeModalWithSaving);
    closeMarkingWithoutSaving.removeEventListener('click', closeModalWithoutSaving);
  }

  function deleteChangesMarking() {
    markingContext.clearRect(0, 0, markingCanvas.width, markingCanvas.height);
    markingContext.drawImage(canvas, 0, 0, markingCanvas.width, markingCanvas.height);
    markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
    markingModalContext.drawImage(canvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
  }
}

function applyInitialMarkingState() {
  markingContext.clearRect(0, 0, markingCanvas.width, markingCanvas.height);
  markingContext.drawImage(canvas, 0, 0, markingCanvas.width, markingCanvas.height);
  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
}

function endMarking() {
  markingModalContext.clearRect(0, 0, markingModalCanvas.width, markingModalCanvas.height);
  markingModalContext.drawImage(markingCanvas, 0, 0, markingModalCanvas.width, markingModalCanvas.height);
}


const allMarkings = ['cage','vertical', 'horizontal', 'singleDiagonal',
 'doubleDiagonal', 'verticalWavy', 'horizontalWavy'];

 allMarkings.forEach((marking) => {
   let button = document.getElementById(marking);
   button.onclick = window['init' + firstToUpper(marking)];
 });

function initCage() {
  setTextAndRangeParameters();
  curMarking = 'cage';

  disableMarkingTextAndRange(false, true, true);
  startPointCage();
}

function startPointCage() {
  applyInitialMarkingState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawVertical();
  drawHorizontal();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
}



function initVertical() {
  setTextAndRangeParameters();
  curMarking = 'vertical';
  toolMarkingRange.max = 600;

  disableMarkingTextAndRange(false, true, true);
  startPointVertical();
}

function startPointVertical() {
  applyInitialMarkingState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawVertical();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
}



function initHorizontal() {
  setTextAndRangeParameters();
  curMarking = 'horizontal';
  toolMarkingRange.max = 300;

  disableMarkingTextAndRange(false, true, true);
  startPointHorizontal();
}

function startPointHorizontal() {
  applyInitialMarkingState();

  setContextParameters();
  initialOffset = getInitialOffset();
  markingContext.beginPath();

  drawHorizontal();

  markingContext.stroke();
  markingContext.beginPath();

  endMarking();
}



function initSingleDiagonal() {
  setTextAndRangeParameters();
  curMarking = 'singleDiagonal';

  toolMarkingRange.max = 600;
  inclinationAngle = 45;
  toolAngleRange.value = 45;
  toolAngleText.value = '45°';

  disableMarkingTextAndRange(false, false, true);
  startPointSingleDiagonal();
}

function startPointSingleDiagonal() {
  applyInitialMarkingState();

  setContextParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  markingContext.beginPath();

  if (inclinationAngle === 90) {
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
}



function initDoubleDiagonal() {
  setTextAndRangeParameters();
  curMarking = 'doubleDiagonal';

  toolMarkingRange.max = 600;
  inclinationAngle = 45;
  toolAngleRange.value = 45;
  toolAngleText.value = '45°';

  disableMarkingTextAndRange(false, false, true);
  startPointDoubleDiagonal();
}

function startPointDoubleDiagonal() {
  applyInitialMarkingState();

  setContextParameters();
  initialOffset = getInitialOffset();

  let shift, angleInRadians;

  markingContext.beginPath();

  if (inclinationAngle === 90) {
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
}



function initVerticalWavy() {
  setTextAndRangeParameters();
  curMarking = 'verticalWavy';

  toolMarkingRange.max = 400;
  markingAmplitude = 45;
  toolAmplitudeRange.value = 45;
  toolAmplitudeText.value = '45°';

  disableMarkingTextAndRange(false, true, false);
  startPointVerticalWavy();
}

function startPointVerticalWavy() {
  applyInitialMarkingState();

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
}



function initHorizontalWavy() {
  setTextAndRangeParameters();
  curMarking = 'horizontalWavy';

  toolMarkingRange.max = 400;
  markingAmplitude = 45;
  toolAmplitudeRange.value = 45;
  toolAmplitudeText.value = '45°';

  disableMarkingTextAndRange(false, true, false);
  startPointHorizontalWavy();
}

function startPointHorizontalWavy() {
  applyInitialMarkingState();

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
  if (curMarking === null) return;
  window["startPoint" + firstToUpper(curMarking)]();
}

function disableMarkingTextAndRange(isDisabledMarkingSizeAndInterval, isDisabledAngle, isDisabledAmplitude) {
  document.getElementById('toolMarkingSizeText').disabled = isDisabledMarkingSizeAndInterval;
  document.getElementById('toolMarkingSizeRange').disabled = isDisabledMarkingSizeAndInterval;

  document.getElementById('toolMarkingText').disabled = isDisabledMarkingSizeAndInterval;
  document.getElementById('toolMarkingRange').disabled = isDisabledMarkingSizeAndInterval;

  document.getElementById('toolAngleText').disabled = isDisabledAngle;
  document.getElementById('toolAngleRange').disabled = isDisabledAngle;

  document.getElementById('toolAmplitudeText').disabled = isDisabledAmplitude;
  document.getElementById('toolAmplitudeRange').disabled = isDisabledAmplitude;
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
