'use strict';

function rememberState() {
  let curId = activeLayer.id;
  let photoOfLayer = photoOfState.layers;
  let img = new Image();
  img.onload = () => {
    checkCurLength();
    ++curState;
    photoOfLayer.get(curId)[curState] = img;
    photoOfLayer.forEach((value, key) => {
      if (key !== curId) value[curState] = value[curState - 1];
    });
    ++photoOfState.length;
  }
  img.src = canvas.toDataURL();
}

function checkCurLength() {
  let d = photoOfState.length - curState;
  if (d > 1) {
    photoOfState.layers.forEach(value => value.splice(curState + 1, d - 1));
    photoOfState.length -= d - 1;
  }

  if (photoOfState.length > 20) {
    photoOfState.layers.forEach(value => value.shift());
    --curState;
    --photoOfState.length;
  }
}

document.getElementById('undo').addEventListener('click', () => {
  if (curState > 0) {
    --curState;
    clearAllLayers();
    photoOfState.layers.forEach((value, key) => {
      let layer = layers.get(key).canvas;
      let ctx = layer.getContext('2d');
      if (value[curState]) {
        ctx.drawImage(value[curState], 0, 0, layer.width, layer.height);
      }
    })
    changePreview();
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (curState + 1 < photoOfState.length) {
    ++curState;
    clearAllLayers();
    photoOfState.layers.forEach((value, key) => {
      let layer = layers.get(key).canvas;
      let ctx = layer.getContext('2d');
      if (value[curState]) {
        ctx.drawImage(value[curState], 0, 0, layer.width, layer.height);
      }
    })
    changePreview();
  }
});
