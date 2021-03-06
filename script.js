'use strict';

let backCanvas = document.getElementById('backCanvas');
let canvas = document.getElementById('layer0');
let context = canvas.getContext('2d');
let canvasesField = document.getElementById('canvasesField');

const defaultWidth = 780;
const defaultHeight = 400;
const defaultBorder = 1;

let maxPreviewHeight = document.getElementById("previewDiv0").clientHeight;
let maxPreviewWidth = document.getElementById("previewDiv0").clientWidth;

let infoCanvas = document.getElementById('previewInfoCanvas');
let infoCanvasContext = previewInfoCanvas.getContext('2d');
let maxInfoCanvasHeight = document.getElementById("previewInfo").clientHeight;
let maxInfoCanvasWidth = document.getElementById("previewInfo").clientWidth;

let curColor = [0, 0, 0];
let curCanvasColor = [255, 255, 255];
let curCanvasHeight = defaultHeight;
let curCanvasWidth = defaultWidth;
let curCanvasBorder = defaultBorder;
let curToolSize = 5;
let curAllowableColorDifference = 0;

let markingInterval = 100;
let markingAmplitude = 45;
let inclinationAngle = 45;
let markingSize = 1;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let memCanvas = document.createElement('canvas');
let memContext = memCanvas.getContext('2d');
let uploadImage = document.getElementById('uploadImage');

function saveImg() {
  memCanvas.width = curCanvasWidth;
  memCanvas.height = curCanvasHeight;
  memContext.drawImage(canvas, 0, 0);
}

function getElementPosition(element) {
  let curLeft = 0, curTop = 0;
  if (!element.offsetParent) return undefined;
  while (true) {
    curLeft += element.offsetLeft;
    curTop += element.offsetTop;
    element = element.offsetParent;
    if (!element) break;
  }

  return {
    x: curLeft,
    y: curTop
  };
}

function getEventLocation(element, event) {
  let pos = getElementPosition(element);

  return {
    x: (event.pageX - pos.x),
    y: (event.pageY - pos.y)
  };
}

document.getElementById('colorBtn').onclick = function choosing() {
  colorInput.click();
  colorInput.focus();
}

function rgbToHex(rgb) {
  let r = rgb[0], g = rgb[1], b = rgb[2];

  if (r < 256 && g < 256 && b < 256) {
    let color = (r << 16) | (g << 8) | b;
    return (('000000' + color.toString(16)).slice(-6));
  } else {
    throw 'Wrong color code';
  }
}

function arrayToRgb(color) {
  return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
}

uploadImage.addEventListener('change', () => {
  let target = event.target;
  if (target.files && target.files[0]) {
    handleImg(target.files[0]);
  }
});

function handleImg(img) {
  let reader = new FileReader();
  reader.onload = drawUploaded;
  reader.readAsDataURL(img);
}

function drawUploaded(e) {
  let img = new Image();
  img.src = e.target.result;
  img.onload = () => {
    deleteImg();
    insertImg(img);
    uploadImage.value = null;
  }
}

let downloadBtn = document.getElementById('download');

downloadBtn.addEventListener('click', () => {
  let resultCanvas = document.createElement('canvas');
  resultCanvas.width = canvas.width;
  resultCanvas.height = canvas.height;
  let resultContext = resultCanvas.getContext('2d');

  for (let i = layerScrollBox.children.length - 1; i >= 0; i--) {
    if (parseLayerId(layerScrollBox.children[i].id) != null) {
      resultContext.drawImage(document.getElementById('layer'
        + parseLayerId(layerScrollBox.children[i].id)),
        0, 0);
    }
  }

  let img = resultCanvas.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  downloadBtn.setAttribute('href', img);
});

let clearCanvasBtn = document.getElementById('clearCanvasBtn');

function clearCanvas(layer) {
  if (layer) {
    let canv = layer.canvas;
    canv.getContext('2d').clearRect(0, 0, canv.width, canv.height);
    changePreview(layer);
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    changePreview();
  }
}

function clearAllLayers() {
  layers.forEach((layer) => {
    clearCanvas(layer);
  });
}

clearCanvasBtn.addEventListener('click', () => {
  clearCanvas();
  rememberState();
});

