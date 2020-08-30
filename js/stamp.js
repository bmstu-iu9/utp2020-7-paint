'use strict';

let stampX, stampY;
let isStamping;
let lastCanvas = document.createElement('canvas');
let lastContext = lastCanvas.getContext('2d');
let firstClickStamp = true;

function initStamp() {
  if (firstClickStamp) {
    toggleModal();
    hintsContent.innerHTML =
    `<p>Алгоритм работы с инструментом «Штамп»:</p>
    <ul>
    <li>1) Установить точку копирования щелчком левой кнопки мыши</li>
    <li>2) Зажать левую кнопку мыши и движением курсора начать проявлять скопированный фрагмент</li>
    <li>3) Для смены учатка проявления нажать Alt + Enter и выбрать новую область</li>
    </ul>`;
    firstClickStamp = false;
  }
  isStamping = false;
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('click', selectFragment);
}

function deleteStamp() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointStamp);
  canvas.removeEventListener('click', selectFragment);
  document.removeEventListener('mousemove', drawStamp);
  document.removeEventListener('mouseup', endPoint);
  document.removeEventListener('keydown', stopStamp);
}

function selectFragment(e) {
  [stampX, stampY] = getCurCoords(e);
  lastCanvas.width = curCanvasWidth;
  lastCanvas.height = curCanvasHeight;
  lastContext.drawImage(canvas, 0, 0);
  canvas.style.cursor = 'default';
  canvas.removeEventListener('click', selectFragment);
  canvas.addEventListener('mousedown', startPointStamp);
}

function resizeMemCanvas(x, y) {
  memContext.clearRect(0, 0, memCanvas.width, memCanvas.height);
  memCanvas.width = canvas.offsetWidth + x;
  memCanvas.height = canvas.offsetHeight + y;
}

function startPointStamp(e) {
  e.preventDefault();
  isDrawing = true;

  if (isThereSelection) rememberCanvasWithoutSelection();
  context.save();

  [oldX, oldY] = getCurCoords(e);
  oldX -= curToolSize / 2;
  oldY -= curToolSize / 2;

  if (!isStamping) {
    isStamping = true;
    let [x, y] = getCurCoords(e);
    x -= stampX;
    y -= stampY;
    resizeMemCanvas(Math.abs(x), Math.abs(y));
    memContext.drawImage(canvas, 0, 0);
    memContext.drawImage(lastCanvas, x, y);
  }

  drawSquareStamp(oldX, oldY);
  if (isThereSelection) uniteRememberAndSelectedImages();

  document.addEventListener('keydown', stopStamp);
  document.addEventListener('mousemove', drawStamp);
  document.addEventListener('mouseup', endPoint);
}

function drawStamp(e) {
  if (!isDrawing) return;

  if (isThereSelection) rememberCanvasWithoutSelection();

  [curX, curY] = getCurCoords(e);
  curX -= curToolSize / 2;
  curY -= curToolSize / 2;

  distance = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2))
  angle = Math.atan2(curX - oldX, curY - oldY);

  for (let i = 0; i < distance; i++) {
    newX = oldX + i * Math.sin(angle);
    newY = oldY + i * Math.cos(angle);
    drawSquareStamp(newX, newY);
  }

  oldX = curX;
  oldY = curY;

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}

function drawSquareStamp(x, y) {
  let newFragment = memContext.getImageData(x, y, curToolSize, curToolSize);
  context.putImageData(newFragment, x, y);
}

function stopStamp() {
  if (event.code === 'Enter' && event.altKey) {
    isStamping = false;
    document.removeEventListener('keydown', stopStamp);
  }
}
