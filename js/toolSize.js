let toolSizeRange = document.getElementById("toolSizeRange");
let toolSizeText = document.getElementById("toolSizeText");

toolSizeRange.value = curToolSize;
toolSizeText.value = `${curToolSize}px`;

let defaultSize = curToolSize;

toolSizeRange.oninput = () => { 
  changeTextValue(toolSizeRange.value); 
  toolSizeText.style.background = "white";
}

toolSizeRange.onchange = () => { curToolSize = toolSizeRange.value; }

toolSizeText.oninput = () => { 
  if (checkTextStr(toolSizeText.value)) {
    toolSizeText.style.background = "white";
    changeRangeValue(parseSizeString(toolSizeText.value));  
    curToolSize = parseSizeString(toolSizeText.value);  
  } else {
    toolSizeText.style.background = "#ffd4d4";
    if (parseSizeString(toolSizeText.value) > toolSizeRange.max) {
      curToolSize = toolSizeRange.max;
    } else if (parseSizeString(toolSizeText.value) < toolSizeRange.min) {
      curToolSize = toolSizeRange.min;
    } else {
      curToolSize = defaultSize;
    }
  }
}  
                                           
toolSizeText.onchange = () => { 
  if (checkTextStr(toolSizeText.value)) {
    changeTextValue(parseSizeString(toolSizeText.value));
    changeRangeValue(parseSizeString(toolSizeText.value));    
  } else {
    changeRangeValue(curToolSize);
    changeTextValue(curToolSize);
    toolSizeText.style.background = "white";
  }
}

function changeTextValue(value) {
  toolSizeText.value = `${value}px`;
}

function changeRangeValue(value) {
  toolSizeRange.value = value;
}

function checkTextStr(str) {
  str = str.substring(seachStartOfNumber(str));
  
  if (isNaN(parseSizeString(str)) || parseSizeString(str) > toolSizeRange.max ||  parseSizeString(str) < toolSizeRange.min) return false; 
  if (Math.trunc(parseSizeString(str)/10) === 0) {
    if (str.substring(1) !== "px" && str.substring(1) !== "") return false;
  } else if (Math.trunc(parseSizeString(str)/100) === 0) {
    if (str.substring(2) !== "px" && str.substring(2) !== "") return false;
  } else if (Math.trunc(parseSizeString(str)/1000) === 0) {
    if (str.substring(3) !== "px"  && str.substring(3) !== "") return false;
  }
  return true;
}

function seachStartOfNumber(str) {
  let i = 0;
  let result = 0;
  while (str[i] === "0") { 
    i++;
    result++;
  }
  return result;
}

function parseSizeString(str) { 
  return parseInt(str);
}
