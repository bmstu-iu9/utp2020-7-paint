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

  let mergeTopBtn = document.createElement('button');
  mergeTopBtn.id = 'mergeTop' + id;
  mergeTopBtn.innerText = 'Слить с верхним';
  optContainer.appendChild(mergeTopBtn);

  let mergeBotBtn = document.createElement('button');
  mergeBotBtn.id = 'mergeBottom' + id;
  mergeBotBtn.innerText = 'Слить с нижним';
  optContainer.appendChild(mergeBotBtn);

  let duplicateLayerBtn = document.createElement('button');
  duplicateLayerBtn.id = 'duplicateLayer' + id;
  duplicateLayerBtn.innerText = 'Дублировать';
  optContainer.appendChild(duplicateLayerBtn);

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
  layerDroplist.classList.add('layerBtn');
  layerDroplist.id = 'droplist' + id;

  let menuBtn = document.createElement('button');
  menuBtn.classList.add('layerOptionsBtn');
  menuBtn.classList.add('layerBtn');
  let menuBtnImg = document.createElement('img');
  menuBtnImg.src = 'img/tools/more_layer.svg';
  menuBtnImg.classList.add('layerOptionsImg');
  menuBtn.appendChild(menuBtnImg);
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
  newCanvas.style.margin = canvas.style.margin;
  getOldestLayer().canvas.after(newCanvas);
  return newCanvas;
}

function parseAllowedNodesId(str, allowedNodes) {
  for (let i = 0; i < allowedNodes.length; i++) {
    let name = allowedNodes[i];
    let cutStr = str.slice(0, name.length);
    if (cutStr === name) {
      let id = parseInt(str.slice(name.length));
      if (!isNaN(id)) return id;
    }
  }
  return null;
}

function parseLayerId(str) {
  let allowedNodes = ['layerDisplay', 'previewDiv',
                      'btnContainer', 'preview'];
  return parseAllowedNodesId(str, allowedNodes);
}

