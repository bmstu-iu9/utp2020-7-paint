'use strict';

let maxLayerId = -1;
let activeLayer;
let layersField = document.getElementById('layersField');
let layers = new Map();
let allCanvases = [backCanvas];

function createLayerOptionsHtml(id) {
  let optContainer = document.createElement('div');
  optContainer.classList.add('layerOptions');
  optContainer.id = 'layerOptions' + id;

  let deleteBtn = document.createElement('button');
  deleteBtn.id = 'deleteLayer' + id;
  deleteBtn.innerText = 'Удалить слой';
  optContainer.appendChild(deleteBtn);

  let addTopBtn = document.createElement('button');
  addTopBtn.id = 'addLayerTop' + id;
  addTopBtn.innerText = 'Добавить слой сверху';
  optContainer.appendChild(addTopBtn);

  let addBotBtn = document.createElement('button');
  addBotBtn.id = 'addLayerBottom' + id;
  addBotBtn.innerText = 'Добавить слой снизу';
  optContainer.appendChild(addBotBtn);

  let swapTopBtn = document.createElement('button');
  swapTopBtn.id = 'swapTop' + id;
  swapTopBtn.innerText = 'Поднять слой';
  optContainer.appendChild(swapTopBtn);

  let swapBotBtn = document.createElement('button');
  swapBotBtn.id = 'swapBottom' + id;
  swapBotBtn.innerText = 'Опустить слой';
  optContainer.appendChild(swapBotBtn);

  return optContainer;
}

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

  let layerDroplist = document.createElement('div');
  layerDroplist.classList.add('droplist');
  layerDroplist.id = 'droplist' + id;

  let menuBtn = document.createElement('button');
  menuBtn.classList.add('layerOptionsBtn');
  layerDroplist.appendChild(menuBtn);
  layerDroplist.appendChild(createLayerOptionsHtml(id));
  btnContainer.appendChild(layerDroplist);

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
  getOldestLayer().canvas.after(newCanvas);
  return newCanvas;
}

function parseAlowedNodesId(str, allowedNodes) {
  for (let i = 0; i < allowedNodes.length; i++) {
    let name = allowedNodes[i];
    let cutStr = str.slice(0, name.length);
    if (cutStr === name) {
      let id = parseInt(str.slice(name.length));
      if (id !== NaN) return id;
    }
  }
  return null;
}

function parseLayerId(str) {
  let allowedNodes = ['layerDisplay', 'previewDiv',
                      'btnContainer', 'preview'];
  return parseAlowedNodesId(str, allowedNodes);
}

function parseLayerBtnId(str) {
  let allowedNodes = ['hideLayer', 'lockLayer'];
  return parseAlowedNodesId(str, allowedNodes);
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
  layer.canvas.style.pointerEvents = 'auto';
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
  activeLayer.canvas.style.pointerEvents = 'none';
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
      this.addTopBtn = document.getElementById('addLayerTop0');
      this.addBottomBtn = document.getElementById('addLayerBottom0');
      this.swapTopBtn = document.getElementById('swapTop0');
      this.swapBottomBtn = document.getElementById('swapBottom0');
    } else {
      this.display = createLayerHtml(this.id);
      this.canvas = createCanvasHtml(this.id);
      this.preview = this.display.children['previewDiv' + this.id]
                                 .children['preview' + this.id];

      let btnContainer = this.display.children['btnContainer' + this.id]
      this.hideBtn = btnContainer.children['hideLayer' + this.id];
      this.lockBtn = btnContainer.children['lockLayer' + this.id];

      let droplist = btnContainer.children['droplist' + this.id];
      let options = droplist.children['layerOptions' + this.id]
      this.deleteBtn = options.children['deleteLayer' + this.id];
      this.addTopBtn = options.children['addLayerTop' + this.id];
      this.addBottomBtn = options.children['addLayerBottom' + this.id];
      this.swapTopBtn = options.children['swapTop' + this.id];
      this.swapBottomBtn = options.children['swapBottom' + this.id];

      activeLayer.canvas.style.pointerEvents = 'none';
      this.canvas.style.pointerEvents = 'auto';
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
    this.addTopBtn.addEventListener('click', addLayerTopHandler);
    this.addBottomBtn.addEventListener('click', addLayerBottomHandler);
    this.swapTopBtn.addEventListener('click', swapTopHandler);
    this.swapBottomBtn.addEventListener('click', swapBottomHandler);

    this.canvas.style.borderWidth = curCanvasBorder + 'px';
    this.canvas.style.borderColor = curCanvasBorderColor;
    this.canvas.style.borderStyle = 'solid';
    
    if (caller === 'addLayerTop') {
      let callerLayer = layers.get(callerId);
      layers.forEach((layer) => {
        if (layer.index > callerLayer.index) {
          ++layer.index;
          layer.canvas.style.zIndex = layer.index;
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
          layer.canvas.style.zIndex = layer.index;
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

function changePreview(layer) {
  if (arguments.length == 0) {
    layer = activeLayer;
  }
  let countOfSteps = Math.ceil(Math.log(layer.canvas.width / layer.preview.width) / Math.log(2));
  let oc = document.createElement('canvas');
  let octx = oc.getContext('2d');
  let dopOc = document.createElement('canvas');
  let dopOctx = dopOc.getContext('2d');
  
  oc.width = layer.canvas.width;
  oc.height = layer.canvas.height;
  dopOc.width = layer.canvas.width;
  dopOc.height = layer.canvas.height;
  
  octx.drawImage(layer.canvas, 0, 0, oc.width, oc.height);
  
  let i = 0;
  for (; i < countOfSteps - 1; i++) {
    dopOctx.clearRect(0, 0, dopOc.width, dopOc.height);
    dopOctx.drawImage(oc, 0, 0);
    
    octx.clearRect(0, 0, dopOc.width, dopOc.height);
    octx.drawImage(dopOc, 0, 0, oc.width / 2, oc.height / 2);
  }
  
  let previewContext = layer.preview.getContext('2d');
  previewContext.clearRect(0, 0, layer.preview.width, layer.preview.height);
  previewContext.drawImage(oc, 0, 0, oc.width / (2 ** i), oc.height / (2 ** i), 0, 0, layer.preview.width, layer.preview.height);
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

  let display1 = layer1.display, display2 = layer2.display;

  display1.parentNode.insertBefore(display1, display2);
}

function swapTopHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('swapTop'.length));
  if (id === NaN) return;
  let closestTopLayer = getOldestLayer();
  let curLayer = layers.get(id);

  layers.forEach((layer) => {
    if (layer.index > curLayer.index &&
       (closestTopLayer === null || layer.index < closestTopLayer.index)) {
      closestTopLayer = layer;
    }
  });

  if (closestTopLayer != null) swapIndexes(curLayer, closestTopLayer);
}

function swapBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('swapBottom'.length));
  if (id === NaN) return;
  let closestBotLayer = null;
  let curLayer = layers.get(id);

  layers.forEach((layer) => {
    if (layer.index < curLayer.index &&
       (closestBotLayer === null || layer.index > closestBotLayer.index)) {
      closestBotLayer = layer;
    }
  });

  if (closestBotLayer != null) swapIndexes(closestBotLayer, curLayer);
}
