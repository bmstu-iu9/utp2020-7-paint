'use strict';

let isReplaying = false;

class Tool {
  constructor(id, name, cords, img) {
    this.id = id;
    this.name = name;
    this.layer = activeLayer.id;
    this.replay = window['replay' + name];
    this.color = curColor.slice(0);
    this.toolSize = curToolSize;
    this.cords = cords;
    this.allowableColorDifference = curAllowableColorDifference;
    this.img = img;
    this.fontColor = fontColor.value;
    this.fontSize = fontSize.value;
    this.font = font.value;
    this.textAngle = textAngle.value;
    this.text = textToInsert;
  }
}

function rememberFilling(...cords) {
  checkCurCords();
  curCords.push(new Tool('Filling', 'Filling', cords));
  ++curState;
}

function rememberImage(img, ...cords) {
  checkCurCords();
  curCords.push(new Tool('Image', 'Image', cords, img));
  ++curState;
}

function rememberDrawingTool(id, ...cords) {
  checkCurCords();
  curCords.push(new Tool(id, 'DrawingTool', cords));
  ++curState;
}

function rememberText() {
  checkCurCords();
  curCords.push(new Tool('Text', 'Text'));
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
    curCords[i].replay();
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

function replayImage() {
  let img = this.img, cords = this.cords;
  context.drawImage(img, 0, 0, img.width, img.height, ...cords);
}

function replayFilling() {
  let cords = this.cords;
  let e = {
    offsetX: cords[0],
    offsetY: cords[1]
  };
  curColor = this.color;
  curAllowableColorDifference = this.allowableColorDifference;
  fill(e);
}

function replayDrawingTool() {
  let cords = this.cords;
  let e = {
    offsetX: cords[0][0],
    offsetY: cords[0][1]
  };
  curToolSize = this.toolSize;
  curColor = this.color;
  window['startPoint' + this.id](e);
  let draw = window['draw' + this.id];
  for (let j = 1; j < cords.length; j++) {
    e.offsetX = cords[j][0];
    e.offsetY = cords[j][1];
    draw(e);
  }
  isDrawing = false;
  context.beginPath();
  window['delete' + this.id]();
}

function replayText() {
  let cords = this.cords;
  let e = {
    offsetX: cords[0],
    offsetY: cords[1]
  };
  fontSize.value = this.fontSize;
  fontColor.value = this.fontColor;
  textAngle.value = this.textAngle;
  font.value = this.font;
  textToInsert = this.text;
  saveImg();
  window['startPoint' + this.id](e);
  isDrawing = false;
  window['delete' + this.id]();
}
