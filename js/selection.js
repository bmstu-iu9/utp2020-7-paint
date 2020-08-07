let deltaXS, deltaYS, curXS, curYS, oldXS, oldYS;

let isThereSelection = false;
let arrayOfSelectedArea = [];

let leftTopPointSelection = [0, 0];
let rightBottomPointSelection = [0, 0];

let copyCanvas;

let rememberedCanvas = document.createElement("canvas");
let rememberedContext = rememberedCanvas.getContext("2d");
let canvasIn = document.getElementById('canvasInsertion');

function endSelectionPoint() {
  context.restore();
  if (isDrawing) {
    isDrawing = false;
  }
  context.beginPath();
  if (isThereSelection) {
    if (leftTopPointSelection[0] != rightBottomPointSelection[0] && leftTopPointSelection[1] != rightBottomPointSelection[1]) {
      defineSelectedArea(); 
    } else {
      alert("Выделенная область не может содержать 0 пикселей");
      deleteSelectedArea();
    }
  }
}

function initRectangleSelection() {
  canvas.addEventListener("mousedown", startPointRectangleSelection);
}

function deleteRectangleSelection() {
  canvas.removeEventListener("mousedown", startPointRectangleSelection);
  document.removeEventListener("mousemove", drawRectangleSelection);
  document.removeEventListener("mouseup", endSelectionPoint);
}

function startPointRectangleSelection(e) {
  e.preventDefault();
  
  isDrawing = true;

  if (isThereSelection) deleteSelectedArea();
  oldXS = e.offsetX;
  oldYS = e.offsetY;
  deltaXS = e.pageX - oldXS;
  deltaYS = e.pageY - oldYS;

  document.addEventListener("mousemove", drawRectangleSelection);
  document.addEventListener("mouseup", endSelectionPoint);
}

function drawRectangleSelection(e) {
  if (!isDrawing) return;
  
  if (!isThereSelection) {
    let selectionCanvas = document.createElement("canvas");
    selectionCanvas.id = "selectionCanvas";
    
    document.getElementById("layer0").after(selectionCanvas);
    
    selectionCanvas.classList.add('mainCanvas');
    selectionCanvas.width = selectionCanvas.offsetWidth;
    selectionCanvas.height = selectionCanvas.offsetHeight;
    selectionCanvas.style.zIndex = 999;
    selectionCanvas.style.pointerEvents = "none";
  }

  isThereSelection = true;
  
  curXS = e.pageX - deltaXS;
  curYS = e.pageY - deltaYS;

  let selectionContext = document.getElementById("selectionCanvas").getContext("2d");
  selectionContext.clearRect(0, 0, canvas.width, canvas.height);
  selectionContext.beginPath();
  selectionContext.setLineDash([5, 5]);
  selectionContext.strokeStyle = "grey";
  selectionContext.strokeRect(oldXS, oldYS, curXS - oldXS, curYS - oldYS);

  leftTopPointSelection = [Math.min(oldXS, curXS), Math.min(oldYS, curYS)];
  rightBottomPointSelection = [Math.max(oldXS, curXS), Math.max(oldYS, curYS)];
}


function rememberCanvasWithoutSelection() {
  rememberedCanvas.width = canvas.width;
  rememberedCanvas.height = canvas.height;
  rememberedContext.clearRect(0, 0, canvas.width, canvas.height);
  rememberedContext.drawImage(canvas, 0, 0);
}

function uniteRememberAndSelectedImages() {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let rememberedImageData = rememberedContext.getImageData(0, 0, canvas.width, canvas.height);
  
  let resultImageData = curImageData;

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      if (arrayOfSelectedArea[i] === undefined || arrayOfSelectedArea[i][j] != true) {
        resultImageData.data[getIndexOfRedInData(i, j)] = rememberedImageData.data[getIndexOfRedInData(i, j)];
        resultImageData.data[getIndexOfGreenInData(i, j)] = rememberedImageData.data[getIndexOfGreenInData(i, j)];
        resultImageData.data[getIndexOfBlueInData(i, j)] = rememberedImageData.data[getIndexOfBlueInData(i, j)];
        resultImageData.data[getIndexOfAlphaInData(i, j)] = rememberedImageData.data[getIndexOfAlphaInData(i, j)];
      }
    }
  }
  
  context.putImageData(resultImageData, 0, 0);
}

function defineSelectedArea() {
  for (let i = leftTopPointSelection[0]; i < rightBottomPointSelection[0]; i++) {
    arrayOfSelectedArea[i] = [];
    for (let j = leftTopPointSelection[1]; j < rightBottomPointSelection[1]; j++) {
      arrayOfSelectedArea[i][j] = true;
    }
  }
}

