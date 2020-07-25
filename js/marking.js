'use strict'

let count = 0, inter = 10;

function initCage() {
  canvas.addEventListener("mousedown", startPointCage);
}

function deleteCage() {
  canvas.removeEventListener("mousedown", startPointCage);
}

function startPointCage(e) {
  count++;
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  if (count % 2 == 1) {
    for (let x = 0; x < canvas.height; x += inter) {
      context.moveTo(0, x);
      context.lineTo(canvas.width, x);
    }
    for (let x = 0.5; x < canvas.width; x += inter) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }

    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = arrayToRgb(curColor);
    context.lineWidth = curToolSize;
    context.stroke();
  }

  if (count % 2 == 0) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
