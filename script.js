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

let curColor = [0, 0, 0];
let curCanvasColor = [255, 255, 255];
let curCanvasHeight = defaultHeight;
let curCanvasWidth = defaultWidth;
let curCanvasBorder = defaultBorder;
let curCanvasBorderColor = '#000000';
let curToolSize = 5;
let curAllowableColorDifference = 0;

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
  if (document.getElementById('uploadImgMenu').hidden) {
    hideAndShow('uploadImgMenu', event);
  }
  let target = event.target;
  if (target.files && target.files[0]) {
    handleImg(target.files[0]);
  }
  document.getElementById('chosenImg').innerHTML = target.files[0].name;
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

document.getElementById('clear').addEventListener('click', () => {
  clearCanvas();
  rememberState();
});

function deleteLayerHistory(id) {
  let len = photoOfState.length;
  let count = 0, k = 0;
  for (let i = 0; i < len; i++) {
    if (photoOfState[i - k].layerId === id) {
      photoOfState.splice(i - k, 1);
      if (i <= curState) ++count;
      ++k;
    } else {
      delete photoOfState[i - k][id];
    }
  }
  curState -= count;
  if (photoOfState.length === 0) photoOfState = [new Snapshot(-1)];
}

function clearAllLayersHistory() {
  photoOfState = [new Snapshot(-1)];
  curState = 0;
}

addEventListener('keydown', (event) => {
  if (event.altKey) {
    switch (event.key) {
      case 'c':
        document.getElementById('clear').click();
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
        document.getElementById('redo').click();
        break;
      case 'z':
        document.getElementById('undo').click();
        break;
    }
  }
});


let changeCanvasHeight = document.getElementById('changeCanvasHeight');
let changeCanvasWidth = document.getElementById('changeCanvasWidth');
let changeBorderWidth = document.getElementById('changeBorderWidth');

changeCanvasHeight.value = defaultHeight + 'px';
changeCanvasWidth.value = defaultWidth + 'px';
changeBorderWidth.value = defaultBorder + 'px';

function setCanvasWidth() {
  clearAllLayers();
  clearAllLayersHistory();

  canvasesField.style.width = curCanvasWidth  + 2 * curCanvasBorder + 'px';
  allCanvases.forEach((canvas) => {
    canvas.style.width = curCanvasWidth + 'px';
    canvas.setAttribute('width', curCanvasWidth + 'px');
  });
  layers.forEach((layer) => {
    changePreviewSize(layer.preview);
  });

  document.getElementById('curWidth').innerHTML = curCanvasWidth;
  changeCanvasWidth.style.background = '#ffffff';
  changeCanvasWidth.value = curCanvasWidth + 'px';
}

changeCanvasWidth.oninput = function () {
  addEventListener('keydown', setWidth);

  let width = changeCanvasWidth.value;
  let maxW = changeCanvasWidth.max;
  let minW = changeCanvasWidth.min;

  if (checkPxInput(width, minW, maxW)) {
    curCanvasWidth = parseInt(width);
    setCanvasWidth();
  } else {
    curCanvasWidth = parseInt(getWidth(width));
    changeCanvasWidth.style.background = '#ffd4d4';
  }

  changePreview();

  function getWidth(str) {

    if (isNaN(parseInt(str)))
      return defaultWidth;

    if (parseInt(str) > changeCanvasWidth.max)
      return changeCanvasWidth.max;

    if (parseInt(str) < changeCanvasWidth.min)
      return changeCanvasWidth.min;

    return defaultWidth;
  }

  function setWidth(event) {
    if (event.key === 'Enter') {
      setCanvasWidth();
      removeEventListener('keydown', setWidth);
    }
  }
}

function setCanvasHeight() {
  clearAllLayers();
  clearAllLayersHistory();

  canvasesField.style.height = curCanvasHeight + 2 * curCanvasBorder + 'px';
  allCanvases.forEach((canvas) => {
    canvas.style.height = curCanvasHeight + 'px';
    canvas.setAttribute('height', curCanvasHeight + 'px');
  });
  layers.forEach((layer) => {
    changePreviewSize(layer.preview);
  });

  document.getElementById('curHeight').innerHTML = curCanvasHeight;
  changeCanvasHeight.style.background = '#ffffff';
  changeCanvasHeight.value = curCanvasHeight + 'px';
}

changeCanvasHeight.oninput = function () {
  addEventListener('keydown', setHeight);

  let height = changeCanvasHeight.value;
  let maxH = changeCanvasHeight.max;
  let minH = changeCanvasHeight.min;

  if (checkPxInput(height, minH, maxH)) {
    curCanvasHeight = parseInt(height);
    setCanvasHeight();
  } else {
    curCanvasHeight = parseInt(getHeight(height));
    changeCanvasHeight.style.background = '#ffd4d4';
  }

  changePreview();

  function getHeight(str) {

    if (isNaN(parseInt(str)))
      return defaultHeight;

    if (parseInt(str) > changeCanvasHeight.max)
      return changeCanvasHeight.max;

    if (parseInt(str) < changeCanvasHeight.min)
      return changeCanvasHeight.min;

    return defaultHeight;
  }

  function setHeight(event) {
    if (event.key === 'Enter') {
      setCanvasHeight();
      removeEventListener('keydown', setHeight);
    }
  }
}

