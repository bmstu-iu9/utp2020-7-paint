'use strict';

let eraserParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
  imageData: context.getImageData(0, 0, canvas.width, canvas.height),
}

function initEraser() {
  canvas.addEventListener("mousedown", startPointEraser);
}

function deleteEraser() {
  canvas.removeEventListener("mousedown", startPointEraser);
  canvas.removeEventListener("mousemove", drawLineEraser);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointEraser(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Eraser");
  
  eraserParameters.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;
  drawPointEraser(e.offsetX, e.offsetY);
  context.putImageData(eraserParameters.imageData, 0, 0);

  canvas.addEventListener("mousemove", drawLineEraser);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLineEraser(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);

  eraserParameters.imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  eraserParameters.newX = e.offsetX;
  eraserParameters.newY = e.offsetY; 
  
  eraserParameters.distance = Math.sqrt((e.offsetX - eraserParameters.oldX) ** 2 + (e.offsetY - eraserParameters.oldY) ** 2);
  eraserParameters.angle = Math.atan2(e.offsetX - eraserParameters.oldX, e.offsetY - eraserParameters.oldY);
  
  for (let i = 0; i < eraserParameters.distance; i++) {
    eraserParameters.newX = Math.floor(eraserParameters.oldX + i * Math.sin(eraserParameters.angle));
    eraserParameters.newY = Math.floor(eraserParameters.oldY + i * Math.cos(eraserParameters.angle));
    eraserParameters.deltaX = eraserParameters.newX - eraserParameters.oldX;
    eraserParameters.deltaY = eraserParameters.newY - eraserParameters.oldX;
    
    drawPointEraser(eraserParameters.newX, eraserParameters.newY);
  }
  
  context.putImageData(eraserParameters.imageData, 0, 0);
  eraserParameters.oldX = e.offsetX;
  eraserParameters.oldY = e.offsetY;
}

function drawPointEraser(x, y) {
  let radius = Math.floor(curToolSize / 2);
  let x0 = 0;
  let y0 = radius;
  let delta = 1 - 2 * radius;
  let error = 0;
  while (y0 >= 0) {
    for (let i = x - x0; i <= x + x0; i++) if (areInCanvas(i, y - y0)) changePixel(i, y - y0);
    for (let i = x - x0; i <= x + x0; i++) if (areInCanvas(i, y + y0)) changePixel(i, y + y0);
   
    error = 2 * (delta + y0) - 1;
    if ((delta < 0) && (error <= 0)) {
      delta += 2 * (++x0) + 1;
      continue;
    }
    if ((delta > 0) && (error > 0)) {
      delta -= 1 + 2 * (--y0);
      continue;
    }
    delta += 2 * (++x0 - --y0);
  }
  
  function changePixel(x, y) {
    eraserParameters.imageData.data[getIndexOfRedInData(x, y)] = 0;
    eraserParameters.imageData.data[getIndexOfGreenInData(x, y)] = 0;
    eraserParameters.imageData.data[getIndexOfBlueInData(x, y)] = 0;
    eraserParameters.imageData.data[getIndexOfAlphaInData(x, y)] = 0;
  }
}
