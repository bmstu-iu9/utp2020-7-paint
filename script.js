'use strict'

let canvas = document.getElementById("mainCanvas");
let context = canvas.getContext("2d");

let curColor = [0, 0, 0];
let curToolSize = 5;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


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

document.getElementById("clear").addEventListener('click', clearCanvas);

document.addEventListener('keydown', (event) => {
  if (event.keyCode == 67) {
    clearCanvas();
  }
});

changeCanvasHeight.oninput = function () {
  let height = document.getElementById("changeCanvasHeight").value;
  if (height) {
    canvas.style.height = height + 'px';
  } else {
    canvas.style.height = 720 + 'px';
  }
}

changeCanvasWidth.oninput = function () {
  let width = document.getElementById("changeCanvasWidth").value;
  if (width) {
    canvas.style.width = width + 'px';
  } else {
    canvas.style.width = 1080 + 'px';
  }
}

borderWidth.oninput = function () {
  let width = document.getElementById("borderWidth").value;
  if (width) {
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
