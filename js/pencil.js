'use strict';

let pencilParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
  imageData: context.getImageData(0, 0, canvas.width, canvas.height),
}

function initPencil() {
  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.removeEventListener("mousedown", startPointPencil);
  canvas.removeEventListener("mousemove", drawLinePencil);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointPencil(e) {
  isDrawing = true;
  //if (!isReplaying) rememberDrawingTool("Pencil");
 
  pencilParameters.oldX = Math.floor(e.offsetX);
  pencilParameters.oldY = Math.floor(e.offsetY);
  
  drawPoint(e.offsetX, e.offsetY);
  context.putImageData(pencilParameters.imageData, 0, 0);

  canvas.addEventListener("mousemove", drawLinePencil);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawLinePencil(e) {
  if (!isDrawing) return;
  //if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);
  pencilParameters.newX = e.offsetX;
  pencilParameters.newY = e.offsetY; 
  
  pencilParameters.distance = Math.sqrt((e.offsetX - pencilParameters.oldX) ** 2 + (e.offsetY - pencilParameters.oldY) ** 2);
  pencilParameters.angle = Math.atan2(e.offsetX - pencilParameters.oldX, e.offsetY - pencilParameters.oldY);
  
  for (let i = 0; i < pencilParameters.distance; i++) {
    pencilParameters.newX = Math.floor(pencilParameters.oldX + i * Math.sin(pencilParameters.angle));
    pencilParameters.newY = Math.floor(pencilParameters.oldY + i * Math.cos(pencilParameters.angle));
    pencilParameters.deltaX = pencilParameters.newX - pencilParameters.oldX;
    pencilParameters.deltaY = pencilParameters.newY - pencilParameters.oldX;
    
    drawPoint(pencilParameters.newX, pencilParameters.newY);
  }
  
  context.putImageData(pencilParameters.imageData, 0, 0);
  pencilParameters.oldX = e.offsetX;
  pencilParameters.oldY = e.offsetY;
}

function drawPoint(x, y) {
  let radius = Math.floor(curToolSize / 2);
  let x0 = 0;
  let y0 = radius;
  let delta = 1 - 2 * radius;
  let error = 0;
  while (y0 >= 0) {
    //changePixel(x + x0, y - y0); //первая четверть
    //changePixel(x - x0, y - y0); //вторая
    //changePixel(x + x0, y + y0); //четвертая 
    //changePixel(x - x0, y + y0); //третья

    for (let i = x - x0; i <= x + x0; i++) if (areInCanvas(i, y - y0)) changePixel(i, y - y0);
    for (let i = x - x0; i <= x + x0; i++) if (areInCanvas(i, y + y0)) changePixel(i, y + y0);
   
    error = 2 * (delta + y0) - 1;
    if ((delta < 0) && (error <= 0)) {
      delta += 2 * (++x0) + 1;
      continue;
    }
    if ((delta > 0) && (error > 0)) {
      delta += 1 - 2 * (--y0);
      continue;
    }
    delta += 2 * (++x0 - y0--);
  }
  
  function changePixel(x, y) {
    pencilParameters.imageData.data[getIndexOfRedInData(x, y)] = curColor[0];
    pencilParameters.imageData.data[getIndexOfGreenInData(x, y)] = curColor[1];
    pencilParameters.imageData.data[getIndexOfBlueInData(x, y)] = curColor[2];
    pencilParameters.imageData.data[getIndexOfAlphaInData(x, y)] = 255;
  }
}
