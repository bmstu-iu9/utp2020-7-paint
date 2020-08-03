'use strict';

let maxLayerId = -1;
let activeLayer, topLayer, bottomLayer;
let layersField = document.getElementById('layersField');
let layers = new Map();
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

  let deleteBtn = document.createElement('button');
  deleteBtn.classList.add('layerBtn');
  deleteBtn.id = 'deleteLayer' + id;
  deleteBtn.title = 'Удалить'
  newLayer.appendChild(deleteBtn);

  return newLayer;
}

function createCanvasHtml(id) {
  let newCanvas = document.createElement('canvas');
  newCanvas.classList.add('mainCanvas');
  newCanvas.id = 'layer' + id;
  newCanvas.style.width = curCanvasWidth + 'px';
  newCanvas.setAttribute('width', curCanvasWidth + 'px');
  newCanvas.style.height = curCanvasHeight + 'px';
  newCanvas.setAttribute('height', curCanvasHeight + 'px');
  newCanvas.style.left = canvas.style.left;
  newCanvas.style.top = canvas.style.top;
  newCanvas.style.margin = canvas.style.margin;
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
  if (id !== null) return layers.get(id);
  return null;
}

function getLayerByBtn(target) {
  let id = parseLayerBtnId(target);
  if (id !== null) return layers.get(id);
  return null;
}

function setUpLayer(layer) {
  layer.canvas.style.pointerEvents = "auto";
  layer.display.classList.add('highlight');
  activeInstrument && activeInstrument.delete();
  canvas = layer.canvas;
  context = canvas.getContext('2d');

  activeInstrument && !layer.locked && activeInstrument.init();
  activeLayer = layer;
}

function switchLayer(event) {
  let layer = getLayerByDisplay(event.target.id);
  if (!layer || activeLayer.id === layer.id) return;
  activeLayer.canvas.style.pointerEvents = "none";
  activeLayer.display.classList.remove('highlight');
  setUpLayer(layer);
}

function getOldestLayer() {
  return layers.values().next().value;
}

class Layer {
  constructor(caller) {
    this.id = ++maxLayerId;
    if (caller == 'firstLayer') {
      this.display = document.getElementById('layerDisplay0');
      this.preview = document.getElementById('preview0');
      this.canvas = document.getElementById('layer0');

      this.index = 50;
      this.canvas.style.zIndex = this.index;

      this.hideBtn = document.getElementById('hideLayer0');
      this.lockBtn = document.getElementById('lockLayer0');
      this.deleteBtn = document.getElementById('deleteLayer0');
    } else {
      this.display = createLayerHtml(this.id);
      this.canvas = createCanvasHtml(this.id);
      this.preview = this.display.children['preview' + this.id];
      this.hideBtn = this.display.children['hideLayer' + this.id];
      this.lockBtn = this.display.children['lockLayer' + this.id];
      this.deleteBtn = this.display.children['deleteLayer' + this.id];

      activeLayer.canvas.style.pointerEvents = "none";
      this.canvas.style.pointerEvents = "auto";
      activeLayer.display.classList.remove('highlight');
      this.display.classList.add('highlight');
      activeInstrument && activeInstrument.delete();
      canvas = this.canvas;
      context = canvas.getContext('2d');
      activeInstrument && activeInstrument.init();
      activeLayer = this;
    }
    this.locked = false;
    this.hidden = false;

    this.display.addEventListener('click', switchLayer);
    this.hideBtn.addEventListener('click', hideLayerHandler);
    this.lockBtn.addEventListener('click', lockLayerHandler);
    this.deleteBtn.addEventListener('click', deleteLayerHandler);

    if (caller === 'addLayerTop') {
      topLayer.display.before(this.display);
      this.index = topLayer.index + 1;
      this.canvas.style.zIndex = this.index;
      topLayer = this;
    }
    if (caller === 'addLayerBottom') {
      bottomLayer.display.after(this.display);
      this.index = bottomLayer.index - 1;
      this.canvas.style.zIndex = this.index;
      bottomLayer = this;
    }

    layers.set(this.id, this);
    allCanvases.push(this.canvas);
    photoOfState.layers.set(this.id, []);
    ++photoOfState.length;
  }

  delete() {
    if (layers.length === 1) return;

    layers.delete(this.id);
    let pos = 0;
    while (allCanvases[pos].id != this.canvas.id) ++pos;
    allCanvases.splice(pos, 1);

    if (bottomLayer.id === this.id) {
      bottomLayer = getOldestLayer();
      layers.forEach((layer) => {
        if (bottomLayer.index > layer.index)
          bottomLayer = layer;
      });
    }

    if (topLayer.id === this.id) {
      topLayer = getOldestLayer();
      layers.forEach((layer) => {
        if (topLayer.index < layer.index)
          topLayer = layer;
      });
    }

    if (activeLayer.id === this.id) {
      setUpLayer(getOldestLayer());
    }

    this.canvas.remove();
    this.display.remove();
  }
}

let firstLayer = new Layer('firstLayer');
activeLayer = firstLayer;
topLayer = firstLayer;
bottomLayer = firstLayer;

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

function deleteLayerHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('deleteLayer'.length));
  console.log(id);
  layers.get(id).delete();
}
