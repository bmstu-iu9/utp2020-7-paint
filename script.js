'use strict';

let backCanvas = document.getElementById('backCanvas');
let canvas = document.getElementById('layer0');
let context = canvas.getContext('2d');

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
let curState = 0;
let photoOfState = {
  length: 0,
  layers: new Map()
};
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
  memCanvas.width = canvas.width;
  memCanvas.height = canvas.height;
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
      resultContext.drawImage(document.getElementById("layer" + parseLayerId(layerScrollBox.children[i].id)), 0, 0);
    }
  }

  let img = resultCanvas.toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  downloadBtn.setAttribute('href', img);
});

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  changePreview();
}

function clearAllLayers() {
  let curCanvasId = activeLayer.id;
  layers.forEach((layer) => {
    canvas = layer.canvas;
    context = canvas.getContext('2d');
    clearCanvas();
  });
  canvas = layers.get(curCanvasId).canvas;
  context = canvas.getContext('2d');
}

document.getElementById('clear').addEventListener('click', () => {
  clearCanvas();
  rememberState();
});

function clearLayerHistory(id) {
  let count = 0, k = 0;
  let photo = photoOfState.layers.get(id);
  for (let i = 1, last = photo[0]; i < photo.length; i++) {
    if (photo[i] != last) {
        photoOfState.layers.forEach((state, idOfState) => {
          if (id != idOfState) state.splice(i - k, 1);
        });
        ++k;
        if (i <= curState) ++count;
    }
    last = photo[i];
  }
  photoOfState.length -= k;
  curState -= count;
  photoOfState.layers.delete(id);
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

changeCanvasWidth.oninput = function () {
  addEventListener('keydown', setWidth);

  let width = changeCanvasWidth.value;
  let maxW = changeCanvasWidth.max;
  let minW = changeCanvasWidth.min;

  if (checkPxInput(width, minW, maxW)) {
    curCanvasWidth = parseInt(width);
    clearAllLayers();

    changeCanvasWidth.style.background = '#ffffff';
    allCanvases.forEach((canvas) => {
      canvas.style.width = curCanvasWidth + 'px';
      canvas.setAttribute('width', curCanvasWidth + 'px');
    });
    layers.forEach((layer) => {
      changePreviewSize(layer.preview);
    });
    document.getElementById("curWidth").innerHTML = curCanvasWidth + "";
  } else {
    curCanvasWidth = getWidth(width);
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
      let actualWidth = curCanvasWidth;

      clearAllLayers();

      allCanvases.forEach((canvas) => {
        canvas.style.width = actualWidth + 'px';
        canvas.setAttribute('width', actualWidth + 'px');
      });
      layers.forEach((layer) => {
        changePreviewSize(layer.preview);
      });

      changeCanvasWidth.value = actualWidth + 'px';
      document.getElementById('curWidth').innerHTML = actualWidth + '';
      changeCanvasWidth.style.background = '#ffffff';
      removeEventListener('keydown', setWidth);
    }
  }
}

changeCanvasHeight.oninput = function () {
  addEventListener('keydown', setHeight);

  let height = changeCanvasHeight.value;
  let maxH = changeCanvasHeight.max;
  let minH = changeCanvasHeight.min;

  if (checkPxInput(height, minH, maxH)) {
    curCanvasHeight = parseInt(height);

    clearAllLayers();

    allCanvases.forEach((canvas) => {
      canvas.style.height = curCanvasHeight + 'px';
      canvas.setAttribute('height', curCanvasHeight + 'px');
    });
    layers.forEach((layer) => {
      changePreviewSize(layer.preview);
    });

    document.getElementById('curHeight').innerHTML = curCanvasHeight + '';
    changeCanvasHeight.style.background = '#ffffff';
    changeCanvasHeight.value = curCanvasHeight;
  } else {
    curCanvasHeight = getHeight(height);
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
      let actualHeight = curCanvasHeight;

      clearAllLayers();

      allCanvases.forEach((canvas) => {
        canvas.style.height = actualHeight + 'px';
        canvas.setAttribute('height', actualHeight + 'px');
      });
      layers.forEach((layer) => {
        changePreviewSize(layer.preview);
      });

      changeCanvasHeight.value = actualHeight + 'px';
      document.getElementById('curHeight').innerHTML = actualHeight + '';
      changeCanvasHeight.style.background = '#ffffff';

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
    changeBorderWidth.style.background = '#ffffff';
  } else {
    curCanvasBorder = getBorder(border);
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
      let actualBorder = curCanvasBorder;

      changeBorderWidth.value = actualBorder + 'px';
      changeBorderWidth.style.background = '#ffffff';
      allCanvases.forEach((canvas) => {
        canvas.style.borderWidth = actualBorder + 'px';
      });

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
  } else {
    allCanvases.forEach((canvas) => {
      canvas.style.borderColor = '#000000';
    });
    curCanvasBorderColor = '#000000';
  }
}

function checkPxInput(str, min, max) {
  const pxInputRegExp = new RegExp(`^\\d+(px|)$`, 'i');
  return  pxInputRegExp.test(str) &&
         (parseInt(str) >= min) &&
         (parseInt(str) <= max);
}



function hideAndShow(element) {
  let menu = document.getElementById(element);
  menu.hidden = !menu.hidden;
  event.currentTarget.classList.toggle('pressed');
}

document.getElementById('help').addEventListener('click', (event) => {
  hideAndShow('helpMenu', event);
});

let firstClickUpload = true;

document.getElementById('uploadImgBtn').addEventListener('click', (event) => {
  if (firstClickUpload) {
    toggleHintModal();
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

document.getElementById('openPanel').addEventListener('click', (event) => {
  hideAndShow('leftContainer', event);
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

function toggleHintModal() {
  modalHints.classList.toggle('show-modalHints');
}

function windowOnClick(event) {
  if (event.target === modalHints) {
    toggleHintModal();
  }
}

window.addEventListener('click', windowOnClick);
