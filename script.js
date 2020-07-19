'use strict'

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let curColor = [0, 0, 0];
let curCanvasColor = [255, 255, 255];
let curToolSize = 5;
let curCords = [];
let curState = 0;

const defaultWidth = 1080;
const defaultHeight = 720;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let memCanvas = document.createElement('canvas');
let memCtx = memCanvas.getContext('2d');

function saveImg() {
  memCanvas.width = canvas.width;
  memCanvas.height = canvas.height;
  memCtx.drawImage(canvas, 0, 0);
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

document.getElementById("uploadImage").addEventListener('change', () => {
  if (this.files && this.files[0]) {
    handleImg(this.files[0]);
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
  img.onload = function () {
    canvas.getContext("2d").drawImage(img,
    0, 0,
    img.width, img.height,
    0, 0,
    canvas.width, canvas.height);
  }
  rememberImage(img);
}

let downloadBtn = document.getElementById("download");

downloadBtn.addEventListener('click', () => {
  let img = canvas.toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  downloadBtn.setAttribute("href", img);
});

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("clear").addEventListener('click', () => {
  clearCanvas();
  curCords = [];
  curState = 0;
  photoOfState = [];
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
        document.getElementById("uploadImage").click();
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

document.getElementById("help").addEventListener('click', (event) => {
  let helpMenu = document.getElementById("helpMenu");
  helpMenu.hidden = !helpMenu.hidden;
  event.currentTarget.classList.toggle("pressed");
});
