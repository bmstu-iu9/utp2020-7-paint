'use strict';

let usedColors = [];
let usedColorsIds = [];
const maxUsedColors = 8;
let countOfUsedColors = 0;
let lastUsedColor = '';

initUsedColorsIds();

let infoCanvas = document.getElementById('previewInfoCanvas');
let infoCanvasContext = previewInfoCanvas.getContext('2d');

function showCurCoordsOnCanvas() {

  function printCurCoords(event) {
    let [x, y] = getCoordsOnCanvas(event);
    document.getElementById('mouseCordX').innerHTML = x;
    document.getElementById('mouseCordY').innerHTML = y;
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

  if (usedColors.includes(curColorHex)) {
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
