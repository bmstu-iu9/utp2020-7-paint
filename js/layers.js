'use strict';

let maxLayerId = 0;
let activeLayer;
let layersField = document.getElementById('layersField');
let layers = [];
let addLayerTop = document.getElementById('addLayerTop');
let addLayerBottom = document.getElementById('addLayerBottom');

function createLayerHtml(id) {
  let newLayer = document.createElement('div');
  newLayer.classList.add('layer');
  newLayer.id = 'layerDisplay' + id;

  let previewLayer = document.createElement('canvas');
  previewLayer.classList.add('preview');
  previewLayer.id = 'preview' + id;
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

function parseLayerId(str) {
  switch (str.slice(0, 3)) {
    case 'lay':
      return parseInt(str.slice('layerDisplay'.length));
      break;
    case 'pre':
      return parseInt(str.slice('preview'.length));
      break;
  }
}

function getLayerByDisplay(target) {
  let id = parseLayerId(target);
  return layers[id];
}

function switchLayer(event) {
  let layer = getLayerByDisplay(event.target.id);
  if (activeLayer.id === layer.id) return;
  activeLayer.canvas.style.pointerEvents = "none";
  layer.canvas.style.pointerEvents = "auto";
  activeLayer.display.classList.remove('highlight');
  layer.display.classList.add('highlight');
  activeInstrument && activeInstrument.delete();
  canvas = layer.canvas;
  context = canvas.getContext('2d');
  activeInstrument && activeInstrument.init();
  activeLayer = layer;
}

class Layer {
  constructor(caller) {
    if (caller == 'firstLayer') {
      this.id = 0;
      this.display = document.getElementById('layerDisplay0');
      this.display.addEventListener('click', switchLayer);
      this.canvas = document.getElementById('layer0');
      this.preview = this.display.children[0];
      this.index = 50;
      this.canvas.style.zIndex = this.index;
      this.canvas.style.background = 'repeat url(\"img/background.png\")';
      layers.push(this);
      return this;
    }

    this.id = ++maxLayerId;
    this.display = createLayerHtml(this.id);
    this.display.addEventListener('click', switchLayer);
    this.canvas = createCanvasHtml(this.id);
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    
    //canvas = this.canvas;
    this.canvas.style.pointerEvents = "none";
    
    this.preview = this.display.children[0];

    if (caller === 'addLayerTop') {
      topLayer.display.before(this.display);
      this.index = topLayer.index + 1;
      this.canvas.style.zIndex = this.index;
      topLayer = this;
    } else {
      bottomLayer.display.after(this.display);
      this.index = bottomLayer.index - 1;
      this.canvas.style.zIndex = this.index;
      this.canvas.style.background = 'repeat url(\"img/background.png\")';
      bottomLayer.canvas.style.removeProperty('background');
      bottomLayer = this;
    }

    layers.push(this);
  }
}

let firstLayer = new Layer('firstLayer');
activeLayer = firstLayer;
let topLayer = firstLayer;
let bottomLayer = firstLayer;

function addLayerHandler(event) {
  let caller = event.target.id;

  new Layer(caller);
}

addLayerTop.addEventListener('click', addLayerHandler);
addLayerBottom.addEventListener('click', addLayerHandler);