function deleteLayerHistory(id) {
  let len = layersHistory.length;
  let count = 0, k = 0;
  for (let i = 0; i < len; i++) {
    if (layersHistory[i - k].layerId === id) {
      layersHistory.splice(i - k, 1);
      if (i <= curState) ++count;
      ++k;
    } else {
      delete layersHistory[i - k][id];
    }
  }
  curState -= count;
  if (layersHistory.length === 0) layersHistory = [new Snapshot(-1)];
}

function clearAllLayersHistory() {
  layersHistory = [new Snapshot(-1)];
  curState = 0;
}

addEventListener('keydown', (event) => {
  if (event.altKey) {
    switch (event.key) {
      case 'c':
        clearCanvasBtn.click();
        break;
      case 'p':
        colorInput.click();
        break;
      case 's':
        downloadBtn.click();
        break;
      case 'u':
        uploadImage.click();
        break;
      case 'y':
        redo.click();
        break;
      case 'z':
        undo.click();
        break;
      default:
        if (event.shiftKey) {
          zoomValue = 1;
          zoomCanvases();
        }
    }
  }
});


let changeCanvasHeight = document.getElementById('changeCanvasHeight');
let changeCanvasWidth = document.getElementById('changeCanvasWidth');

changeCanvasHeight.value = defaultHeight + 'px';
changeCanvasWidth.value = defaultWidth + 'px';


function setCanvasWidth() {

  let width = changeCanvasWidth.value;
  let maxW = changeCanvasWidth.max;
  let minW = changeCanvasWidth.min;

  function getWidth(str) {

    if (isNaN(parseInt(str)))
      return defaultWidth;

    if (parseInt(str) > changeCanvasWidth.max)
      return changeCanvasWidth.max;

    if (parseInt(str) < changeCanvasWidth.min)
      return changeCanvasWidth.min;

    return defaultWidth;
  }

  if (checkPxInput(width, minW, maxW)) {
    curCanvasWidth = parseInt(width);
  } else {
    curCanvasWidth = parseInt(getWidth(width));
  }

  changePreview();

  updateCanvasWidth();
}

changeCanvasWidth.oninput = function () {

  let width = changeCanvasWidth.value;

  document.getElementById('settingsMenu').addEventListener('keydown', setWidth);

  if (width !== curCanvasWidth + 'px') {
    changeCanvasWidth.style.background = '#ffd4d4';
  } else {
    changeCanvasWidth.style.background = '#ffffff';
  }

  function setWidth(event) {
    if (event.code === 'Enter') {
      setCanvasWidth();
      document.getElementById('settingsMenu').removeEventListener('keydown', setWidth);
    }
  }
}

function setCanvasHeight() {

  let height = changeCanvasHeight.value;
  let maxH = changeCanvasHeight.max;
  let minH = changeCanvasHeight.min;

  function getHeight(str) {

    if (isNaN(parseInt(str)))
      return defaultHeight;

    if (parseInt(str) > changeCanvasHeight.max)
      return changeCanvasHeight.max;

    if (parseInt(str) < changeCanvasHeight.min)
      return changeCanvasHeight.min;
    return defaultHeight;
  }

  if (checkPxInput(height, minH, maxH)) {
    curCanvasHeight = parseInt(height);
  } else {
    curCanvasHeight = parseInt(getHeight(height));
  }

  changePreview();

  updateCanvasHeight();
}

changeCanvasHeight.oninput = function () {

  let height = changeCanvasHeight.value;

  document.getElementById('settingsMenu').addEventListener('keydown', setHeight);

  if (height !== curCanvasHeight+'px') {
    changeCanvasHeight.style.background = '#ffd4d4';
  } else {
    changeCanvasHeight.style.background = '#ffffff';
  }

  function setHeight(event) {
    if (event.code === 'Enter') {
      setCanvasHeight();
      document.getElementById('settingsMenu').removeEventListener('keydown', setHeight);
    }
  }
}


function updateCanvasHeight() {
  clearAllLayers();

  canvasesField.style.height = curCanvasHeight + 2 * curCanvasBorder + 'px';
  allCanvases.forEach((canvas) => {
    canvas.style.height = curCanvasHeight + 'px';
    canvas.setAttribute('height', curCanvasHeight + 'px');
  });
  layers.forEach((layer) => {
    changeWindowSize(layer.preview, maxPreviewHeight, maxPreviewWidth);
  });
  changeWindowSize(infoCanvas, maxInfoCanvasHeight, maxInfoCanvasWidth);

  document.getElementById('curHeight').innerHTML = curCanvasHeight;
  document.getElementById('showCurHeight').innerHTML = curCanvasHeight;
  changeCanvasHeight.style.background = '#ffffff';
  changeCanvasHeight.value = curCanvasHeight + 'px';
}

