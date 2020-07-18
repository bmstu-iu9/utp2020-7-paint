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

function checkSizeToolInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return (regExp.test(str)) && 
         (parseInt(str) <= toolSizeRange.max) && 
         (parseInt(str) >= toolSizeRange.min);
}