function deleteSelectedArea() {
  isThereSelection = false;
  document.getElementById("selectionCanvas").remove();
  arrayOfSelectedArea = [];
}

function copySelectedArea() {
  let copyImageData = context.getImageData(leftTopPointSelection[0], leftTopPointSelection[1], rightBottomPointSelection[0] - leftTopPointSelection[0], rightBottomPointSelection[1] - leftTopPointSelection[1]);          
  
  for (let i = leftTopPointSelection[0]; i <= rightBottomPointSelection[0]; i++) {
    for (let j = leftTopPointSelection[1]; j <= rightBottomPointSelection[1]; j++) {
      if (arrayOfSelectedArea[i] === undefined || !arrayOfSelectedArea[i][j]) {
        copyImageData.data[getIndexOfRedInData(i, j)] = 0;
        copyImageData.data[getIndexOfGreenInData(i, j)] = 0;
        copyImageData.data[getIndexOfBlueInData(i, j)] = 0;
        copyImageData.data[getIndexOfAlphaInData(i, j)] = 0;
      }
    }
  }

  copyCanvas = document.createElement("canvas");
  copyCanvas.setAttribute("width", rightBottomPointSelection[0] - leftTopPointSelection[0]);
  copyCanvas.setAttribute("height", rightBottomPointSelection[1] - leftTopPointSelection[1]);
  copyCanvas.getContext("2d").putImageData(copyImageData, 0, 0);
}

function clearSelectedArea() {
  let resultImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      if (arrayOfSelectedArea[i] !== undefined && arrayOfSelectedArea[i][j] == true) {
        resultImageData.data[getIndexOfRedInData(i, j)] = 0;
        resultImageData.data[getIndexOfGreenInData(i, j)] = 0;
        resultImageData.data[getIndexOfBlueInData(i, j)] = 0;
        resultImageData.data[getIndexOfAlphaInData(i, j)] = 0;
      }
    }
  }
  context.putImageData(resultImageData);
}

function insertCanvas(copyCanvas) {
  deleteSelectedArea();
  let lastPasteCanvas = document.getElementById('copyCanvasForInsertion');

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      if (isThereSelection) rememberCanvasWithoutSelection();
      let posOfPhoto = getMiddleCoords(canvasIn);
      let posOfCanvas = {
        x: canvas.getBoundingClientRect().left,
        y: canvas.getBoundingClientRect().top
      };
      let dx = Math.floor(posOfPhoto.x - posOfCanvas.x + 2.5), dy = Math.floor(posOfPhoto.y - posOfCanvas.y + 2.5);
      context.save();
      context.translate(dx, dy);
      
      context.drawImage(copyCanvas, 0, 0, copyCanvas.width, copyCanvas.height, -Math.floor(deltaX), -Math.floor(deltaY), copyCanvas.width, copyCanvas.height);
      
      context.restore();
      canvasIn.hidden = true;
      if (photoAngle) {
        photoAngle = 0;
        rotatePhoto();
      }
      document.removeEventListener('keydown', pressForInsertion);

      if (isThereSelection) uniteRememberAndSelectedImages();
      changePreview();
      rememberState();
    }
  }

  function setInitialParameters() {
    canvasIn.hidden = false;
    canvasIn.style.width = 'auto';
    canvasIn.style.height = 'auto';
    canvasIn.style.top = canvas.getBoundingClientRect().top + 'px';
    canvasIn.style.left = canvas.getBoundingClientRect().left + 'px';
    canvasIn.style.zIndex = activeLayer.index;

    deltaX = parseFloat(getComputedStyle(canvasIn, null).getPropertyValue('width').replace('px', '')) / 2;
    deltaY = parseFloat(getComputedStyle(canvasIn, null).getPropertyValue('height').replace('px', '')) / 2;
    sign = 1;
    photoAngle = 0;
  }

  if (lastPasteCanvas) canvasIn.removeChild(lastPasteCanvas);
  copyCanvas.id = 'copyCanvasForInsertion';
  canvasIn.appendChild(copyCanvas);
  setInitialParameters();
  document.addEventListener('keydown', pressForInsertion);
}

canvasIn.ondragstart = () => false;

canvasIn.addEventListener('mousedown', (e) => {
  let img = document.getElementById('copyCanvasForInsertion');
  let curMiddle = getMiddleCoords(img);
  let shiftX = e.clientX - (curMiddle.x - deltaX);
  let shiftY = e.clientY - (curMiddle.y - deltaY);

  function moveAt(x, y) {
    canvasIn.style.left = x - shiftX + 'px';
    canvasIn.style.top = y - shiftY + 'px';
  }

  function move(e) {
    if (!isResizing && !isRotating) moveAt(e.clientX, e.clientY);
  }

  function stop() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
  }

  moveAt(e.clientX, e.clientY);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);
});