function updateCanvasWidth() {
  clearAllLayers();

  canvasesField.style.width = curCanvasWidth  + 2 * curCanvasBorder + 'px';
  allCanvases.forEach((canvas) => {
    canvas.style.width = curCanvasWidth + 'px';
    canvas.setAttribute('width', curCanvasWidth + 'px');
  });
  layers.forEach((layer) => {
    changeWindowSize(layer.preview, maxPreviewHeight, maxPreviewWidth);
  });
  changeWindowSize(infoCanvas, maxInfoCanvasHeight, maxInfoCanvasWidth);

  document.getElementById('curWidth').innerHTML = curCanvasWidth;
  document.getElementById('showCurWidth').innerHTML = curCanvasWidth;
  changeCanvasWidth.style.background = '#ffffff';
  changeCanvasWidth.value = curCanvasWidth + 'px';
}

function checkPxInput(str, min, max) {
  const pxInputRegExp = new RegExp(`^\\d+(px|)$`, 'i');
  return pxInputRegExp.test(str) &&
    (parseInt(str) >= min) &&
    (parseInt(str) <= max);
}

function hideAndShow(element) {
  function closeSettingsMenu(event) {
    if (event.code === 'Escape') {
      document.getElementById('settings').classList.toggle('pressed');
      document.getElementById('settingsMenu').hidden = true;
      document.removeEventListener('keydown', closeSettingsMenu);
    }
  }
  let menu = document.getElementById(element);
  menu.hidden = !menu.hidden;
  if (element === 'settingsMenu') {
    document.addEventListener('keydown', closeSettingsMenu);
  }
  event.currentTarget.classList.toggle('pressed');
}

document.getElementById('help').addEventListener('click', (event) => {
  toggleHintModal();
  hintsContent.innerHTML = `Горячие клавиши:
      <ul>
          <li>Alt + c — очистить холст</li>
          <li>Alt + p — выбрать цвет</li>
          <li>Alt + s — сохранить</li>
          <li>Alt + u — загрузить фото</li>
          <li>Alt + y — вернуть</li>
          <li>Alt + z — отменить</li>
          <li>Alt + shift — 100% масштабирование холста</li>
          <li>Ctrl + c — скопировать выделенную область</li>
          <li>Ctrl + v — вставить скопированную область</li>
          <li>Ctrl + Backspace — очистить выделенную область</li>
      </ul>`;
});

function updateCanvasParameters() {
  updateCanvasWidth();
  updateCanvasHeight();
}

let firstClickUpload = true;

document.getElementById('uploadImgBtn').addEventListener('click', (event) => {
  if (firstClickUpload) {
    toggleHintModal();
    hintsContent.innerHTML = `Горячие клавиши:
      <br>
      <br> Enter — вставить фото
      <br> Двойное нажатие на фото — вернуть исходный размер`;
    firstClickUpload = false;
  }
  uploadImage.click();
});

const leftMenuLists = ['brush', 'figure', 'settings', 'eraser'];

leftMenuLists.forEach((list) => {
  document.getElementById(list).addEventListener('click', (event) =>{
    window['hideAndShow'](list + 'Menu', event);
  })
});

document.getElementById('openPanel').addEventListener('click', (event) => {
  if (document.getElementById('leftContainer').style.left === '0vh') {
    document.getElementById('leftContainer').style.left = '-8vh';
    if (document.getElementById('brushMenu').hidden === false) {
      hideAndShow('brushMenu', event);
    }
    if (document.getElementById('figureMenu').hidden === false) {
      hideAndShow('figureMenu', event);
    }
    if (document.getElementById('fillMenu').hidden === false) {
      hideAndShow('fillMenu', event)
    }
    if (document.getElementById('eraserMenu').hidden === false) {
      hideAndShow('eraserMenu', event)
    }
  }
  else {
    document.getElementById('leftContainer').style.left = '0vh';
  }
});

document.getElementById('toolSettings').addEventListener('click', (event) => {
  hideAndShow('toolSettingsMenu', event);
});

document.getElementById('openLayersBtn').addEventListener('click', (event) => {
  document.getElementById('layersField').classList.toggle('layersFieldClosed');
});

