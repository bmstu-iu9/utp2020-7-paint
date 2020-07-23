'use strict';

let eyedropperButton = document.getElementById('eyedropper');
let eyedropperWindow = document.getElementById('eyedropperWindow');

function initEyedropper() {
  canvas.style.cursor = "url('img/cursors/eyedropper-cursor.png') 0 20, auto";

  canvas.addEventListener('mousemove', handleEyedropper);
  canvas.addEventListener('click', stopEyedropper);
  canvas.addEventListener('mouseenter', switchEyedropperWindow);
  canvas.addEventListener('mouseout', switchEyedropperWindow);
}

function deleteEyedropper() {
  canvas.style.cursor = 'default';

  canvas.removeEventListener('mousemove', handleEyedropper);
  canvas.removeEventListener('click', stopEyedropper);
  canvas.removeEventListener('mouseenter', switchEyedropperWindow);
  canvas.removeEventListener('mouseout', switchEyedropperWindow);
}

function stopEyedropper(event) {
  let eventLocation = getEventLocation(this, event);
  let color = getPixelColor(eventLocation.x, eventLocation.y);
  curColor = color;
  colorInput.value = "#" + rgbToHex(color);
  switchEyedropperWindow();
  eyedropperButton.click();
}

function switchEyedropperWindow() {
  eyedropperWindow.hidden = !eyedropperWindow.hidden;
}

function getPixelColor(x, y) {
  let pixel = context.getImageData(x, y, 1, 1);
  return pixel.data;
}

function handleEyedropper(event) {
  let eventLocation = getEventLocation(this, event);
  let color = getPixelColor(eventLocation.x, eventLocation.y);
  eyedropperWindow.style.background = arrayToRgb(color);

  function moveWindow() {
    eyedropperWindow.style.left = event.pageX + 15 + 'px';
    eyedropperWindow.style.top = event.pageY - 35 + 'px';
  }

  moveWindow();
}
