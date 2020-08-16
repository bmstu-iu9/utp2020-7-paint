'use strict';

let isThereSelection = false;
let arrayOfSelectedArea = [];

let leftTopPointSelection = [0, 0];
let rightBottomPointSelection = [0, 0];

let curcopyCanvas;

let rememberedCanvas = document.createElement('canvas');
let rememberedContext = rememberedCanvas.getContext('2d');
let canvasInsertion = document.getElementById('canvasInsertion');

let firstClickSelection = true;

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
      alert('Выделенная область не может содержать 0 пикселей'); //TODO : in design make it pretty
      deleteSelectedArea();
    }
  }
}

function initRectangleSelection() {
  if (firstClickSelection) {
    toggleModal();
    hintsContent.innerHTML =
    `<p>Копирование и вставка выделенной области: </p>
    <ul>
    <li></li>
    <li>Ctrl + c — скопировать выделенный фрагмент</li>
    <li>Ctrl + v — появление скопированного фрагмента</li>
    <li>Alt + Enter — добавить фрагмент на холст</li>
    <li>Ctrl + x — отменить добавление на холст</li>
    </ul>`;
    firstClickSelection = false;
  }
  canvas.addEventListener('mousedown', startPointRectangleSelection);
  document.addEventListener('keydown', hotkeyInsertion);
}

function deleteRectangleSelection() {
  canvas.removeEventListener('mousedown', startPointRectangleSelection);
  document.removeEventListener('mousemove', drawRectangleSelection);
  document.removeEventListener('mouseup', endSelectionPoint);
  document.removeEventListener('keydown', hotkeyInsertion);
}

function startPointRectangleSelection(e) {
  e.preventDefault();

  isDrawing = true;

  if (isThereSelection) deleteSelectedArea();
  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  document.addEventListener('mousemove', drawRectangleSelection);
  document.addEventListener('mouseup', endSelectionPoint);
}

function drawRectangleSelection(e) {
  if (!isDrawing) return;

  if (!isThereSelection) {
    let selectionCanvas = document.createElement('canvas');
    selectionCanvas.id = 'selectionCanvas';
    allCanvases.push(selectionCanvas);

    document.body.appendChild(selectionCanvas);

    selectionCanvas.classList.add('mainCanvas');
    selectionCanvas.style.width = curCanvasWidth + 'px';
    selectionCanvas.style.height = curCanvasHeight + 'px';
    selectionCanvas.setAttribute('width', curCanvasWidth);
    selectionCanvas.setAttribute('height', curCanvasHeight);
    selectionCanvas.style.top = canvas.style.top;
    selectionCanvas.style.left = canvas.style.left;
    selectionCanvas.style.margin = canvas.style.margin;
    selectionCanvas.style.zIndex = 999;
    selectionCanvas.style.pointerEvents = 'none';
  }

  isThereSelection = true;

  curX = e.pageX - deltaX;
  curY = e.pageY - deltaY;

  let selectionContext = document.getElementById('selectionCanvas').getContext('2d');
  selectionContext.clearRect(0, 0, canvas.width, canvas.height);
  selectionContext.beginPath();
  selectionContext.setLineDash([5, 5]);
  selectionContext.strokeStyle = 'grey';
  selectionContext.strokeRect(oldX, oldY, curX - oldX, curY - oldY);

  leftTopPointSelection = [Math.min(oldX, curX), Math.min(oldY, curY)];
  rightBottomPointSelection = [Math.max(oldX, curX), Math.max(oldY, curY)];
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
  document.getElementById('selectionCanvas').remove();
  allCanvases = allCanvases.filter((canvas) => canvas.id != 'selectionCanvas');
  arrayOfSelectedArea = [];
}

