'use strict'

let curColor = [0, 0, 0];
let canvas = document.getElementById("mainCanvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


function getElementPosition(element) {
  let curLeft = 0, curTop = 0;
  if (!element.offsetParent) return undefined;
  while (true){
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


function rgbToHex(r, g, b) {
  if (r < 255 && g < 255 && b < 255) {
    let color = (r << 16) | (g << 8) | b;
    return (color.toString(16));
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


canvas.addEventListener("mousemove", function (e) {
  let eventLocation = getEventLocation(this, e);
  let context = this.getContext('2d');
  let pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
  const colorHex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);

  document.getElementById("colorIndicator").style.backgroundColor = colorHex;
}, false);