function parseLayerBtnId(str) {
  let allowedNodes = ['hideLayer', 'lockLayer'];
  return parseAllowedNodesId(str, allowedNodes);
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
  infoCanvasContext.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
  infoCanvasContext.drawImage(activeLayer.preview, 0, 0, infoCanvas.width, infoCanvas.height);
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

function getClosestTopLayer(curLayer) {
  let closestTopLayer = null;

  layers.forEach((layer) => {
    if (layer.index > curLayer.index
        && (closestTopLayer === null || layer.index < closestTopLayer.index)) {
      closestTopLayer = layer;
    }
  });

  return closestTopLayer;
}

function getClosestBotLayer(curLayer) {
  let closestBotLayer = null;

  layers.forEach((layer) => {
    if (layer.index < curLayer.index
        && (closestBotLayer === null || layer.index > closestBotLayer.index)) {
      closestBotLayer = layer;
    }
  });

  return closestBotLayer;
}

function disableBottomButtons(layer) {
  layer.isBottom = true;
  layer.swapBottomBtn.classList.add('inactive');
  layer.mergeBottomBtn.classList.add('inactive');
  layer.swapBottomBtn.removeEventListener('click', swapBottomHandler);
  layer.mergeBottomBtn.removeEventListener('click', mergeBottomHandler);
}

function enableBottomButtons(layer) {
  layer.isBottom = false;
  layer.swapBottomBtn.classList.remove('inactive');
  layer.mergeBottomBtn.classList.remove('inactive');
  layer.swapBottomBtn.addEventListener('click', swapBottomHandler);
  layer.mergeBottomBtn.addEventListener('click', mergeBottomHandler);
}

function disableTopButtons(layer) {
  layer.isTop = true;
  layer.swapTopBtn.classList.add('inactive');
  layer.mergeTopBtn.classList.add('inactive');
  layer.swapTopBtn.removeEventListener('click', swapTopHandler);
  layer.mergeTopBtn.removeEventListener('click', mergeTopHandler);
}

function enableTopButtons(layer) {
  layer.isTop = false;
  layer.swapTopBtn.classList.remove('inactive');
  layer.mergeTopBtn.classList.remove('inactive');
  layer.swapTopBtn.addEventListener('click', swapTopHandler);
  layer.mergeTopBtn.addEventListener('click', mergeTopHandler);
}

class Layer {
  constructor(caller, callerId) {
    this.id = ++maxLayerId;

    if (caller === 'firstLayer') {
      this.display = document.getElementById('layerDisplay0');
      this.preview = document.getElementById('preview0');
      this.canvas = document.getElementById('layer0');

      this.index = 50;
      this.canvas.style.zIndex = this.index;
      changeWindowSize(this.preview, maxPreviewHeight, maxPreviewWidth);
      changeWindowSize(infoCanvas, maxInfoCanvasHeight, maxInfoCanvasWidth);

      this.isTop = true;
      this.isBottom = true;

      this.hideBtn = document.getElementById('hideLayer0');
      this.lockBtn = document.getElementById('lockLayer0');
      this.deleteBtn = document.getElementById('deleteLayer0');
      this.addTopBtn = document.getElementById('addLayerTop0');
      this.addBottomBtn = document.getElementById('addLayerBottom0');
      this.swapTopBtn = document.getElementById('swapTop0');
      this.swapBottomBtn = document.getElementById('swapBottom0');
      this.mergeTopBtn = document.getElementById('mergeTop0');
      this.mergeBottomBtn = document.getElementById('mergeBottom0');
      this.duplicateLayerBtn = document.getElementById('duplicateLayer0');

      this.deleteBtn.classList.add('inactive');

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
      this.mergeTopBtn = options.children['mergeTop' + this.id];
      this.mergeBottomBtn = options.children['mergeBottom' + this.id];
      this.duplicateLayerBtn = options.children['duplicateLayer' + this.id];

      this.deleteBtn.addEventListener('click', deleteLayerHandler);

      this.isTop = false;
      this.isBottom = false;

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

    changeWindowSize(this.preview, maxPreviewHeight, maxPreviewWidth);
    changeWindowSize(infoCanvas, maxInfoCanvasHeight, maxInfoCanvasWidth);

    this.display.addEventListener('click', switchLayer);
    this.hideBtn.addEventListener('click', hideLayerHandler);
    this.lockBtn.addEventListener('click', lockLayerHandler);
    this.addTopBtn.addEventListener('click', addLayerTopHandler);
    this.addBottomBtn.addEventListener('click', addLayerBottomHandler);
    this.duplicateLayerBtn.addEventListener('click', duplicateLayerHandler);

    this.canvas.style.borderWidth = curCanvasBorder + 'px';
    this.canvas.style.borderStyle = 'solid';
    this.ctx = this.canvas.getContext('2d');

    if (caller.slice(0, 'addLayer'.length) === 'addLayer') {
      let callerLayer = layers.get(callerId);

      if (layers.size === 1) {
        let lastLayer = getOldestLayer();
        lastLayer.deleteBtn.classList.remove('inactive');
        lastLayer.deleteBtn.addEventListener('click', deleteLayerHandler);
      }

      if (caller === 'addLayerTop') {
        layers.forEach((layer) => {
          if (layer.index > callerLayer.index) {
            ++layer.index;
            layer.canvas.style.zIndex = layer.index;
          }
        });
        callerLayer.display.before(this.display);
        this.index = callerLayer.index + 1;
        this.canvas.style.zIndex = this.index;

        if (callerLayer.isTop) {
          enableTopButtons(callerLayer);
          this.isTop = true;
        }
      }

      if (caller === 'addLayerBottom') {
        layers.forEach((layer) => {
          if (layer.index < callerLayer.index) {
            --layer.index;
            layer.canvas.style.zIndex = layer.index;
          }
        });
        callerLayer.display.after(this.display);
        this.index = callerLayer.index - 1;
        this.canvas.style.zIndex = this.index;

        if (callerLayer.isBottom) {
          enableBottomButtons(callerLayer);
          this.isBottom = true;
        }
      }
    }

    if (this.isTop) {
      this.swapTopBtn.classList.add('inactive');
      this.mergeTopBtn.classList.add('inactive');
    } else {
      this.swapTopBtn.addEventListener('click', swapTopHandler);
      this.mergeTopBtn.addEventListener('click', mergeTopHandler);
    }
    if (this.isBottom) {
      this.swapBottomBtn.classList.add('inactive');
      this.mergeBottomBtn.classList.add('inactive');
    } else {
      this.swapBottomBtn.addEventListener('click', swapBottomHandler);
      this.mergeBottomBtn.addEventListener('click', mergeBottomHandler);
    }

    layers.set(this.id, this);
    allCanvases.push(this.canvas);
  }

  delete() {
    if (layers.size === 1) return;

    if (this.isTop) {
      let newTop = getClosestBotLayer(this);
      disableTopButtons(newTop);
    }
    if (this.isBottom) {
      let newBottom = getClosestTopLayer(this);
      disableBottomButtons(newBottom);
    }
    layers.delete(this.id);
    let pos = 0;
    while (allCanvases[pos].id != this.canvas.id) ++pos;
    allCanvases.splice(pos, 1);

    if (activeLayer.id === this.id) {
      setUpLayer(getOldestLayer());
    }

    this.canvas.remove();
    this.display.remove();
    deleteLayerHistory(this.id);

    if (layers.size === 1) {
      let lastLayer = getOldestLayer();
      lastLayer.deleteBtn.classList.add('inactive');
      lastLayer.deleteBtn.removeEventListener('click', deleteLayerHandler);
    }
  }
}

let firstLayer = new Layer('firstLayer');
activeLayer = firstLayer;

function changePreview(layer) {
  if (arguments.length === 0) {
    layer = activeLayer;
  }
  let countOfSteps = Math.ceil(Math.log(curCanvasWidth
                                        / layer.preview.width)
                               / Math.log(2));
  let oc = document.createElement('canvas');
  let octx = oc.getContext('2d');
  let dopOc = document.createElement('canvas');
  let dopOctx = dopOc.getContext('2d');

  oc.width = curCanvasWidth;
  oc.height = curCanvasHeight;
  dopOc.width = curCanvasWidth;
  dopOc.height = curCanvasHeight;

  octx.drawImage(layer.canvas, 0, 0, oc.width, oc.height);

  let i = 0;
  for (; i < countOfSteps - 1; i++) {
    dopOctx.clearRect(0, 0, dopOc.width, dopOc.height);
    dopOctx.drawImage(oc, 0, 0);

    octx.clearRect(0, 0, dopOc.width, dopOc.height);
    octx.drawImage(dopOc, 0, 0, oc.width / 2, oc.height / 2);
  }

  infoCanvasContext.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
  infoCanvasContext.drawImage(oc, 0, 0, oc.width/ (2 ** i), oc.height / (2 ** i),
                                  0, 0, infoCanvas.width, infoCanvas.height);

  let previewContext = layer.preview.getContext('2d');
  previewContext.clearRect(0, 0, layer.preview.width, layer.preview.height);
  previewContext.drawImage(oc, 0, 0, oc.width / (2 ** i), oc.height / (2 ** i),
                               0, 0, layer.preview.width, layer.preview.height);
}

function hideLayerHandler(event) {
  let layer = getLayerByBtn(event.target.id);
  if (!layer) return;

  layer.hideBtn.classList.toggle('hiddenLayer');

  if (layer.hidden) {
    layer.hidden = false;
    layer.canvas.style.visibility = 'visible';
    layer.hideBtn.title = 'Скрыть';
    layer.hideBtn.classList.remove('pressed');
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
  if (isNaN(id)) return;

  layers.get(id).delete();
}

function addLayerTopHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('addLayerTop'.length));

  if (!isNaN(id)) new Layer('addLayerTop', id);
}

function addLayerBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('addLayerBottom'.length));

  if (!isNaN(id)) new Layer('addLayerBottom', id);
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
  if (isNaN(id)) return;

  let curLayer = layers.get(id);
  let closestTopLayer = getClosestTopLayer(curLayer);

  if (closestTopLayer !== null) swapIndexes(curLayer, closestTopLayer);
}

function swapBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('swapBottom'.length));
  if (isNaN(id)) return;

  let curLayer = layers.get(id);
  let closestBotLayer = getClosestBotLayer(curLayer);

  if (closestBotLayer !== null) swapIndexes(closestBotLayer, curLayer);
}

function mergeTopHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('mergeTop'.length));
  if (isNaN(id)) return;

  let oldLayer = layers.get(id);
  let targetLayer = getClosestTopLayer(oldLayer);

  oldLayer.ctx.drawImage(targetLayer.canvas, 0, 0);
  targetLayer.ctx.drawImage(oldLayer.canvas, 0, 0);
  changePreview(targetLayer);
  rememberState();

  oldLayer.delete();
}

function mergeBottomHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('mergeBottom'.length));
  if (isNaN(id)) return;

  let oldLayer = layers.get(id);
  let targetLayer = getClosestBotLayer(oldLayer);

  targetLayer.ctx.drawImage(oldLayer.canvas, 0, 0);
  changePreview(targetLayer);
  rememberState();

  oldLayer.delete();
}


function duplicateLayerHandler(event) {
  let caller = event.target.id;
  let id = parseInt(caller.slice('duplicateLayer'.length));
  let source = layers.get(id).canvas;

  if (!isNaN(id)) {
    let newLayer = new Layer('addLayerTop', id);

    if (newLayer !== null) {
      newLayer.ctx.drawImage(source, 0, 0);
      changePreview(newLayer);
      rememberState();
    }
  }
}
