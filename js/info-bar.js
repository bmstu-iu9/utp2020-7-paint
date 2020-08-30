'use strict';

let usedColors = [];
let usedColorsIds = [];
const maxUsedColors = 8;
let countOfUsedColors = 0;
let lastUsedColor = '';

initUsedColorsIds();

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
    let button = document.createElement('button');
    button.classList.add('colorBtn');
    usedColorsIds[i] = 'colorBtn' + i;
    button.id = usedColorsIds[i];
    document.getElementById('colorContent').appendChild(button);
  }
  usedColorsIds.forEach((buttonId) => {
    let button = document.getElementById(buttonId);
    button.style.background = 'url(\'img/background.png\')';
    button.onclick = () => {
      if (button.style.background != 'url("img/background.png")') {
        curColor = button.style.background.slice(4,-1).split(',');
        colorInput.value = '#' + rgbToHex(curColor);
        colorBtn.style.background = colorInput.value;
        showCurColor();
      }
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
    document.getElementById(usedColorsIds[countOfUsedColors]).style.background = '#' + rgbToHex(curColor);
    countOfUsedColors++;
    return;
  }

  usedColors.pop();
  usedColors.unshift(curColorHex);
  updateUsedColors();
}

function updateUsedColors() {
  usedColorsIds.forEach((id, i) => {
    document.getElementById(id).style.background = usedColors[i];
  });
}
