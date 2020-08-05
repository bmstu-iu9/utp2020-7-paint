'use strict';

let toolSizeRange = document.getElementById("toolSizeRange");
let toolSizeText = document.getElementById("toolSizeText");

toolSizeRange.value = curToolSize;
toolSizeText.value = `${curToolSize}px`;

let defaultSize = curToolSize;

toolSizeRange.oninput = () => {
  toolSizeText.value = toolSizeRange.value + 'px';
  toolSizeText.style.background = "white";
}

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

toolSizeText.oninput = () => {
  if (checkSizeToolInput(toolSizeText.value)) {
    toolSizeText.style.background = "white";
    toolSizeRange.value = parseInt(toolSizeText.value);
    curToolSize = parseInt(toolSizeText.value);
  } else {
    toolSizeText.style.background = "#ffd4d4";
    curToolSize = getToolSize(toolSizeText, toolSizeRange);
  }

  function getToolSize(toolSizeText, toolSizeRange) {
    if (parseInt(toolSizeText.value) > toolSizeRange.max) { return toolSizeRange.max; }
    if (parseInt(toolSizeText.value) < toolSizeRange.min) { return toolSizeRange.min; }
    return defaultSize;
  }
}

toolSizeText.onchange = () => {
  if (checkSizeToolInput(toolSizeText.value)) {
    toolSizeText.value = parseInt(toolSizeText.value) + 'px';
    toolSizeRange.value = parseInt(toolSizeText.value);
  } else {
    toolSizeRange.value = curToolSize;
    toolSizeText.value = curToolSize + 'px';
    toolSizeText.style.background = "white";
  }
}

let toolMarkingRange = document.getElementById("toolMarkingRange");
let toolMarkingText = document.getElementById("toolMarkingText");

toolMarkingRange.value = markingInterval;
toolMarkingText.value = `${markingInterval}px`;

let defaultMarking = markingInterval;

toolMarkingRange.oninput = () => {
  toolMarkingText.value = toolMarkingRange.value + 'px';
  toolMarkingText.style.background = "white";
}

toolMarkingRange.onchange = () => { markingInterval = toolMarkingRange.value; }

toolMarkingText.oninput = () => {
  if (checkMarkingToolInput(toolMarkingText.value)) {
    toolMarkingText.style.background = "white";
    toolMarkingRange.value = parseInt(toolMarkingText.value);
    markingInterval = parseInt(toolMarkingText.value);
  } else {
    toolMarkingText.style.background = "#ffd4d4";
    markingInterval = getToolMarking(toolMarkingText, toolMarkingRange);
  }

  function getToolMarking(toolMarkingText, toolMarkingRange) {
    if (parseInt(toolMarkingText.value) > toolMarkingRange.max) { return toolMarkingRange.max; }
    if (parseInt(toolMarkingText.value) < toolMarkingRange.min) { return toolMarkingRange.min; }
    return defaultMarking;
  }
}

toolMarkingText.onchange = () => {
  if (checkMarkingToolInput(toolMarkingText.value)) {
    toolMarkingText.value = parseInt(toolMarkingText.value) + 'px';
    toolMarkingRange.value = parseInt(toolMarkingText.value);
  } else {
    toolMarkingRange.value = markingInterval;
    toolMarkingText.value = markingInterval + 'px';
    toolMarkingText.style.background = "white";
  }
}

let toolAngleRange = document.getElementById("toolAngleRange");
let toolAngleText = document.getElementById("toolAngleText");

toolAngleRange.value = inclinationAngle;
toolAngleText.value = `${inclinationAngle}px`;

let defaultAngle = inclinationAngle;

toolAngleRange.oninput = () => {
  toolAngleText.value = toolAngleRange.value + 'px';
  toolAngleText.style.background = "white";
}

toolAngleRange.onchange = () => { inclinationAngle = toolAngleRange.value; }