document.getElementById('showCurSizes').addEventListener('click', (event) => {
  hideAndShow('settingsMenu', event);
});


function getIndexOfRedInData(x, y) {
  return canvas.width * y * 4 + x * 4;
}

function getIndexOfGreenInData(x, y) {
  return canvas.width * y * 4 + x * 4 + 1;
}

function getIndexOfBlueInData(x, y) {
  return canvas.width * y * 4 + x * 4 + 2;
}

function getIndexOfAlphaInData(x, y) {
  return canvas.width * y * 4 + x * 4 + 3;
}

function areInCanvas(x, y) {
  return (x < canvas.width && y < canvas.height && x >= 0 && y >= 0);
}

function changeWindowSize(window, maxWindowHeight, maxWindowWidth) {
  if (curCanvasHeight / maxWindowHeight > curCanvasWidth / maxWindowWidth) {
    window.style.height = maxWindowHeight + 'px';
    window.style.width = curCanvasWidth * (parseInt(window.style.height) / curCanvasHeight) + 'px';
    window.style.width = parseInt(window.style.width) / maxWindowWidth * 100 + '%';
    window.style.height = 100 + '%';
  } else {
    window.style.width = maxWindowWidth + 'px';
    window.style.height = curCanvasHeight * (parseInt(window.style.width) / curCanvasWidth) + 'px';
    window.style.height = parseInt(window.style.height) / maxWindowHeight * 100 + '%';
    window.style.width = 100 + '%';
  }
  window.setAttribute('width', window.style.width);
  window.setAttribute('height', window.style.height);
}

let modalHints = document.querySelector('.modalHints');

function toggleHintModal() {
  modalHints.classList.toggle('show-modalHints');
}

closeHintsModal.addEventListener('click', toggleHintModal);

let infoDropBtn = document.getElementById('infoDropBtn');
infoDropBtn.addEventListener('click', () => {
  let infoContent = document.getElementById('infoContent');
  infoContent.classList.toggle('showContent');
  if (infoContent.classList.contains('showContent')) {
    document.addEventListener('mousemove', showCurCoordsOnCanvas(event));
    maxInfoCanvasHeight = document.getElementById("previewInfo").clientHeight;
    maxInfoCanvasWidth = document.getElementById("previewInfo").clientWidth
    changeWindowSize(infoCanvas, maxInfoCanvasHeight, maxInfoCanvasWidth);
    infoCanvasContext.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
    infoCanvasContext.drawImage(activeLayer.preview, 0, 0, infoCanvas.width, infoCanvas.height);
  } else {
    document.removeEventListener('mousemove', showCurCoordsOnCanvas(event));
  }
});

let colorDropBtn = document.getElementById('colorDropBtn');
  colorDropBtn.addEventListener('click', () => {
    let colorContent = document.getElementById('colorContent');
    colorContent.classList.toggle('showContent');
});

let zoomValue = 1, isZooming = false,
showZoomValue = document.getElementById('showZoomValue');

showZoomValue.innerHTML = '100%';

function zoomCanvases() {
  setZoom(canvasesField);
  setZoom(canvasInsertion);
  showZoomValue.innerHTML = Math.trunc(zoomValue * 100) + '%';
}

function setZoom(element) {
  let scale = 'scale(' + zoomValue + ')';
  let origin = '0% 0%';

  element.style['transform'] = scale;
  element.style['transformOrigin'] = origin;

  ['webkit', 'moz', 'ms', 'o'].forEach((prefix) => {
    element.style[prefix + 'Transform'] = scale;
    element.style[prefix + 'TransformOrigin'] = origin;
  })
}

document.getElementById('zoomPlus').addEventListener('mousedown', () => {
  isZooming = true;
  zoomingPlus();

  function zoomingPlus() {
    if (zoomValue === 4) return;
    zoomValue = Math.ceil(zoomValue * 100 + 0.5) / 100;
    zoomCanvases();
    if (isZooming) setTimeout(zoomingPlus, 20);
  }
})

document.getElementById('zoomMinus').addEventListener('mousedown', () => {
  isZooming = true;
  zoomingMinus();

  function zoomingMinus() {
    if (zoomValue === 0.1) return;
    zoomValue = Math.floor(zoomValue * 100 - 0.5) / 100;
    zoomCanvases();
    if (isZooming) setTimeout(zoomingMinus, 20);
  }
})
