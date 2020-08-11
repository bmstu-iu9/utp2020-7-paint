'use strict';

let newToolValue;

let toolSizeRange = document.getElementById("toolSizeRange");
let toolSizeText = document.getElementById("toolSizeText");
let defaultSize = curToolSize;

toolSizeRange.value = curToolSize;
toolSizeText.value = `${curToolSize}px`;

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

toolSizeRange.oninput = () => { onInputRange(toolSizeText, toolSizeRange); }

toolMarkingRange.oninput = () => { onInputRange(toolMarkingText, toolMarkingRange); }

toolAngleRange.oninput = () => { onInputRange(toolAngleText, toolAngleRange); }

toolMarkingSizeRange.oninput = () => { onInputRange(toolMarkingSizeText, toolMarkingSizeRange); }

toolAmplitudeRange.oninput = () => { onInputRange(toolAmplitudeText, toolAmplitudeRange); }

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

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

toolSizeText.oninput = () => {
  onInputText(toolSizeText, toolSizeRange, defaultSize);
  curToolSize = newToolValue;
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

toolSizeText.onchange = () => { onChangeText(toolSizeText, toolSizeRange, curToolSize); }

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

function onInputRange(toolText, toolRange) {
  toolText.value = toolRange.value + 'px';
  toolText.style.background = "white";
}

function onChangeText(toolText, toolRange, value) {
  let toolSize = toolText.value;
  let maxTS = toolText.max;
  let minTS = toolText.min;

  if (checkPxInput(toolSize, minTS, maxTS)) {
    toolText.value = parseInt(toolSize) + 'px';
    toolRange.value = parseInt(toolSize);
  } else {
    toolRange.value = value;
    toolText.value = value + 'px';
    toolText.style.background = "white";
  }
}

function onInputText(toolText, toolRange, defaultValue) {
  let toolSize = toolText.value;
  let maxTS = toolRange.max;
  let minTS = toolRange.min;

  if (checkPxInput(toolSize, minTS, maxTS)) {
    toolText.style.background = "white";
    toolRange.value = parseInt(toolSize);
    newToolValue = parseInt(toolText.value);
  } else {
    toolText.style.background = "#ffd4d4";
    newToolValue = getTool(parseInt(toolSize), toolRange);
  }

  function getTool(toolNum, toolRange) {
    if (toolNum > toolRange.max) { return toolRange.max; }
    if (toolNum < toolRange.min) { return toolRange.min; }
    return defaultValue;
  }
}