toolAngleText.oninput = () => {
  if (checkAngleToolInput(toolAngleText.value)) {
    toolAngleText.style.background = "white";
    toolAngleRange.value = parseInt(toolAngleText.value);
    inclinationAngle = parseInt(toolAngleText.value);
  } else {
    toolAngleText.style.background = "#ffd4d4";
    inclinationAngle = getToolAngle(toolAngleText, toolAngleRange);
  }

  function getToolAngle(toolAngleText, toolAngleRange) {
    if (parseInt(toolAngleText.value) > toolAngleRange.max) { return toolAngleRange.max; }
    if (parseInt(toolAngleText.value) < toolAngleRange.min) { return toolAngleRange.min; }
    return defaultAngle;
  }
}

toolAngleText.onchange = () => {
  if (checkAngleToolInput(toolAngleText.value)) {
    toolAngleText.value = parseInt(toolAngleText.value) + 'px';
    toolAngleRange.value = parseInt(toolAngleText.value);
  } else {
    toolAngleRange.value = inclinationAngle;
    toolAngleText.value = inclinationAngle + 'px';
    toolAngleText.style.background = "white";
  }
}

//

let toolMarkingSizeRange = document.getElementById("toolMarkingSizeRange");
let toolMarkingSizeText = document.getElementById("toolMarkingSizeText");

toolMarkingSizeRange.value = markingSize;
toolMarkingSizeText.value = `${markingSize}px`;

let defaultMarkingSize = markingSize;

toolMarkingSizeRange.oninput = () => {
  toolMarkingSizeText.value = toolMarkingSizeRange.value + 'px';
  toolMarkingSizeText.style.background = "white";
}

toolMarkingSizeRange.onchange = () => { markingSize = toolMarkingSizeRange.value; }

toolMarkingSizeText.oninput = () => {
  if (checkMarkingSizeToolInput(toolMarkingSizeText.value)) {
    toolMarkingSizeText.style.background = "white";
    toolMarkingSizeRange.value = parseInt(toolMarkingSizeText.value);
    markingSize = parseInt(toolMarkingSizeText.value);
  } else {
    toolMarkingSizeText.style.background = "#ffd4d4";
    markingSize = getToolAngle(toolMarkingSizeText, toolMarkingSizeRange);
  }

  function getToolMarkingSize(toolMarkingSizeText, toolMarkingSizeRange) {
    if (parseInt(toolMarkingSizeText.value) > toolMarkingSizeRange.max) { return toolMarkingSizeRange.max; }
    if (parseInt(toolMarkingSizeText.value) < toolMarkingSizeRange.min) { return toolMarkingSizeRange.min; }
    return defaultMarkingSize;
  }
}

toolMarkingSizeText.onchange = () => {
  if (checkMarkingSizeToolInput(toolMarkingSizeText.value)) {
    toolMarkingSizeText.value = parseInt(toolMarkingSizeText.value) + 'px';
    toolMarkingSizeRange.value = parseInt(toolMarkingSizeText.value);
  } else {
    toolMarkingSizeRange.value = markingSize;
    toolMarkingSizeText.value = markingSize + 'px';
    toolMarkingSizeText.style.background = "white";
  }
}

//

function checkSizeToolInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return (regExp.test(str)) &&
         (parseInt(str) <= toolSizeRange.max) &&
         (parseInt(str) >= toolSizeRange.min);
}

function checkMarkingToolInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return (regExp.test(str)) &&
         (parseInt(str) <= toolMarkingRange.max) &&
         (parseInt(str) >= toolMarkingRange.min);
}

function checkAngleToolInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return (regExp.test(str)) &&
         (parseInt(str) <= toolAngleRange.max) &&
         (parseInt(str) >= toolAngleRange.min);
}

function checkMarkingSizeToolInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return (regExp.test(str)) &&
         (parseInt(str) <= toolMarkingSizeRange.max) &&
         (parseInt(str) >= toolMarkingSizeRange.min);
}
