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
  canvas.removeEventListener("mousemove", drawStamp);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
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
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Stamp");

  oldX = e.offsetX;
  oldY = e.offsetY;
  let x = oldX - stampX, y = oldY - stampY;
  let pattern;

  function start() {
    context.fillStyle = pattern;
    context.lineWidth = 0.1;
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
  canvas.addEventListener("mousemove", drawStamp);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawStamp(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  distance = Math.sqrt(Math.pow(e.offsetX - oldX, 2) + Math.pow(e.offsetY - oldY, 2))
  angle = Math.atan2(e.offsetX - oldX, e.offsetY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    context.beginPath();
    context.arc(newX, newY, curToolSize / 2, 0, Math.PI * 2, false);
    context.fill();
  }

  oldX = e.offsetX;
  oldY = e.offsetY;

  changePreview();
}

function stopStamp() {
  if (event.code == 'Enter' && event.altKey) {
    isStamping = false;
    document.removeEventListener('keydown', stopStamp);
  }
}
