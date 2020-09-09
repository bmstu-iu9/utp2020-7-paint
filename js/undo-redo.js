'use strict';

const MAX_HIST = 20;

class Snapshot {
  constructor(layerId, image, last) {
    this.layerId = layerId;
    this.width = curCanvasWidth;
    this.height = curCanvasHeight;

    if (last) {
      layers.forEach((layer, i) => {
        this[i] = last[i];
      });
    } else {
      layers.forEach((layer, i) => {
        this[i] = null;
      });
    }
    if (image) this[layerId] = image;
  }
}

let layersHistory = [new Snapshot(-1)];
let curState = 0;
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');

function rememberState() {
  let img = new Image();
  img.onload = () => {
    checkCurLength();
    layersHistory.push(new Snapshot(activeLayer.id, img, layersHistory[curState++]));
  }
  img.src = canvas.toDataURL();
}

function rememberSize() {
  checkCurLength();
  let lastSnapshots = layersHistory[curState++];
  if (curCanvasWidth < lastSnapshots.width || curCanvasHeight < lastSnapshots.height) {
    layersHistory.push(new Snapshot(-1));
    let newSnapshots = layersHistory[curState];
    layers.forEach((layer, i) => {
      let img = new Image();
      img.onload = () => {
        newSnapshots[i] = img;
      }
      img.src = layer.canvas.toDataURL();
    })
  } else layersHistory.push(new Snapshot(-1, null, lastSnapshots))
}

function checkCurLength() {
  let d = layersHistory.length - curState;
  if (d > 1) layersHistory.splice(curState + 1, d - 1);

  if (layersHistory.length > MAX_HIST) {
    layersHistory.shift();
    --curState;
  }
}

function restoreCanvasesState() {
  clearAllLayers();

  let index;
  let snapshot = layersHistory[curState];
  for (let i in snapshot) {
    if (!isNaN(index = parseInt(i))) {
      let layer = layers.get(index);
      let ctx = layer.canvas.getContext('2d');
      if (snapshot[i]) {
        ctx.drawImage(snapshot[i], 0, 0, snapshot[i].width, snapshot[i].height);
      }
      changePreview(layer);
    }
  }
}

function restoreCanvasesSize() {
  curCanvasWidth = layersHistory[curState].width;
  curCanvasHeight = layersHistory[curState].height;
  updateCanvasWidth();
  updateCanvasHeight();
}

undo.addEventListener('click', () => {
  if (curState > 0) {
    --curState;
    restoreCanvasesSize();
    restoreCanvasesState();
  }
});

redo.addEventListener('click', () => {
  if (curState + 1 < layersHistory.length) {
    ++curState;
    restoreCanvasesSize();
    restoreCanvasesState();
  }
});
