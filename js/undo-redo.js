'use strict';

let isReplaying = false;
let photoOfState = [[]];

function rememberFilling(...cords) {
  checkCurCords();
  curCords.push({
    id: 'Filling',
    cords: cords,
    color: curColor,
    allowableColorDifference: curAllowableColorDifference,
    layer: activeLayer.id
  });
  ++curState;
}

function rememberImage(img) {
  checkCurCords();
  curCords.push({
    id: 'Image',
    img: img,
    layer: activeLayer.id
  });
  ++curState;
}

function rememberDrawingTool(id, ...cords) {
  checkCurCords();
  curCords.push({
    id: id,
    color: curColor.slice(0),
    toolSize: curToolSize,
    cords: cords,
    layer: activeLayer.id
  });
  ++curState;
}

function checkCurCords() {
  let d = curCords.length - curState;
  if (d >= 1) curCords.splice(curState, d);
  if (curCords.length == 50) {
    layers.forEach((layer, i) => {
      photoOfState[i].pop();
      photoOfState[i].push(layer.canvas.toDataURL());
    });
  } else if (curCords.length == 100) {
    if (photoOfState[0].length == 2) layers.forEach((layer, i) => photoOfState[i].shift());
    layers.forEach((layer, i) => photoOfState[i].push(layer.canvas.toDataURL()));
    curCords.splice(0, curState = 50);
  }
}

document.getElementById('undo').addEventListener('click', () => {
  if (curState > 0) {
    --curState;
    clearAllLayers();
    if (photoOfState[0].length == 2) insertPhotoAndReplay()
    else replayActions(activeLayer.id);
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (curState < curCords.length) {
    ++curState;
    clearAllLayers();
    if (photoOfState[0].length == 2) insertPhotoAndReplay();
    else replayActions(activeLayer.id);
  }
});

function replayActions(curCanvasId) {
  isReplaying = true;
  if (activeInstrument !== null) activeInstrument.delete();
  let activeToolSize = curToolSize;
  let activeColor = curColor;
  let activeAllowableColorDifference = curAllowableColorDifference;
  for (let i = 0; i < curState; i++) {
    canvas = layers[curCords[i].layer].canvas;
    context = canvas.getContext('2d');
    switch (curCords[i].id) {
      case 'Image':
        // TODO: change when the image upload will be modified
        replayImage(curCords[i].img);
        break;
      case 'Filling':
        replayFilling(curCords[i]);
        break;
      default:
        replayDrawing(curCords[i]);
    }
  }
  isReplaying = false;
  canvas = layers[curCanvasId].canvas;
  context = canvas.getContext('2d');
  curToolSize = activeToolSize;
  curColor = activeColor;
  curAllowableColorDifference = activeAllowableColorDifference;
  if (activeInstrument !== null) activeInstrument.init();
}

function insertPhotoAndReplay() {
  layers.forEach((layer, i) => {
    let canvasPhoto = new Image();
    let ctx = layer.canvas.getContext('2d');
    canvasPhoto.onload = () => {
      ctx.drawImage(canvasPhoto, 0, 0, layer.canvas.width, layer.canvas.height);
      if (i + 1 == layers.length) replayActions(activeLayer.id);
    };
    canvasPhoto.src = photoOfState[i][0];
  });
}

function replayImage(img) {
  context.drawImage(img,
    0, 0, img.width, img.height,
    0, 0, canvas.width, canvas.height);
}

function replayFilling(tool) {
  let cords = tool.cords;
  let e = {
    offsetX: cords[0],
    offsetY: cords[1]
  };
  curColor = tool.color;
  curAllowableColorDifference = tool.allowableColorDifference;
  fill(e);
}

function replayDrawing(tool) {
  let cords = tool.cords;
  let e = {
    offsetX: cords[0][0],
    offsetY: cords[0][1]
  };
  curToolSize = tool.toolSize;
  curColor = tool.color;
  window['startPoint' + tool.id](e);
  let drawLine = window['draw' + tool.id];
  for (let j = 1; j < cords.length; j++) {
    e.offsetX = cords[j][0];
    e.offsetY = cords[j][1];
    drawLine(e);
  }
  isDrawing = false;
  context.beginPath();
  window['delete' + tool.id]();
}
