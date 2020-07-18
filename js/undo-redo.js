'use strict';

let isReplaying = false;

function rememberFilling(...cords) {
  checkCurCords();
  curCords.push({
    id: 'Filling',
    cords: cords,
    color: curColor
  });
  ++curState;
}

function rememberImage(img) {
  checkCurCords();
  curCords.push({
    id: 'Image',
    img: img
  });
  ++curState;
}

function rememberDrawingTool(id) {
  checkCurCords();
  curCords.push({
    id: id,
    color: curColor.slice(0),
    toolSize: curToolSize,
    cords: []
  });
  ++curState;
}

function checkCurCords() {
  let d = curCords.length - curState;
  if (d >= 1) curCords.splice(curState, d);
}

document.getElementById('undo').addEventListener('click', () => {
  if (curState > 0) {
    --curState;
    clearCanvas();
    replayActions();
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (curState < curCords.length) {
    ++curState;
    clearCanvas();
    replayActions();
  }
});

function replayActions() {
  isReplaying = true;
  if (activeInstrument !== null) activeInstrument.delete();
  for (let i = 0; i < curState; i++) {
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
  if (activeInstrument !== null) activeInstrument.init();
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
  let drawLine = window['drawLine' + tool.id];
  for (let j = 1; j < cords.length; j++) {
    e.offsetX = cords[j][0];
    e.offsetY = cords[j][1];
    drawLine(e);
  }
  isDrawing = false;
  context.beginPath();
  window['delete' + tool.id]();
}
