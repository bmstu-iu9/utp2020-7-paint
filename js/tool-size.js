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

  let toolSize = toolSizeText.value;
  let maxTS = toolSizeRange.max;
  let minTS = toolSizeRange.min;

  if (checkPxInput(toolSize, minTS, maxTS)) {
    toolSizeText.style.background = "white";
    toolSizeRange.value = parseInt(toolSize);
    curToolSize = parseInt(toolSizeText.value);
  } else {
    toolSizeText.style.background = "#ffd4d4";
    curToolSize = getToolSize(parseInt(toolSize), toolSizeRange);
  }

  function getToolSize(toolSizeNum, toolSizeRange) {
    if (toolSizeNum > toolSizeRange.max) { return toolSizeRange.max; }
    if (toolSizeNum < toolSizeRange.min) { return toolSizeRange.min; }
    return defaultSize;
  }
}

toolSizeText.onchange = () => {

  let toolSize = toolSizeText.value;
  let maxTS = toolSizeText.max;
  let minTS = toolSizeText.min;

  if (checkPxInput(toolSize, minTS, maxTS)) {
    toolSizeText.value = parseInt(toolSize) + 'px';
    toolSizeRange.value = parseInt(toolSize);
  } else {
    toolSizeRange.value = curToolSize;
    toolSizeText.value = curToolSize + 'px';
    toolSizeText.style.background = "white";
  }
}
