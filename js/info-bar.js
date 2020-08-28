'use strict';

let usedColors = [];
let usedColorsIds = [];
const maxUsedColors = 3;
let countOfUsedColors = 0;

function getCurCoordsOnCanvas(event) {
  let eventLocation = getEventLocation(canvas, event);

  return {
    x :  eventLocation.x - curCanvasBorder,
    y :  eventLocation.y - curCanvasBorder
  };
}

function showCurCoordsOnCanvas() {

  function printCurCoords(event) {
    //display somewhere on info bar after design
    //and remove listener when bar is closed
    let coords = getCurCoordsOnCanvas(event);


  }

  canvas.addEventListener('mousemove', printCurCoords);
}

function showCurColor() {
  //set here color on some window
  //document.getElementById('curColorWindow').style.background = '#' + rgbToHex(curColor);
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
  if (countOfUsedColors < maxUsedColors) {
    usedColors[countOfUsedColors++] = '#' + rgbToHex(curColor);
    //document.getElementById(usedColorsIds[countOfUsedColors]).style.background = '#' + rgbToHex(curColor);
    return;
  }

  usedColors.pop();
  usedColors.unshift('#' + rgbToHex(curColor));
  updateUsedColors();
}

function updateUsedColors() {
  usedColorsIds.forEach((id, i) => {
    document.getElementById(id).style.background = usedColor[i];
  });
}
