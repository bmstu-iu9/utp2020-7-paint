'use strict';

let pencilParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
};

function initPencil() {
  canvas.addEventListener("mousedown", startPointPencil);
}

function deletePencil() {
  canvas.removeEventListener("mousedown", startPointPencil);
  canvas.removeEventListener("mousemove", drawPencil);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
}

function startPointPencil(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Pencil");

  
  pencilParameters.oldX = e.offsetX;
  pencilParameters.oldY = e.offsetY;
  
  drawPointPencil(e.offsetX, e.offsetY);
  
  drawPencil(e);

  canvas.addEventListener("mousemove", drawPencil);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawPencil(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);
  
  pencilParameters.newX = e.offsetX;
  pencilParameters.newY = e.offsetY; 
  
  pencilParameters.distance = Math.sqrt(Math.pow(e.offsetX - pencilParameters.oldX, 2) + Math.pow(e.offsetY - pencilParameters.oldY, 2));
  pencilParameters.angle = Math.atan2(e.offsetX - pencilParameters.oldX, e.offsetY - pencilParameters.oldY);
  
  for (let i = 0; i < pencilParameters.distance; i++) {
    pencilParameters.newX = Math.floor(pencilParameters.oldX + i * Math.sin(pencilParameters.angle));
    pencilParameters.newY = Math.floor(pencilParameters.oldY + i * Math.cos(pencilParameters.angle));
    
    drawPointPencil(pencilParameters.newX, pencilParameters.newY);
  }

  pencilParameters.oldX = e.offsetX;
  pencilParameters.oldY = e.offsetY;
}

function drawPointPencil(x, y) {
  let radius = Math.floor(curToolSize / 2);
  drawBresenhamCircle();
  
  function drawBresenhamCircle() {
    context.beginPath();
    context.lineJoin = "miter";
    context.lineCap = "butt";
    context.lineWidth = 1;
    context.strokeStyle = arrayToRgb(curColor);
    let x0 = 0;
    let y0 = radius;
    let delta = 1 - 2 * radius;
    let error = 0;
    while (y0 >= 0) {
      drawLine(x - x0, x + x0, y - y0);
      drawLine(x - x0, x + x0, y + y0);
     
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
    
    context.stroke();
    
    function drawLine(fromX, toX, y) {
      context.moveTo(fromX, y + 0.5);
      context.lineTo(toX + 1, y + 0.5);
    }       
  }
}
