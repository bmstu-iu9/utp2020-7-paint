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


function drawImageFromUrl(path) {
  let img = new Image();

  img.addEventListener("load", function () {
    canvas.getContext("2d").drawImage(img,
      0, 0,
      img.width, img.height,
      0, 0,
      canvas.width, canvas.height);
  });

  img.setAttribute("src", path);
}


canvas.addEventListener("mousemove", function (event) {
  let eventLocation = getEventLocation(this, event);
  let pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
  const colorHex = "#" + rgbToHex(pixelData);

  document.getElementById("colorIndicatorDynamic").style.backgroundColor = colorHex;
}, false);

canvas.addEventListener("click", function (event) {
  let eventLocation = getEventLocation(this, event);
  let pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
  const colorHex = "#" + rgbToHex(pixelData);

  document.getElementById("colorIndicatorStatic").style.backgroundColor = colorHex;
}, false);

document.getElementById("uploadImage").addEventListener('change', function() {
  if (this.files && this.files[0]) {
    let reader = new FileReader();
    reader.onload = drawUploaded;
    reader.readAsDataURL(this.files[0])
  }
});

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
