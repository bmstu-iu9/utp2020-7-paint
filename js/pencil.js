let pencilButton = document.getElementById("pencil");

function drawPencil() { 
  canvas.addEventListener("mousedown", drawWithPencil);
}

function drawWithPencil(eventClick) {
  let startX = eventClick.offsetX;
  let startY = eventClick.offsetY;
  
  context.lineWidth = curToolSize;
  context.strokeStyle = `rgb(curColor[0], curColor[1], curColor[2])`;
  context.lineCap = "round";
  
  drawPointWithPencil(startX, startY);
  
  canvas.addEventListener("mousemove", drawLinesWithPencil);
  canvas.addEventListener("mouseup", pencilUp);
  canvas.addEventListener("mouseout", pencilOut);
}

function pencilUp(eventUp) {
  context.lineTo(eventUp.offsetX, eventUp.offsetY);
  context.stroke();
  canvas.removeEventListener("mousemove", drawLinesWithPencil);
}

function pencilOut(eventOut) {
  canvas.removeEventListener("mousemove", drawLinesWithPencil);
}

function drawLinesWithPencil(eventMove) {
  context.lineTo(eventMove.offsetX, eventMove.offsetY);
  context.stroke();
  context.moveTo(eventMove.offsetX, eventMove.offsetY);
}

function drawPointWithPencil(startX, startY) {
  context.moveTo(startX, startY);
  context.lineTo(startX, startY);
  context.stroke();
}

function deletePencil() {
  canvas.removeEventListener("mousedown", drawWithPencil);
  canvas.removeEventListener("mouseout", pencilOut);
  canvas.removeEventListener("mouseup", pencilUp);
}
