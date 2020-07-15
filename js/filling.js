'use strict';

function initFilling() {
  canvas.addEventListener("click", fill);
}

function deleteFilling() {
  canvas.removeEventListener("click", fill);
}

function fill(event) {
  let originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let resultImageData = originalImageData;
  
  let startRGBA = [ 
    originalImageData.data[getRedInData(event.offsetX, event.offsetY)], 
    originalImageData.data[getGreenInData(event.offsetX, event.offsetY)],
    originalImageData.data[getBlueInData(event.offsetX, event.offsetY)],
    originalImageData.data[getAlphaInData(event.offsetX, event.offsetY)]
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
    if (areInCanvas(x, y) && haveSameColor(x, y)) {
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
    return (originalImageData.data[getRedInData(x, y)] === startRGBA[0] &&
     originalImageData.data[getGreenInData(x, y)] === startRGBA[1] &&
     originalImageData.data[getBlueInData(x, y)] === startRGBA[2] &&
     originalImageData.data[getAlphaInData(x, y)] === startRGBA[3]);
  }
  
  function wasPushed(x, y) {
    return pushed[x][y];
  }
  
  function areInCanvas(x, y) {
    return (x <= canvas.width-1 && y <= canvas.height && x >= 0 && y >= 0);
  }
  
  function getRedInData(x, y) { return canvas.width*(y-1)*4+x*4; }  
  function getGreenInData(x, y) { return canvas.width*(y-1)*4+x*4+1; }
  function getBlueInData(x, y) { return canvas.width*(y-1)*4+x*4+2; } 
  function getAlphaInData(x, y) { return canvas.width*(y-1)*4+x*4+3; }
  
  function changePixel(x, y) {
    resultImageData.data[canvas.width*(y-1)*4+x*4] = curColor[0];
    resultImageData.data[canvas.width*(y-1)*4+x*4+1] = curColor[1];
    resultImageData.data[canvas.width*(y-1)*4+x*4+2] = curColor[2];
    resultImageData.data[canvas.width*(y-1)*4+x*4+3] = 255;
  }
}
