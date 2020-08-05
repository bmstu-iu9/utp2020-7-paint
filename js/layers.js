'use strict';

let maxLayerId = -1;
let activeLayer;
let layersField = document.getElementById('layersField');
let layers = new Map();
let allCanvases = [backCanvas];

function createLayerHtml(id) {
  let newLayer = document.createElement('div');
  newLayer.classList.add('layer');
  newLayer.id = 'layerDisplay' + id;

  let previewDiv = document.createElement('div');
  previewDiv.classList.add('previewWindow');
  previewDiv.id = 'previewDiv' + id;
  newLayer.appendChild(previewDiv);

  let previewLayer = document.createElement('canvas');
  previewLayer.classList.add('preview');
  previewLayer.id = 'preview' + id;
  previewDiv.appendChild(previewLayer);

  let btnContainer = document.createElement('div');
  btnContainer.classList.add('layerBtncontainer');
  btnContainer.id = 'btnContainer' + id;
  newLayer.appendChild(btnContainer);

  let hideBtn = document.createElement('button');
  hideBtn.classList.add('layerBtn');
  hideBtn.classList.add('visibleLayer');
  hideBtn.id = 'hideLayer' + id;
  hideBtn.title = 'Скрыть';
  btnContainer.appendChild(hideBtn);

  let lockBtn = document.createElement('button');
  lockBtn.classList.add('layerBtn');
  lockBtn.classList.add('unlockedLayer');
  lockBtn.id = 'lockLayer' + id;
  lockBtn.title = 'Заблокировать'
  btnContainer.appendChild(lockBtn);

  let deleteBtn = document.createElement('button');
  deleteBtn.classList.add('layerBtn');
  deleteBtn.id = 'deleteLayer' + id;
  deleteBtn.title = 'Удалить'
  btnContainer.appendChild(deleteBtn);

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
    case 'previewDiv':
      return parseInt(str.slice('previewDiv'.length));
    case 'btnContainer':
      return parseInt(str.slice('btnContainer'.length));
      break;
    case 'pre':
      return parseInt(str.slice('preview'.length));
  }
  return null;
}

function parseLayerBtnId(str) {
  switch (str.slice(0, 3)) {
    case 'hid':
      return parseInt(str.slice('hideLayer'.length));
    case 'loc':
      return parseInt(str.slice('lockLayer'.length));
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
  constructor(caller, callerId) {
    this.id = ++maxLayerId;

    if (caller == 'firstLayer') {
      this.display = document.getElementById('layerDisplay0');
      this.preview = document.getElementById('preview0');
      this.canvas = document.getElementById('layer0');

      this.index = 50;
      this.canvas.style.zIndex = this.index;
      changePreviewSize(this.preview);

      this.hideBtn = document.getElementById('hideLayer0');
      this.lockBtn = document.getElementById('lockLayer0');
      this.deleteBtn = document.getElementById('deleteLayer0');
    } else {
      this.display = createLayerHtml(this.id);
      this.canvas = createCanvasHtml(this.id);
      this.preview = this.display.children['previewDiv' + this.id].children['preview' + this.id];
      this.hideBtn = this.display.children['btnContainer' + this.id].children['hideLayer' + this.id];
      this.lockBtn = this.display.children['btnContainer' + this.id].children['lockLayer' + this.id];
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

    changePreviewSize(this.preview);

    this.display.addEventListener('click', switchLayer);
    this.hideBtn.addEventListener('click', hideLayerHandler);
    this.lockBtn.addEventListener('click', lockLayerHandler);
    this.deleteBtn.addEventListener('click', deleteLayerHandler);

    if (caller === 'addLayerTop') {
      let callerLayer = layers.get(callerId);
      layers.forEach((layer) => {
        if (layer.index > callerLayer.index) {
          ++layer.index;
          layer.canvas.style.zIndex = this.index;
        }
      });
      callerLayer.display.before(this.display);
      this.index = callerLayer.index + 1;
      this.canvas.style.zIndex = this.index;
    }
    if (caller === 'addLayerBottom') {
      let callerLayer = layers.get(callerId);
      layers.forEach((layer) => {
        if (layer.index < callerLayer.index) {
          --layer.index;
          layer.canvas.style.zIndex = this.index;
        }
      });
      callerLayer.display.after(this.display);
      this.index = callerLayer.index - 1;
      this.canvas.style.zIndex = this.index;
    }

    layers.set(this.id, this);
    allCanvases.push(this.canvas);
    photoOfState.layers.set(this.id, []);
    ++photoOfState.length;
  }

  delete() {
    if (layers.size === 1) return;

    layers.delete(this.id);
    let pos = 0;
    while (allCanvases[pos].id != this.canvas.id) ++pos;
    allCanvases.splice(pos, 1);

    if (activeLayer.id === this.id) {
      setUpLayer(getOldestLayer());
    }

    this.canvas.remove();
    this.display.remove();
  }
}

let firstLayer = new Layer('firstLayer');
activeLayer = firstLayer;

function changePreview() {
  let previewContext = activeLayer.preview.getContext('2d');
  previewContext.clearRect(0, 0, activeLayer.preview.width, activeLayer.preview.height);
  previewContext.drawImage(canvas, 0, 0, activeLayer.preview.width, activeLayer.preview.height);
}

function hideLayerHandler(event) {
  let layer = getLayerByBtn(event.target.id);
  if (!layer) return;

  layer.hideBtn.classList.toggle('hiddenLayer');

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

  layer.lockBtn.classList.toggle('lockedLayer');

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
  if (id === NaN) return;

  layers.get(id).delete();
  clearLayerHistory(id);
}

function addLayerTopHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('addLayerTop'.length));

  if (id !== NaN) new Layer('addLayerTop', id);
}

function addLayerBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('addLayerBottom'.length));

  if (id !== NaN) new Layer('addLayerBottom', id);
}

function swapIndexes(layer1, layer2) {
  let temp = layer1.index;
  layer1.index = layer2.index;
  layer2.index = temp;

  layer1.canvas.style.zIndex = layer1.index;
  layer2.canvas.style.zIndex = layer2.index;
}

function swapTopHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('swapTop'.length));
  if (id === NaN) return;
  let closestTopLayer = getOldestLayer();
  let curLayer = layers.get(id);

  layers.forEach((layer) => {
    if (layer.index > curLayer.index && layer.index < closestTopLayer.index) {
      closestTopLayer = layer;
    }
  });

  swapIndexes(closestTopLayer, curLayer);
}

function swapBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('swapBottom'.length));
  if (id === NaN) return;
  let closestBotLayer = getOldestLayer();
  let curLayer = layers.get(id);

  layers.forEach((layer) => {
    if (layer.index < curLayer.index && layer.index > closestBotLayer.index) {
      closestBotLayer = layer;
    }
  });

  swapIndexes(closestBotLayer, curLayer);
}
