'use strict';

const MAX_HIST = 30;

class Snapshot {
  constructor(id, image, last) {
    this.layerId = id;
    if (last) {
      layers.forEach((layer, i) => {
        this[i] = last[i];
      });
    } else {
      layers.forEach((layer, i) => {
        this[i] = null;
      });
    }
    if (image) this[id] = image;
  }
}

let photoOfState = [new Snapshot(-1)];
let curState = 0;

function rememberState() {
  let img = new Image();
  img.onload = () => {
    checkCurLength();
    photoOfState.push(new Snapshot(activeLayer.id, img, photoOfState[curState++]));
  }
  img.src = canvas.toDataURL();
}

function checkCurLength() {
  let d = photoOfState.length - curState;
  if (d > 1) photoOfState.splice(curState + 1, d - 1);

  if (photoOfState.length > MAX_HIST) {
    photoOfState.shift();
    --curState;
  }
}

function drawCurCanvasesState() {
  clearAllLayers();

  let index;
  let snapshot = photoOfState[curState];
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

document.getElementById('undo').addEventListener('click', () => {
  if (curState > 0) {
    --curState;
    drawCurCanvasesState();
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (curState + 1 < photoOfState.length) {
    ++curState;
    drawCurCanvasesState();
  }
});
