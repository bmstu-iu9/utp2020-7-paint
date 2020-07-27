'use strict';

let pixelEraserParameters = {
  oldX: 0,
  oldY: 0,
  newX: 0,
  newY: 0,
  distance: 0,
  angle: 0,
};

function initPixelEraser() {
  canvas.addEventListener("mousedown", startPointPixelEraser);
}

function deletePixelEraser() {
  canvas.removeEventListener("mousedown", startPointPixelEraser);
  canvas.removeEventListener("mousemove", drawPixelEraser);
  canvas.removeEventListener("mouseup", endPoint);
  canvas.removeEventListener("mouseleave", endPoint);
  context.globalCompositeOperation = "source-over";
}

function startPointPixelEraser(e) {
  isDrawing = true;
  if (!isReplaying) rememberDrawingTool("Eraser");
 
  pixelEraserParameters.oldX = e.offsetX;
  pixelEraserParameters.oldY = e.offsetY;
  
  drawPointPixelEraser(e.offsetX, e.offsetY);
  
  drawPixelEraser(e);

  canvas.addEventListener("mousemove", drawPixelEraser);
  canvas.addEventListener("mouseup", endPoint);
  canvas.addEventListener("mouseleave", endPoint);
}

function drawPixelEraser(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords.push([e.offsetX, e.offsetY]);
  
  pixelEraserParameters.newX = e.offsetX;
  pixelEraserParameters.newY = e.offsetY; 
  
  pixelEraserParameters.distance = Math.sqrt(Math.pow(e.offsetX - pixelEraserParameters.oldX, 2) + Math.pow(e.offsetY - pixelEraserParameters.oldY, 2));
  pixelEraserParameters.angle = Math.atan2(e.offsetX - pixelEraserParameters.oldX, e.offsetY - pixelEraserParameters.oldY);
  
  for (let i = 0; i < pixelEraserParameters.distance; i++) {
    pixelEraserParameters.newX = Math.floor(pixelEraserParameters.oldX + i * Math.sin(pixelEraserParameters.angle));
    pixelEraserParameters.newY = Math.floor(pixelEraserParameters.oldY + i * Math.cos(pixelEraserParameters.angle));
    
    drawPointPixelEraser(pixelEraserParameters.newX, pixelEraserParameters.newY);
  }

  pixelEraserParameters.oldX = e.offsetX;
  pixelEraserParameters.oldY = e.offsetY;
}

function drawPointPixelEraser(x, y) {
  let radius = Math.floor(curToolSize / 2);
  drawBresenhamCircle();
  
  function drawBresenhamCircle() {
    context.beginPath();
    context.lineWidth = 1;
    context.globalCompositeOperation = "destination-out";
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
      context.lineTo(toX, y + 0.5);
    }       
  }
}
