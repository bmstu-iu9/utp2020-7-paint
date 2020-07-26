'use strict';

function initFilling() {
  canvas.style.cursor = "url('img/cursors/filling-cursor.png') 0 25, auto";
  canvas.addEventListener("click", fill);
}

function deleteFilling() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener("click", fill);
}

function fill(event) {
  let originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let resultImageData = originalImageData;

  if (!isReplaying) rememberFilling(event.offsetX, event.offsetY);

  let startRGBA = [
    originalImageData.data[getIndexOfRedInData(event.offsetX, event.offsetY)],
    originalImageData.data[getIndexOfGreenInData(event.offsetX, event.offsetY)],
    originalImageData.data[getIndexOfBlueInData(event.offsetX, event.offsetY)],
    originalImageData.data[getIndexOfAlphaInData(event.offsetX, event.offsetY)]
  ];

  let stack = [];

  let pushed = [];
  for (let i = 0; i <= canvas.width; i++) {
    pushed[i] = [];
    for (let j = 0; j <= canvas.height; j++) {
      pushed[i][j] = false;
    }
  }

  stack.push([event.offsetX, event.offsetY]);
  pushed[event.offsetX][event.offsetY] = true;

  while (stack.length !== 0) {
    let curPoint = stack.pop();
    let x = curPoint[0];
    let y = curPoint[1];
    if (haveSameColor(x, y)) {
      changePixel(x, y);
      let arrayOfNeedChecking = [[x, y+1], [x-1, y],  [x+1, y], [x, y-1]];
      arrayOfNeedChecking.forEach((elem) => {
        if (areInCanvas(elem[0], elem[1]) && !wasPushed(elem[0], elem[1])) {
          stack.push(elem);
          pushed[elem[0]][elem[1]] = true;
        }
      });
    }
  }

  context.putImageData(resultImageData, 0, 0);
  function haveSameColor(x, y) {
    let thisRGBA = [
      originalImageData.data[getIndexOfRedInData(x, y)],
      originalImageData.data[getIndexOfGreenInData(x, y)],
      originalImageData.data[getIndexOfBlueInData(x, y)],
      originalImageData.data[getIndexOfAlphaInData(x, y)],
    ]
    return ((getColorDifference(RGBAtoRGB(thisRGBA), RGBAtoRGB(startRGBA))/maxAllowableColorDifference)*100 <= curAllowableColorDifference);
  }

  function wasPushed(x, y) {
    return pushed[x][y];
  }

  function areInCanvas(x, y) {
    return (x <= canvas.width-1 && y <= canvas.height && x >= 0 && y >= 0);
  }

  function getIndexOfRedInData(x, y) { return canvas.width*(y-1)*4+x*4; }
  function getIndexOfGreenInData(x, y) { return canvas.width*(y-1)*4+x*4+1; }
  function getIndexOfBlueInData(x, y) { return canvas.width*(y-1)*4+x*4+2; }
  function getIndexOfAlphaInData(x, y) { return canvas.width*(y-1)*4+x*4+3; }

  function changePixel(x, y) {
    resultImageData.data[getIndexOfRedInData(x, y)] = curColor[0];
    resultImageData.data[getIndexOfGreenInData(x, y)] = curColor[1];
    resultImageData.data[getIndexOfBlueInData(x, y)] = curColor[2];
    resultImageData.data[getIndexOfAlphaInData(x, y)] = 255;
  }
}