function copySelectedArea() {
  let copyImageData = context.getImageData(leftTopPointSelection[0], leftTopPointSelection[1], rightBottomPointSelection[0] - leftTopPointSelection[0], rightBottomPointSelection[1] - leftTopPointSelection[1]);

  for (let i = leftTopPointSelection[0]; i < rightBottomPointSelection[0]; i++) {
    for (let j = leftTopPointSelection[1]; j < rightBottomPointSelection[1]; j++) {
      if (arrayOfSelectedArea[i] === undefined || !arrayOfSelectedArea[i][j]) {
        copyImageData.data[getIndexOfRedInData(i, j)] = 0;
        copyImageData.data[getIndexOfGreenInData(i, j)] = 0;
        copyImageData.data[getIndexOfBlueInData(i, j)] = 0;
        copyImageData.data[getIndexOfAlphaInData(i, j)] = 0;
      }
    }
  }

  curcopyCanvas = document.createElement('canvas');
  curcopyCanvas.setAttribute('width', rightBottomPointSelection[0] - leftTopPointSelection[0]);
  curcopyCanvas.setAttribute('height', rightBottomPointSelection[1] - leftTopPointSelection[1]);
  curcopyCanvas.getContext('2d').putImageData(copyImageData, 0, 0);
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
  if (isThereSelection) deleteSelectedArea();
  let lastPasteCanvas = document.getElementById('copyCanvasForInsertion');
  curcopyCanvas = copyCanvas;
  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      if (isThereSelection) rememberCanvasWithoutSelection();
      let posOfPhoto = getElementPosition(canvasInsertion);
      let posOfCanvas = getElementPosition(canvas);
      let dx = Math.floor(posOfPhoto.x - posOfCanvas.x - curCanvasBorder + 3);
      let dy = Math.floor(posOfPhoto.y - posOfCanvas.y - curCanvasBorder + 3);

      context.drawImage(curcopyCanvas, 0, 0, curcopyCanvas.width, curcopyCanvas.height, dx, dy, curcopyCanvas.width, curcopyCanvas.height);

      canvasInsertion.hidden = true;
      document.removeEventListener('keydown', pressForInsertion);

      if (isThereSelection) uniteRememberAndSelectedImages();
      changePreview();
      rememberState();
    } else if (event.key == 'x' && event.ctrlKey) {
      canvasInsertion.hidden = true;
      document.removeEventListener('keydown', pressForInsertion);
    }
  }

  function setInitialParameters() {
    canvasInsertion.hidden = false;
    canvasInsertion.style.width = 'auto';
    canvasInsertion.style.height = 'auto';
    canvasInsertion.style.top = canvas.getBoundingClientRect().top + canvas.height / 2 - canvasInsertion.offsetHeight / 2 + 'px';
    canvasInsertion.style.left = canvas.getBoundingClientRect().left + canvas.width / 2 + - canvasInsertion.offsetWidth / 2 + 'px';
    canvasInsertion.style.zIndex = activeLayer.index;
  }

  if (lastPasteCanvas) canvasInsertion.removeChild(lastPasteCanvas);
  curcopyCanvas.id = 'copyCanvasForInsertion';
  canvasInsertion.appendChild(curcopyCanvas);
  setInitialParameters();
  document.addEventListener('keydown', pressForInsertion);
}

canvasInsertion.ondragstart = () => false;

canvasInsertion.addEventListener('mousedown', (e) => {
  let img = document.getElementById('copyCanvasForInsertion');
  let shiftX = e.clientX - img.getBoundingClientRect().left;
  let shiftY = e.clientY - img.getBoundingClientRect().top;

  function moveAt(x, y) {
    canvasInsertion.style.left = x - shiftX + 'px';
    canvasInsertion.style.top = y - shiftY + 'px';
  }

  function move(e) {
    moveAt(e.clientX, e.clientY);
  }

  function stop() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
  }

  moveAt(e.clientX, e.clientY);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);
});


function hotkeyInsertion(event) {
  if (event.ctrlKey) {
    switch (event.key) {
      case 'c':
        if (isThereSelection) copySelectedArea();
        break;
      case 'v':
        if (curcopyCanvas) insertCanvas(curcopyCanvas);
        break;
      case 'Backspace':
        if (isThereSelection) context.clearRect(leftTopPointSelection[0], leftTopPointSelection[1], rightBottomPointSelection[0] - leftTopPointSelection[0], rightBottomPointSelection[1] - leftTopPointSelection[1]);
        break;
    }
  }
}
