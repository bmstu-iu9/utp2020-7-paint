'use strict';

let maxLayerId = 0;
let activeLayer;
let layersField = document.getElementById('layersField');
let layers = [];
let allCanvases = [backCanvas];
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

  let hideBtn = document.createElement('button');
  hideBtn.classList.add('layerBtn');
  hideBtn.id = 'hideLayer' + id;
  hideBtn.title = 'Скрыть';
  newLayer.appendChild(hideBtn);

  let lockBtn = document.createElement('button');
  lockBtn.classList.add('layerBtn');
  lockBtn.id = 'lockLayer' + id;
  lockBtn.title = 'Заблокировать'
  newLayer.appendChild(lockBtn);

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
  return null;
}

function parseLayerBtnId(str) {
  switch (str.slice(0, 3)) {
    case 'hid':
      return parseInt(str.slice('hideLayer'.length));
      break;
    case 'loc':
      return parseInt(str.slice('lockLayer'.length));
      break;
  }
  return null;
}

function getLayerByDisplay(target) {
  let id = parseLayerId(target);
  if (id !== null) return layers[id];
  return null;
}

function getLayerByBtn(target) {
  let id = parseLayerBtnId(target);
  if (id !== null) return layers[id];
  return null;
}

function switchLayer(event) {
  let layer = getLayerByDisplay(event.target.id);
  if (!layer || activeLayer.id === layer.id) return;
  activeLayer.canvas.style.pointerEvents = "none";
  layer.canvas.style.pointerEvents = "auto";
  activeLayer.display.classList.remove('highlight');
  layer.display.classList.add('highlight');
  activeInstrument && activeInstrument.delete();
  canvas = layer.canvas;
  context = canvas.getContext('2d');

  activeInstrument && !layer.locked && activeInstrument.init();
  activeLayer = layer;
}

class Layer {
  constructor(caller) {
    if (caller == 'firstLayer') {
      this.id = 0;
      this.display = document.getElementById('layerDisplay0');
      this.display.addEventListener('click', switchLayer);
      this.preview = document.getElementById('preview0');

      this.canvas = document.getElementById('layer0');
      
      this.index = 50;
      this.canvas.style.zIndex = this.index;

      this.hideBtn = document.getElementById('hideLayer0');
      this.hidden = false;
      this.lockBtn = document.getElementById('lockLayer0');
      this.locked = false;

      this.lockBtn.addEventListener('click', lockLayerHandler);
      this.hideBtn.addEventListener('click', hideLayerHandler);

      layers.push(this);
      allCanvases.push(this.canvas);
      photoOfState.push([this.canvas.toDataURL()]);
      return this;
    }

    this.id = ++maxLayerId;
    this.display = createLayerHtml(this.id);
    this.display.addEventListener('click', switchLayer);
    this.canvas = createCanvasHtml(this.id);
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    this.canvas.style.left = canvas.style.left;
    this.canvas.style.top = canvas.style.top;
    this.canvas.style.margin = canvas.style.margin;

    activeLayer.canvas.style.pointerEvents = "none";
    this.canvas.style.pointerEvents = "auto";
    activeLayer.display.classList.remove('highlight');
    this.display.classList.add('highlight');
    activeInstrument && activeInstrument.delete();
    canvas = this.canvas;
    context = canvas.getContext('2d');
    activeInstrument && activeInstrument.init();
    activeLayer = this;
    let imgOfCanvas = canvas.toDataURL();
    if (photoOfState[0].length == 2) {
      photoOfState.push([imgOfCanvas, imgOfCanvas]);
    } else photoOfState.push([imgOfCanvas]);


    this.preview = this.display.children['preview' + this.id];
    this.hideBtn = this.display.children['hideLayer' + this.id];
    this.hidden = false;
    this.lockBtn = this.display.children['lockLayer' + this.id];
    this.locked = false;

    this.hideBtn.addEventListener('click', hideLayerHandler);
    this.lockBtn.addEventListener('click', lockLayerHandler);

    if (caller === 'addLayerTop') {
      topLayer.display.before(this.display);
      this.index = topLayer.index + 1;
      this.canvas.style.zIndex = this.index;
      topLayer = this;
    } else {
      bottomLayer.display.after(this.display);
      this.index = bottomLayer.index - 1;
      this.canvas.style.zIndex = this.index;
      bottomLayer = this;
    }

    allCanvases.push(this.canvas);
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

function changePreview() {
  let previewContext = activeLayer.preview.getContext('2d');
  previewContext.clearRect(0, 0, activeLayer.preview.width, activeLayer.preview.height);
  previewContext.drawImage(canvas, 0, 0, activeLayer.preview.width, activeLayer.preview.height);
}

function hideLayerHandler(event) {
  let layer = getLayerByBtn(event.target.id);
  if (!layer) return;

  if (layer.hidden) {
    layer.hidden = false;
    layer.canvas.style.visibility = 'visible';
    layer.hideBtn.title = 'Скрыть';
    layer.hideBtn.classList.remove('pressed'); // TODO: create this class
  } else {
    layer.hidden = true;
    layer.canvas.style.visibility = 'hidden';
    layer.hideBtn.title = 'Показать';
    layer.hideBtn.classList.add('pressed');
  }
}

function lockLayerHandler(event) {
  let layer = getLayerByBtn(event.target.id);
  if (!layer) return;

  let cond = layer.locked;
  if (cond) {
    layer.locked = false;
    activeInstrument && activeInstrument.init();
    layer.lockBtn.title = 'Заблокировать';
    layer.lockBtn.classList.remove('pressed');
    layer.display.classList.remove('locked');
  } else {
    layer.locked = true;
    activeInstrument && activeInstrument.delete();
    layer.lockBtn.title = 'Разблокировать';
    layer.lockBtn.classList.add('pressed');
    layer.display.classList.add('locked');
  }
}
