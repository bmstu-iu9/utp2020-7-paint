let copyCanvas;



let sCanvas = document.createElement("canvas");
sCanvas.width = canvas.width;
sCanvas.height = canvas.height;
sCanvas.id = "sCanvas";
document.getElementById("layer0").after(sCanvas);

let leftTopPointSelection = [0, 0];
let rightBottomPointSelection = [0, 0];

let isThereSelection = false;
let arrayOfSelectedArea = [];

function endSelectionPoint() {
  isDrawing = false;
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

function initSelection() {
  canvas.addEventListener("mousedown", startPointRectangleSelection);
}

function deleteSelection() {
  canvas.removeEventListener("mousedown", startPointRectangleSelection);
  document.removeEventListener("mousemove", drawRectangleSelection);
  document.removeEventListener("mouseup", endSelectionPoint);
  canvas.removeEventListener("mouseleave", exitPoint);
  canvas.removeEventListener("mouseenter", returnPoint);
}

function startPointRectangleSelection(e) {
  e.preventDefault();
  
  isDrawing = true;
  isOnCanvas = true;
  
  //if (!isReplaying) rememberDrawingTool("Rectangle", [e.offsetX, e.offsetY]);

  if (isThereSelection) deleteSelectedArea();
  oldX = e.offsetX;
  oldY = e.offsetY;
  deltaX = e.pageX - oldX;
  deltaY = e.pageY - oldY;

  document.addEventListener("mousemove", drawRectangleSelection);
  document.addEventListener("mouseup", endSelectionPoint);
  canvas.addEventListener("mouseleave", exitPoint);
  canvas.addEventListener("mouseenter", returnPoint);
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
    
    //selectionContext.lineDashOffset = -5;
  }
  isThereSelection = true;
  
  curX = e.offsetX;
  curY = e.offsetY;

  if (!isOnCanvas) {
    curX -= deltaX;
    curY -= deltaY;
  }

  let selectionContext = document.getElementById("selectionCanvas").getContext("2d");
  selectionContext.clearRect(0, 0, canvas.width, canvas.height);
  selectionContext.beginPath();
  selectionContext.setLineDash([10, 16]);
  selectionContext.strokeStyle = "grey";
  selectionContext.strokeRect(oldX, oldY, curX - oldX, curY - oldY);
  leftTopPointSelection = [Math.min(oldX, curX), Math.min(oldY, curY)];
  rightBottomPointSelection = [Math.max(oldX, curX), Math.max(oldY, curY)];
}

let rememberedCanvas = document.createElement("canvas");
let rememberedContext = rememberedCanvas.getContext("2d");

function rememberCanvas() {
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
  let copyImageData = context.getImageData(0, 0, canvas.width, canvas.height);          
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      if (arrayOfSelectedArea[i] === undefined || arrayOfSelectedArea[i][j] != true) {
        copyImageData.data[getIndexOfRedInData(i, j)] = 0;
        copyImageData.data[getIndexOfGreenInData(i, j)] = 0;
        copyImageData.data[getIndexOfBlueInData(i, j)] = 0;
        copyImageData.data[getIndexOfAlphaInData(i, j)] = 0;
      }
    }
  }
  copyCanvas = document.createElement("canvas");
  //copyCanvas.style.width = 
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








function insertCanvas(img) {
  let photoIn = document.getElementById('photoInsertion');
  let lastPhoto = document.getElementById('photoForInsertion');

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      let posOfPhoto = getElementPosition(photoResizer);
      let posOfCanvas = getElementPosition(canvas);
      let dx = posOfPhoto.x - posOfCanvas.x, dy = posOfPhoto.y - posOfCanvas.y;
      let dWidth = photoResizer.offsetWidth, dHeight = photoResizer.offsetHeight;

      photoResizer.hidden = true;
      context.drawImage(img, 0, 0, img.width, img.height, dx, dy, dWidth, dHeight);
      document.removeEventListener('keydown', pressForInsertion);

      changePreview();
      rememberState(); 
    }
  }

  function setInitialParameters() {
    photoResizer.hidden = false;
    photoResizer.style.width = 'auto';
    photoResizer.style.height = 'auto';
    photoResizer.style.top = canvas.getBoundingClientRect().top + 'px';
    photoResizer.style.left = canvas.getBoundingClientRect().left + 'px';
    photoResizer.style.zIndex = activeLayer.index;
  }

  if (lastPhoto) photoIn.removeChild(lastPhoto);
  //photoIn.insertAdjacentHTML('afterbegin', "<img src='" + img.src + "' id='photoForInsertion'>");
  img.id = 'photoForInsertion';
  photoIn.appendChild(img);
  setInitialParameters();
  document.addEventListener('keydown', pressForInsertion);
  makeResizablePhoto();
}



