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

toolSizeRange.oninput = () => { onInputRange(toolSizeText, toolSizeRange); }

toolMarkingRange.oninput = () => { onInputRange(toolMarkingText, toolMarkingRange); }

toolAngleRange.oninput = () => { onInputRange(toolAngleText, toolAngleRange); }

toolMarkingSizeRange.oninput = () => { onInputRange(toolMarkingSizeText, toolMarkingSizeRange); }

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

toolMarkingRange.onchange = () => { markingInterval = toolMarkingRange.value; }

toolAngleRange.onchange = () => { inclinationAngle = toolAngleRange.value; }

toolMarkingSizeRange.onchange = () => { markingSize = toolMarkingSizeRange.value; }

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

toolSizeText.onchange = () => { onChangeText(toolSizeText, toolSizeRange, curToolSize); }

toolMarkingText.onchange = () => { onChangeText(toolMarkingText, toolMarkingRange, markingInterval); }

toolAngleText.onchange = () => { onChangeText(toolAngleText, toolAngleRange, inclinationAngle); }

toolMarkingSizeText.onchange = () => { onChangeText(toolMarkingSizeText, toolMarkingSizeRange, markingSize); }

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
