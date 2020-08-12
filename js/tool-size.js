'use strict';

let newToolValue;

let toolSizeRange = document.getElementById("toolSizeRange");
let toolSizeText = document.getElementById("toolSizeText");
let defaultSize = curToolSize;

toolSizeRange.value = curToolSize;
toolSizeText.value = `${curToolSize}px`;

toolSizeRange.oninput = () => { onInputRange(toolSizeText, toolSizeRange); }

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

toolSizeText.oninput = () => {
  onInputText(toolSizeText, toolSizeRange, defaultSize);
  curToolSize = newToolValue;
}

toolSizeText.onchange = () => { onChangeText(toolSizeText, toolSizeRange, curToolSize); }

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
    if (toolNum > parseInt(toolRange.max)) { return parseInt(toolRange.max); }
    if (toolNum < parseInt(toolRange.min)) { return parseInt(toolRange.min); }
    return defaultValue;
  }
}
