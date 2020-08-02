'use strict';

let backCanvas = document.getElementById("backCanvas");
let canvas = document.getElementById("layer0");
let context = canvas.getContext("2d");

let curColor = [0, 0, 0];
let curCanvasColor = [255, 255, 255];
let curToolSize = 5;
let curAllowableColorDifference = 0;
let curState = 0;
let photoOfState = {
  length: 0,
  layers: new Map()
};

const defaultWidth = 780;
const defaultHeight = 400;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let memCanvas = document.createElement('canvas');
let memContext = memCanvas.getContext('2d');
let uploadImage = document.getElementById("uploadImage");

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


function rgbToHex(rgb) {
  let r = rgb[0], g = rgb[1], b = rgb[2];

  if (r < 256 && g < 256 && b < 256) {
    let color = (r << 16) | (g << 8) | b;
    return (("000000" + color.toString(16)).slice(-6));
  } else {
    throw "Wrong color code";
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
  uploadImage.value = null;
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
    insertImg(img);
  }
}

let downloadBtn = document.getElementById("download");

downloadBtn.addEventListener('click', () => {
  let resultCanvas = document.createElement('canvas');
  resultCanvas.width = canvas.width;
  resultCanvas.height = canvas.height;
  let resultContext = resultCanvas.getContext("2d");
  for (let i = layersField.children.length - 2; i >= 1; i--) {
    resultContext.drawImage(document.getElementById("layer" + parseLayerId(layersField.children[i].id)), 0, 0);
  }
  let img = resultCanvas.toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  downloadBtn.setAttribute("href", img);
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
  canvas = layers[curCanvasId].canvas;
  context = canvas.getContext('2d');
}

document.getElementById("clear").addEventListener('click', () => {
  clearCanvas();
  let count = 0, k = 0, curId = activeLayer.id;
  let photo = photoOfState.layers.get(curId);
  for (let i = 1, last = photo[0]; i < photo.length; i++) {
    if (photo[i] != last) {
        photoOfState.layers.forEach((state, id) => {
          if (id != curId) state.splice(i - k, 1);
        });
        ++k;
        if (i <= curState) ++count;
    }
    last = photo[i];
  }
  photoOfState.length -= k;
  curState -= count;
  photo.splice(0, photo.length);
});

addEventListener('keydown', (event) => {
  if (event.altKey) {
    switch (event.key) {
      case 'c':
        document.getElementById("clear").click();
        break;
      case 'p':
        colorInput.focus();
        colorInput.click();
        break;
      case 's':
        downloadBtn.click();
        break;
      case 'u':
        uploadImage.click();
        break;
      case 'y':
        document.getElementById("redo").click();
        break;
      case 'z':
        document.getElementById("undo").click();
        break;
    }
  }
});

changeCanvasWidth.oninput = function () {
  let width = document.getElementById("changeCanvasWidth").value;
  if (width && width >= 50 && width <= 1400) {
    canvas.style.width = width + 'px';
    canvas.setAttribute('width', width + 'px');
    document.getElementById("curWidth").innerHTML = width + "";
  } else {
    canvas.setAttribute('width', defaultWidth + 'px');
    canvas.style.width = defaultWidth + 'px';
    document.getElementById("curWidth").innerHTML = defaultWidth + "";
  }
  changePreview();
}

changeCanvasHeight.oninput = function () {
  let height = document.getElementById("changeCanvasHeight").value;
  if (height && height >= 50 && height <= 1000) {
    canvas.style.height = height + 'px';
    canvas.setAttribute('height', height + 'px');
    document.getElementById("curHeight").innerHTML = height + "";
  } else {
    canvas.setAttribute('height', defaultHeight + 'px');
    canvas.style.height = defaultHeight + 'px';
    document.getElementById("curHeight").innerHTML = defaultHeight + "";
  }
  changePreview();
}

borderWidth.oninput = function () {
  let width = document.getElementById("borderWidth").value;
  if (width && width >= 1 && width <= 30) {
    canvas.style.borderWidth = width + 'px';
  } else {
    canvas.style.borderWidth = 1 + 'px';
  }
}

borderColor.oninput = function () {
  let color = document.getElementById("borderColor").value;
  if (color) {
    canvas.style.borderColor = color;
  } else {
    canvas.style.borderColor = '#000000';
  }
}

function hideAndShow (element) {
  let menu = document.getElementById(element);
  menu.hidden = !menu.hidden;
  event.currentTarget.classList.toggle("pressed");
}

document.getElementById("help").addEventListener('click', (event) => {
  hideAndShow("helpMenu", event);
});

document.getElementById("uploadImgBtn").addEventListener('click', (event) => {
  hideAndShow("uploadImgMenu", event);
});

document.getElementById("brush").addEventListener('click', (event) => {
  hideAndShow("brushMenu", event);
});

document.getElementById("figure").addEventListener('click', (event) => {
  hideAndShow("figureMenu", event);
});

document.getElementById("openPanel").addEventListener('click', (event) => {
  hideAndShow("lefContainer", event);
});

document.getElementById("filling").addEventListener('click', (event) => {
  hideAndShow("fillMenu", event);
});

document.getElementById("toolSettings").addEventListener('click', (event) => {
  hideAndShow("toolSettingsMenu", event);
});

function getIndexOfRedInData(x, y) {
  return canvas.width * (y - 1) * 4 + x * 4;
}

function getIndexOfGreenInData(x, y) {
  return canvas.width * (y - 1) * 4 + x * 4 + 1;
}

function getIndexOfBlueInData(x, y) {
  return canvas.width * (y - 1) * 4 + x * 4 + 2;
}

function getIndexOfAlphaInData(x, y) {
  return canvas.width * (y - 1) * 4 + x * 4 + 3;
}

function areInCanvas(x, y) {
  return (x <= canvas.width - 1 && y <= canvas.height && x >= 0 && y >= 0);
}
