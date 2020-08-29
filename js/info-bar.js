'use strict';

let usedColors = [];
let usedColorsIds = [];
const maxUsedColors = 3;
let countOfUsedColors = 0;
let lastUsedColor = '';

function getCurCoordsOnCanvas(event) {
  let eventLocation = getEventLocation(canvas, event);

  return {
    x :  eventLocation.x - curCanvasBorder,
    y :  eventLocation.y - curCanvasBorder
  };
}

function showCurCoordsOnCanvas() {

  function printCurCoords(event) {
    let coords = getCurCoordsOnCanvas(event);
    document.getElementById('mouseCordX').innerHTML = coords.x;
    document.getElementById('mouseCordY').innerHTML = coords.y;
  }

  canvas.addEventListener('mousemove', printCurCoords);
}

function showCurColor() {
  document.getElementById('curColorWindow').style.background = '#' + rgbToHex(curColor);
}

function initUsedColorsIds(){
  for (let i = 0; i < maxUsedColors; i++){
    usedColorsIds[i] = 'colorBtn' + i;
  }
  /*create there elements on canvas*/
  usedColorsIds.forEach((buttonId) => {
    let button = document.getElementById(buttonId);
    button.style.background = 'url(\'img/background.png\')';
    button.onclick = () => {
      curColor = hexToRgb(button.style.background);
      colorInput.value = button.style.background;
      showCurColor();
    }
  });
}

function addUsedColor() {
  let curColorHex = '#' + rgbToHex(curColor);
  if (lastUsedColor === curColorHex ) {
    return;
  }

  lastUsedColor = curColorHex;
  if (countOfUsedColors < maxUsedColors) {
    usedColors.unshift(curColorHex);
    countOfUsedColors++;
    //display there
    //document.getElementById(usedColorsIds[countOfUsedColors]).style.background = '#' + rgbToHex(curColor);
    return;
  }

  usedColors.pop();
  usedColors.unshift(curColorHex);
  updateUsedColors();
}

function updateUsedColors() {
  usedColorsIds.forEach((id, i) => {
    document.getElementById(id).style.background = usedColor[i];
  });
}
