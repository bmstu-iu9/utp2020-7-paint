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
  let curCanvasId = activeLayer.id;
  let maxIndex = bottomLayer.index - 1, highestPixel = [0, 0, 0, 0], pixel;
  layers.forEach(layer => {
    canvas = layer.canvas;
    pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    if (maxIndex < layer.index && pixel.some(elem => elem !== 0)) {
      maxIndex = layer.index;
      highestPixel = pixel;
    }
  });
  canvas = layers[curCanvasId].canvas;
  return highestPixel;
}

function handleEyedropper(event) {
  let eventLocation = getEventLocation(this, event);
  let color = getPixelColor(eventLocation.x, eventLocation.y);
  if (color.every(elem => elem === 0)) {
    eyedropperWindow.style.background = 'url(\"img/background.png\")';
  } else eyedropperWindow.style.background = arrayToRgb(color);

  function moveWindow() {
    eyedropperWindow.style.left = event.pageX + 15 + 'px';
    eyedropperWindow.style.top = event.pageY - 40 + 'px';
  }

  moveWindow();
}
