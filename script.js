'use strict';

let backCanvas = document.getElementById("backCanvas");
let canvas = document.getElementById("layer0");
let context = canvas.getContext("2d");

const defaultWidth = 780;
const defaultHeight = 400;
const defaultBorder = 1;

let curColor = [0, 0, 0];
let curCanvasColor = [255, 255, 255];
let curCanvasHeight = defaultHeight;
let curCanvasWidth = defaultWidth;
let curCanvasBorder = defaultBorder;
let curToolSize = 5;
let curAllowableColorDifference = 0;
let curState = 0;
let photoOfState = {
  length: 0,
  layers: new Map()
};

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
  
  for (let i = layersField.children.length - 1; i >= 0; i--) {
    if (parseLayerId(layersField.children[i].id) != null) {
      resultContext.drawImage(document.getElementById("layer" + parseLayerId(layersField.children[i].id)), 0, 0);
    }
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
  rememberState();
});

function clearLayerHistory() {
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
}

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

let changeCanvasHeight = document.getElementById("changeCanvasHeight");
let changeCanvasWidth = document.getElementById("changeCanvasWidth");
let changeBorderWidth = document.getElementById("borderWidth");

changeCanvasHeight.value = defaultHeight + 'px';
changeCanvasWidth.value = defaultWidth + 'px';
changeBorderWidth.value = defaultBorder + 'px';

changeCanvasWidth.oninput = function () {
  addEventListener('keydown', setWidth);

  let width = changeCanvasWidth.value;

  if (checkPxInput(width) &&
     (parseInt(width) >= changeCanvasWidth.min) &&
     (parseInt(width) <= changeCanvasWidth.max)) {
    curCanvasWidth = parseInt(width);

    clearAllLayers();

    changeCanvasWidth.style.background = "#ffffff";
    allCanvases.forEach((canvas) => {
      canvas.style.width = curCanvasWidth + 'px';
      canvas.setAttribute('width', curCanvasWidth + 'px');
    });
    document.getElementById("curWidth").innerHTML = curCanvasWidth + "";
  } else {
    curCanvasWidth = getWidth(width);
    changeCanvasWidth.style.background = "#ffd4d4";
  }

  changePreview();

  function getWidth(str) {
    if (!checkPxInput(str))
      return defaultWidth;

    if (parseInt(str) > changeCanvasWidth.max)
      return changeCanvasWidth.max;

    if (parseInt(str) < changeCanvasWidth.min)
      return changeCanvasWidth.min;

    return defaultWidth;
  }

  function setWidth(event) {
    if(event.key === 'Enter') {
      let actualWidth = curCanvasWidth;

      clearAllLayers();

      allCanvases.forEach((canvas) => {
        canvas.style.width = actualWidth + 'px';
        canvas.setAttribute('width', actualWidth + 'px');
      });

      changeCanvasWidth.value = actualWidth + 'px';
      document.getElementById("curWidth").innerHTML = actualWidth + "";
      changeCanvasWidth.style.background = "#ffffff";
      removeEventListener('keydown', setWidth);
    }
  }
}

changeCanvasHeight.oninput = function () {
  addEventListener('keydown', setHeight);

  let height = changeCanvasHeight.value;

  if (checkPxInput(height) &&
     (parseInt(height) >= changeCanvasHeight.min) &&
     (parseInt(height) <= changeCanvasHeight.max)) {
    curCanvasHeight = parseInt(height);

    clearAllLayers();

    allCanvases.forEach((canvas) => {
      canvas.style.height = curCanvasHeight + 'px';
      canvas.setAttribute('height', curCanvasHeight + 'px');
    });


    document.getElementById("curHeight").innerHTML = curCanvasHeight + "";
    changeCanvasHeight.style.background = "#ffffff";
    changeCanvasHeight.value = curCanvasHeight;
  } else {
    curCanvasHeight = getHeight(height);
    changeCanvasHeight.style.background = "#ffd4d4";
  }

 changePreview();


  function getHeight(str) {
   if (!checkPxInput(str))
    return defaultHeight;

   if (parseInt(str) > changeCanvasHeight.max)
    return changeCanvasHeight.max;

   if (parseInt(str) < changeCanvasHeight.min)
    return changeCanvasHeight.min;

   return defaultHeight;
  }

  function setHeight(event) {
    if(event.key === 'Enter') {
      let actualHeight = curCanvasHeight;

      clearAllLayers();

      allCanvases.forEach((canvas) => {
        canvas.style.height = actualHeight + 'px';
        canvas.setAttribute('height', actualHeight + 'px');
      });

      changeCanvasHeight.value = actualHeight + 'px';
      document.getElementById("curHeight").innerHTML = actualHeight + "";
      changeCanvasHeight.style.background = "#ffffff";

      removeEventListener('keydown', setHeight);
    }
  }
}

borderWidth.oninput = function () {
  addEventListener('keydown', setBorder);

  let border = changeBorderWidth.value;

  if (checkPxInput(border) &&
     (parseInt(border) >= 0) &&
     (parseInt(border) <= 30)) {
    curCanvasBorder = parseInt(border);
    backCanvas.style.borderWidth = border + 'px';
    changeBorderWidth.style.background = "#ffffff";
  } else {
    curCanvasBorder = getBorder(border);
    changeBorderWidth.style.background = "#ffd4d4";
    backCanvas.style.borderWidth = curCanvasBorder;
  }

  function getBorder(str) {

    if (!checkPxInput(str))
      return defaultBorder;

    if (parseInt(str) > changeBorderWidth.max)
      return changeBorderWidth.max;

    if (parseInt(str) < changeBorderWidth.min)
      return changeBorderWidth.min;

    return defaultBorder;
  }

  function setBorder(event) {
    if(event.key === 'Enter') {
      let actualBorder = curCanvasBorder;

      changeBorderWidth.value = actualBorder + 'px';
      changeBorderWidth.style.background = "#ffffff";
      backCanvas.style.borderWidth = actualBorder + 'px';

      removeEventListener('keydown', setBorder);
    }

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

function checkPxInput(str) {
  const regExp = new RegExp(`^\\d+(px|)$`, 'i');
  return regExp.test(str);
}



function hideAndShow(element) {
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

document.getElementById("openLayersBtn").addEventListener('click', (event) => {
  document.getElementById("layersField").classList.toggle("layersFieldActive");
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
