'use strict';

let firstClickHand = true;
let canvasResizer = document.getElementById('canvasResizer');
let isResized = false;

function initHand() {
  if (firstClickHand) {
    toggleHintModal();
    hintsContent.innerHTML =
    `<p>Инструмент «Рука»</p>
    <ul>
    <li>1) Перемещение холста по рабочей области</li>
    <li>2) Двойное нажатие на холст для центрирования</li>
    <li>3) Изменение размеров холста через правый нижний угол</li>
    </ul>`;
    firstClickHand = false;
  }
  canvas.addEventListener('dragstart', function() {
    return false;
  });
  canvas.addEventListener('mousedown', startMoving);
  isResized = false;
  canvas.style.cursor = 'grab';
  canvasResizer.hidden = false;
  canvasesField.style.borderColor = '#bbbbbb';
}

function deleteHand() {
  if (isResized) rememberSize();

  canvas.removeEventListener('mousedown', startMoving);
  canvas.removeEventListener('dblclick', centerCanvas);
  canvas.style.cursor = 'default';
  canvasResizer.hidden = true;
  canvasesField.style.borderColor = 'transparent';
}

canvas.ondragstart = () => false;

function startMoving(e) {

  canvas.style.cursor = 'grabbing';

  let coords = getElementPosition(canvas);
  let shiftX = e.pageX - coords.x;
  let shiftY = e.pageY - coords.y;

  move(e);

  function move(e) {
    canvasesField.style.margin = '0';
    canvasesField.style.left = e.pageX - shiftX + 'px';
    canvasesField.style.top = e.pageY - shiftY + 'px';
  }

  function stopMoving() {
    canvas.style.cursor = 'grab';
    document.removeEventListener('mousemove', move);
    canvas.removeEventListener('mouseup', stopMoving);
  }

  document.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', stopMoving);
  canvas.addEventListener('dblclick', centerCanvas);
}

function centerCanvas() {
  canvasesField.style.margin = 'auto';
  canvasesField.style.left = 0;
  canvasesField.style.top = '45px';
}

canvasResizer.addEventListener('mousedown', function(e) {
  e.preventDefault();
  e.stopPropagation();
  document.body.style.cursor = 'nwse-resize';
  canvas.style.cursor = 'nwse-resize';
  let originalWidth = curCanvasWidth, originalHeight = curCanvasHeight;
  let originalMouseX = e.pageX, originalMouseY = e.pageY;
  let originalX = canvas.getBoundingClientRect().left;
  let originalY = canvas.getBoundingClientRect().top;

  function resize(e) {
    if (isThereSelection) deleteSelectedArea();
    if (canvasesField.style.margin === 'auto' || canvasesField.style.margin === '') {
      canvasesField.style.margin = '0';
      canvasesField.style.left = originalX - 3 * zoomValue + 'px';
      canvasesField.style.top = originalY - 3 * zoomValue + 'px';
    }
    let newWidth = Math.round(originalWidth + (e.pageX - originalMouseX) / zoomValue);
    let newHeight = Math.round(originalHeight + (e.pageY - originalMouseY) / zoomValue);
    if (newWidth <= changeCanvasWidth.max && newWidth >= changeCanvasWidth.min) {
      curCanvasWidth = newWidth;
      updateCanvasWidth();
    }
    if (newHeight <= changeCanvasHeight.max && newHeight >= changeCanvasHeight.min) {
      curCanvasHeight = newHeight;
      updateCanvasHeight();
    }
    restoreCanvasesState();
  }

  function stopResize() {
    isResized = true;

    canvas.style.cursor = 'grab';
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
});
