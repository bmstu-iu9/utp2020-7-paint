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
    `<p>Алгоритм работы со штампом: </p>
    <ol>
    <li>Установить точку копирования щелчком левой кнопки мыши</li>
    <li>Зажать левую кнопку мыши и движением курсора начать проявлять скопированный фрагмент</li>
    <li>Для смены учатка проявления нажать Alt + Enter и выбрать новую область</li>
    </ol>`;
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
  stampX = e.offsetX;
  stampY = e.offsetY;
  lastCanvas.width = canvas.width;
  lastCanvas.height = canvas.height;
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
  oldX = e.offsetX - curToolSize / 2;
  oldY = e.offsetY - curToolSize / 2;
  deltaX = e.pageX - e.offsetX;
  deltaY = e.pageY - e.offsetY;

  if (!isStamping) {
    isStamping = true;
    let x = e.offsetX - stampX;
    let y = e.offsetY - stampY;
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
  curX = e.pageX - deltaX - curToolSize / 2;
  curY = e.pageY - deltaY - curToolSize / 2;

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
  if (event.code == 'Enter' && event.altKey) {
    isStamping = false;
    document.removeEventListener('keydown', stopStamp);
  }
}