changeBorderWidth.oninput = function () {
  addEventListener('keydown', setBorder);

  let border = changeBorderWidth.value;
  let maxB = changeBorderWidth.max;
  let minB = changeBorderWidth.min;

  if (checkPxInput(border, minB, maxB)) {
    curCanvasBorder = parseInt(border);
    allCanvases.forEach((canvas) => {
      canvas.style.borderWidth = curCanvasBorder + 'px';
    });
    canvasesField.style.height = canvas.offsetHeight + 'px';
    canvasesField.style.width = canvas.offsetWidth + 'px';
    canvasesField.style.maxHeight = parseInt(changeCanvasHeight.max) + 2 * curCanvasBorder + 'px';
    canvasesField.style.maxWidth = parseInt(changeCanvasWidth.max) + 2 * curCanvasBorder + 'px';
    changeBorderWidth.style.background = '#ffffff';
  } else {
    curCanvasBorder = parseInt(getBorder(border));
    changeBorderWidth.style.background = '#ffd4d4';
    backCanvas.style.borderWidth = curCanvasBorder;
  }

  function getBorder(str) {

    if (isNaN(parseInt(str)))
      return defaultBorder;

    if (parseInt(str) > changeBorderWidth.max)
      return changeBorderWidth.max;

    if (parseInt(str) < changeBorderWidth.min)
      return changeBorderWidth.min;

    return defaultBorder;
  }

  function setBorder(event) {
    if (event.key === 'Enter') {
      changeBorderWidth.value = curCanvasBorder + 'px';
      changeBorderWidth.style.background = '#ffffff';
      allCanvases.forEach((canvas) => {
        canvas.style.borderWidth = curCanvasBorder + 'px';
      });
      canvasesField.style.height = canvas.offsetHeight + 'px';
      canvasesField.style.width = canvas.offsetWidth + 'px';
      canvasesField.style.maxHeight = parseInt(changeCanvasHeight.max) + 2 * curCanvasBorder + 'px';
      canvasesField.style.maxWidth = parseInt(changeCanvasWidth.max) + 2 * curCanvasBorder + 'px';

      removeEventListener('keydown', setBorder);
    }
  }
}

borderColor.oninput = function () {
  let color = document.getElementById('borderColor').value;
  if (color) {
    allCanvases.forEach((canvas) => {
      canvas.style.borderColor = color;
    });
    curCanvasBorderColor = color;
    colorBorderBtn.style.background = color;
  } else {
    allCanvases.forEach((canvas) => {
      canvas.style.borderColor = '#000000';
    });
    curCanvasBorderColor = '#000000';
  }
}

function checkPxInput(str, min, max) {
  const pxInputRegExp = new RegExp(`^\\d+(px|)$`, 'i');
  return pxInputRegExp.test(str) &&
    (parseInt(str) >= min) &&
    (parseInt(str) <= max);
}



function hideAndShow(element) {
  let menu = document.getElementById(element);
  menu.hidden = !menu.hidden;
  event.currentTarget.classList.toggle('pressed');
}

document.getElementById('help').addEventListener('click', (event) => {
  toggleModal();
  hintsContent.innerHTML = `Горячие клавиши:
      <ul>
          <li>Alt + c — очистить холст</li>
          <li>Alt + p — выбрать цвет</li>
          <li>Alt + s — сохранить</li>
          <li>Alt + u — загрузить фото</li>
          <li>Alt + y — вернуть</li>
          <li>Alt + z — отменить</li>
          <li>Ctrl + c — скопировать выделенную область</li>
          <li>Ctrl + v — вставить скопированную область</li>
          <li>Ctrl + Backspace — очистить выделенную область</li>
      </ul>`;
});

let firstClickUpload = true;

document.getElementById('uploadImgBtn').addEventListener('click', (event) => {
  if (firstClickUpload) {
    toggleModal();
    hintsContent.innerHTML = `Горячие клавиши:
      <br>
      <br> Enter — вставить фото
      <br> Двойное нажатие левой кнопкой мыши на фото — вернуть исходный размер`;
    firstClickUpload = false;
  }
  uploadImage.click();
});

document.getElementById('brush').addEventListener('click', (event) => {
  hideAndShow('brushMenu', event);
});

document.getElementById('figure').addEventListener('click', (event) => {
  hideAndShow('figureMenu', event);
});

document.getElementById('settings').addEventListener('click', (event) => {
  hideAndShow('settingsMenu', event);
});

document.getElementById('openPanel').addEventListener('click', (event) => {
  if (document.getElementById('leftContainer').style.width == "8vh") {
    document.getElementById('leftContainer').style.width = "0";
    if (document.getElementById('brushMenu').hidden == false) {
      hideAndShow('brushMenu', event);
    }
    if (document.getElementById('figureMenu').hidden == false) {
      hideAndShow('figureMenu', event);
    }
    if (document.getElementById('toolSettingsMenu').hidden == false) {
      hideAndShow('toolSettingsMenu', event)
    }
    if (document.getElementById('fillMenu').hidden == false) {
      hideAndShow('fillMenu', event)
    }
  }
  else {
    document.getElementById('leftContainer').style.width = "8vh";
  }
});

document.getElementById('toolSettings').addEventListener('click', (event) => {
  hideAndShow('toolSettingsMenu', event);
});

document.getElementById('openLayersBtn').addEventListener('click', (event) => {
  document.getElementById('layersField').classList.toggle('layersFieldClosed');
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

function changePreviewSize(preview) {
  if (curCanvasHeight / maxPreviewHeight > curCanvasWidth / maxPreviewWidth) {
    preview.style.height = maxPreviewHeight + 'px';
    preview.style.width = curCanvasWidth * (parseInt(preview.style.height) / curCanvasHeight) + 'px';
  } else {
    preview.style.width = maxPreviewWidth + 'px';
    preview.style.height = curCanvasHeight * (parseInt(preview.style.width) / curCanvasWidth) + 'px';
  }
  preview.setAttribute('width', preview.style.width);
  preview.setAttribute('height', preview.style.height);
}

let modalHints = document.querySelector('.modalHints');

function toggleModal() {
  modalHints.classList.toggle('show-modalHints');
}

closeHintsModal.addEventListener('click', toggleModal);
