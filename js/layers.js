'use strict'

let maxLayerId = 0;
let layersField = document.getElementById('layersField');
let addLayerTop = document.getElementById('addLayerTop');
let addLayerBottom = document.getElementById('addLayerBottom');

function createLayerHtml(id) {
  let newLayer = document.createElement('div');
  newLayer.classList.add('layer');
  newLayer.id = 'layerDisplay' + id;

  let previewLayer = document.createElement('canvas');
  previewLayer.classList.add('preview');
  newLayer.appendChild(previewLayer);

  return newLayer;
}

function createCanvasHtml(id) {
  let newCanvas = document.createElement('canvas');
  newCanvas.classList.add('mainCanvas');
  newCanvas.id = 'layer' + id;
  bottomLayer.canvas.after(newCanvas);
  return newCanvas;
}

class Layer {
  constructor(caller) {
    if (caller == 'firstLayer') {
      this.id = 0;
      this.display = document.getElementById('layerDisplay0');
      this.canvas = document.getElementById('layer0');
      this.preview = this.display.children[0];
      this.index = 50;
      this.canvas.style.zIndex = this.index;
      this.canvas.style.background = 'repeat url(\"img/background.png\")';
      return this;
    }

    this.id = ++maxLayerId;
    this.display = createLayerHtml(this.id);
    this.canvas = createCanvasHtml(this.id);
    canvas = this.canvas;
    this.preview = this.display.children[0];

    if (caller === 'addLayerTop') {
      topLayer.display.before(this.display);
      this.index = topLayer.index + 1;
      this.canvas.style.zIndex = this.index;
      topLayer = this.display;
    } else {
      bottomLayer.display.after(this.display);
      this.index = bottomLayer.index - 1;
      this.canvas.style.zIndex = this.index;
      this.canvas.style.background = 'repeat url(\"img/background.png\")';
      bottomLayer.canvas.style.removeProperty('background');
      bottomLayer = this.display;
    }
  }
}

let firstLayer = new Layer('firstLayer');
let topLayer = firstLayer;
let bottomLayer = firstLayer;

function addLayerHandler(event) {
  let caller = event.target.id;

  new Layer(caller);
}

addLayerTop.addEventListener('click', addLayerHandler);
addLayerBottom.addEventListener('click', addLayerHandler);
