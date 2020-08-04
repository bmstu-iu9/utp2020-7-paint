'use strict';

let stampX, stampY, dsX, dsY;
let isStamping;
let lastCanvas = document.createElement('canvas');
let lastContext = lastCanvas.getContext('2d');

function initStamp() {
  isStamping = false;
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("click", selectFragment);

  lastCanvas.width = canvas.width;
  lastCanvas.height = canvas.height;
  lastContext.drawImage(canvas, 0, 0);
}

function deleteStamp() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointStamp);
  document.removeEventListener("mousemove", drawStamp);
  document.removeEventListener("mouseup", endPoint);
  document.removeEventListener('keydown', stopStamp);
}

function selectFragment(e) {
  stampX = e.offsetX;
  stampY = e.offsetY;
  saveImg();
  canvas.style.cursor = 'default';
  canvas.removeEventListener("click", selectFragment);
  canvas.addEventListener("mousedown", startPointStamp);
}

function startPointStamp(e) {
  e.preventDefault();
  isDrawing = true;

  context.save();
  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  if (!isStamping) {
    isStamping = true;
    lastCanvas.width = canvas.width;
    lastCanvas.height = canvas.height;
    lastContext.drawImage(canvas, 0, 0);
    dsX = oldX - stampX;
    dsY = oldY - stampY;
  }

  drawSquare(oldX - curToolSize / 2, oldY - curToolSize / 2, curToolSize);

  document.addEventListener('keydown', stopStamp);
  document.addEventListener("mousemove", drawStamp);
  document.addEventListener("mouseup", endPoint);
}

function drawStamp(e) {
  if (!isDrawing) return;

  curX = e.pageX - deltaX - curToolSize / 2;
  curY = e.pageY - deltaY - curToolSize / 2;

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    drawSquare(newX, newY, curToolSize);
  }

  oldX = curX;
  oldY = curY;

  changePreview();
}

function drawSquare(x, y, len) {
  let img = context.createImageData(len, len);
  let imgColor = img.data;
  let colorAdded = memContext.getImageData(x - dsX, y - dsY, len, len).data;
  let colorBase = lastContext.getImageData(x, y, len, len).data;

  for (let i = 3; i < imgColor.length; i += 4) {
    let mixed = mixColors(colorBase.slice(i - 3, i + 1), colorAdded.slice(i - 3, i + 1));
    for (let j = i - 3, s = 0; s < 4; j++, s++) {
      imgColor[j] = mixed[s];
    }
  }
  context.putImageData(img, x, y);
}

function mixColors(base, added) {
  let mix = [0, 0, 0, 0];
  if (base[3] && added[3]) {
    mix[3] = added[3] + base[3] - added[3] * base[3] / 255;
    let k = base[3] * (255 - added[3]) / (mix[3] * 255);
    mix[0] = Math.round(added[0] * added[3] / mix[3] + base[0] * k);
    mix[1] = Math.round(added[1] * added[3] / mix[3] + base[1] * k);
    mix[2] = Math.round(added[2] * added[3] / mix[3] + base[2] * k);
  } else if (added[3]) {
    mix = added;
  } else if (base[3]) {
    mix = base;
  }
  return mix;
}

function stopStamp() {
  if (event.code == 'Enter' && event.altKey) {
    isStamping = false;
    document.removeEventListener('keydown', stopStamp);
  }
}
