'use strict';

let newToolValue;

let toolSizeRange = document.getElementById("toolSizeRange");
let toolSizeText = document.getElementById("toolSizeText");
let defaultSize = curToolSize;

toolSizeRange.value = curToolSize;
toolSizeText.value = `${curToolSize}px`;

toolSizeRange.oninput = () => { onInputRange(toolSizeText, toolSizeRange, 'px'); }

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

toolSizeText.oninput = () => {
  onInputText(toolSizeText, toolSizeRange, defaultSize, 'px');
  curToolSize = newToolValue;
}

toolSizeText.onchange = () => { onChangeText(toolSizeText, toolSizeRange, curToolSize, 'px'); }

function onInputRange(toolText, toolRange,  measureUnit) {
  toolText.value = toolRange.value + measureUnit;
  toolText.style.background = "white";
}

function onChangeText(toolText, toolRange, value, measureUnit) {
  let toolSize = toolText.value;
  let maxTS = toolText.max;
  let minTS = toolText.min;
  let flag;

  if (measureUnit == 'px') {
    flag = checkPxInput(toolSize, minTS, maxTS);
  } else if (measureUnit == '°') {
    flag = checkDegreeInput(toolSize, minTS, maxTS);
  }

  if (flag) {
    toolText.value = parseInt(toolSize) + measureUnit;
    toolRange.value = parseInt(toolSize);
  } else {
    toolRange.value = value;
    toolText.value = value + measureUnit;
    toolText.style.background = "white";
  }
}

function onInputText(toolText, toolRange, defaultValue, measureUnit) {
  let toolSize = toolText.value;
  let maxTS = toolRange.max;
  let minTS = toolRange.min;
  let flag;

  if (measureUnit == 'px') {
    flag = checkPxInput(toolSize, minTS, maxTS);
  } else if (measureUnit == '°') {
    flag = checkDegreeInput(toolSize, minTS, maxTS);
  }

  if (flag) {
    toolText.style.background = "white";
    toolRange.value = parseInt(toolSize);
    newToolValue = parseInt(toolText.value);
  } else {
    toolText.style.background = "#ffd4d4";
    newToolValue = getTool(parseInt(toolSize), toolRange);
  }

  function getTool(toolNum, toolRange) {
    if (toolNum > parseInt(toolRange.max)) { return parseInt(toolRange.max); }
    if (toolNum < parseInt(toolRange.min)) { return parseInt(toolRange.min); }
    return defaultValue;
  }
}
