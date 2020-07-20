'use strict';

let eyedropperButton = document.getElementById('eyedropper');
let eyedropperWindow = document.getElementById('eyedropperWindow');

function initEyedropper() {
  canvas.addEventListener('mousemove', handleEyedropper);
  canvas.addEventListener('click', stopEyedropper);
}

function deleteEyedropper() {
  canvas.removeEventListener('mousemove', handleEyedropper);
  canvas.removeEventListener('click', stopEyedropper);
}

function stopEyedropper(event) {

  let eventLocation = getEventLocation(this, event);
  let color = getPixelColor(eventLocation.x, eventLocation.y);
  curColor = color;
  colorInput.value = "#" + rgbToHex(color);
  eyedropperWindow.hidden = true;
  deleteEyedropper();
}

function getPixelColor(x, y) {
  let pixel = context.getImageData(x, y, 1, 1);
  return pixel.data;
}

function handleEyedropper(event) {
  eyedropperWindow.hidden = false;

  let eventLocation = getEventLocation(this, event);
  let color = getPixelColor(eventLocation.x, eventLocation.y);
  eyedropperWindow.style.background = arrayToRgb(color);

  function moveWindow(x, y) {
    eyedropperWindow.style.left = (x + 10) + 'px';
    eyedropperWindow.style.top = (y + 40) + 'px';
  }

  moveWindow(eventLocation.x, eventLocation.y);
}
