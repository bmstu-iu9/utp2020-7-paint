'use strict';

let stampX, stampY, curStampFragment;
let isStamping;

function initStamp() {
  isStamping = false;
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener("click", selectFragment);
}

function deleteStamp() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("mousedown", startPointStamp);
  document.removeEventListener("mousemove", drawStamp);
  document.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
  document.removeEventListener('keydown', stopStamp);
}

function selectFragment(e) {
  stampX = e.offsetX;
  stampY = e.offsetY;
  canvas.style.cursor = 'default';
  canvas.removeEventListener("click", selectFragment);
  canvas.addEventListener("mousedown", startPointStamp);
}

function resizeMemCanvas(x, y) {
  memContext.clearRect(0, 0, memContext.width, memContext.height);
  memCanvas.width = canvas.offsetWidth + x;
  memCanvas.height = canvas.offsetHeight + y;
}

function startPointStamp(e) {
  e.preventDefault();
  isDrawing = true;
  isOnCanvas = true;

  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;
  let x = oldX - stampX, y = oldY - stampY;
  let pattern;

  function start() {
    context.fillStyle = pattern;
    context.beginPath();
    context.arc(oldX, oldY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();

    drawStamp(e);
  }

  if (!isStamping) {
    isStamping = true;
    curStampFragment = new Image();
    resizeMemCanvas(x, y);
    memContext.drawImage(canvas, x, y);

    curStampFragment.onload = () => {
      pattern = context.createPattern(curStampFragment, 'no-repeat');
      start();
    }

    curStampFragment.src = memCanvas.toDataURL();
  } else start();

  document.addEventListener('keydown', stopStamp);
  document.addEventListener("mousemove", drawStamp);
  document.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
}

function drawStamp(e) {
  if (!isDrawing) return;

  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
  }

  oldX = curX;
  oldY = curY;

  changePreview();
}

function stopStamp() {
  if (event.code == 'Enter' && event.altKey) {
    isStamping = false;
    document.removeEventListener('keydown', stopStamp);
  }
}
