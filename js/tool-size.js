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
