let negativeFilterButton = document.getElementById("negative");
negativeFilterButton.onclick = () => { applySimpleFilter("negative"); }

let greyScaleFilterButton = document.getElementById("grey-scale");
greyScaleFilterButton.onclick = () => { applySimpleFilter("grey-scale"); }

let sepiaFilterButton = document.getElementById("sepia");
sepiaFilterButton.onclick = () => { applySimpleFilter("sepia"); }

let blackWhiteFilterButton = document.getElementById("black-white");
blackWhiteFilterButton.onclick = () => { applySimpleFilter("black-white"); }

let binarizationFilterButton = document.getElementById("binarization");
binarizationFilterButton.onclick = () => { applySimpleFilter("binarization"); }

let coloredFilterButton = document.getElementById("colored");
coloredFilterButton.onclick = () => { applySimpleFilter("colored"); }

let sobelFilterButton = document.getElementById("sobel");
sobelFilterButton.onclick = applySobelFilter;

let embossFilterButton = document.getElementById("emboss");
embossFilterButton.onclick = () => {
  applyConvolutionMatrixFilter([-2, -1, 0, -1, 1, 1, 0, 1, 2], 1);
  changePreview();
}

let blurFilterButton = document.getElementById("blur");
blurFilterButton.onclick = () => {
  applyConvolutionMatrixFilter(
    [1/256, 4/256, 6/256, 4/256, 1/256,
    4/256, 16/256, 24/256, 16/256, 4/256,
    6/256, 24/256, 36/256, 24/256, 6/256,
    4/256, 16/256, 24/256, 16/256, 4/256,
    1/256, 4/256, 6/256, 4/256, 1/256], 1);
  changePreview();
}

function applySimpleFilter(filterName) {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      changePixel(i, j);
    }
  }
  context.putImageData(curImageData, 0, 0);
  changePreview();

  function changePixel(x, y) {
    let red = curImageData.data[getIndexOfRedInData(x, y)];
    let green = curImageData.data[getIndexOfGreenInData(x, y)];
    let blue = curImageData.data[getIndexOfBlueInData(x, y)];

    if (filterName === "negative") {
      curImageData.data[getIndexOfRedInData(x, y)] = 255 - red;
      curImageData.data[getIndexOfGreenInData(x, y)] = 255 - green;
      curImageData.data[getIndexOfBlueInData(x, y)] = 255 - blue;
    } else if (filterName === "grey-scale") {
      let grey = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      curImageData.data[getIndexOfRedInData(x, y)] = grey;
      curImageData.data[getIndexOfGreenInData(x, y)] = grey;
      curImageData.data[getIndexOfBlueInData(x, y)] = grey;
    } else if (filterName === "sepia") {
      curImageData.data[getIndexOfRedInData(x, y)] = red * 0.393 + green * 0.769 + blue * 0.189;
      curImageData.data[getIndexOfGreenInData(x, y)] = red * 0.349 + green * 0.686 + blue * 0.168;
      curImageData.data[getIndexOfBlueInData(x, y)] = red * 0.272 + green * 0.534 + blue * 0.131;
    } else if (filterName === "black-white") {
      let threshold = 255 / 2 * 3;
      if (red + green + blue > threshold) {
        curImageData.data[getIndexOfRedInData(x, y)] = 255;
        curImageData.data[getIndexOfGreenInData(x, y)] = 255;
        curImageData.data[getIndexOfBlueInData(x, y)] = 255;
      } else {
        curImageData.data[getIndexOfRedInData(x, y)] = 0;
        curImageData.data[getIndexOfGreenInData(x, y)] = 0;
        curImageData.data[getIndexOfBlueInData(x, y)] = 0;
      }
    } else if (filterName === "colored") {
      curImageData.data[getIndexOfRedInData(x, y)] = 1.6914 * red - 0.6094 * green - 0.082 * blue;
      curImageData.data[getIndexOfGreenInData(x, y)] = -0.3086 * red + 1.3906 * green - 0.082 * blue;
      curImageData.data[getIndexOfBlueInData(x, y)] = -0.3086 * red - 0.6094 * green + 1.918 * blue;
    } else if (filterName === "binarization") {
      curImageData.data[getIndexOfRedInData(x, y)] = 255 * Math.floor(red/128);
      curImageData.data[getIndexOfGreenInData(x, y)] = 255 * Math.floor(green/128);
      curImageData.data[getIndexOfBlueInData(x, y)] = 255 * Math.floor(blue/128);
    }
  }
}

let isClickedContrast = true;

contrast.value = 1;
let contrastRange = document.getElementById("contrast");

contrastRange.oninput = () => {
  if (isClickedContrast) saveImg();
  isClickedContrast = false;
  context.drawImage(memCanvas, 0, 0);
  applyContrastFilter(contrast.value);
}

contrastRange.onchange = () => {
  isClickedContrast = true;
  contrast.value = 1;
  changePreview();
}

contrastRange.onmouseup = () => {
  isClickedContrast = true;
}

function applyContrastFilter(contrastCoef) {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);

  let average = 0;
  let countOfPixels = canvas.width * canvas.height;
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      let red = curImageData.data[getIndexOfRedInData(i, j)];
      let green = curImageData.data[getIndexOfGreenInData(i, j)];
      let blue = curImageData.data[getIndexOfBlueInData(i, j)];
      let alpha =  curImageData.data[getIndexOfAlphaInData(i, j)];
      red = ((1 - alpha/255) * 255) + (alpha/255 * red);
      green = ((1 - alpha/255) * 255) + (alpha/255 * green);
      blue = ((1 - alpha/255) * 255) + (alpha/255 * blue);
      if (alpha == 0) {
        countOfPixels--;
      } else {
        average += (red * 0.299 + green * 0.587 + blue * 0.114);
      }
    }
  }

  average /= countOfPixels;
  let changedPalette = [];
  for (let i = 0; i <= 255; i++) {
    changedPalette[i] = average + contrastCoef * (i - average);
    if (changedPalette[i] < 0) changedPalette[i] = 0;
    else if (changedPalette[i] > 255) changedPalette[i] = 255;
  }

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      let red = curImageData.data[getIndexOfRedInData(i, j)];
      let green = curImageData.data[getIndexOfGreenInData(i, j)];
      let blue = curImageData.data[getIndexOfBlueInData(i, j)];

      curImageData.data[getIndexOfRedInData(i, j)] = changedPalette[red];
      curImageData.data[getIndexOfGreenInData(i, j)] = changedPalette[green];
      curImageData.data[getIndexOfBlueInData(i, j)] = changedPalette[blue];
    }
  }

  context.putImageData(curImageData, 0, 0);
  changePreview();
}

let isClickedBrightness = true;
brightness.value = 0;
let brightnessRange = document.getElementById("brightness");

brightnessRange.oninput = () => {
  if (isClickedBrightness) saveImg();
  isClickedBrightness = false;
  context.drawImage(memCanvas, 0, 0);
  applyBrightnessFilter(brightness.value);
}

brightnessRange.onchange = () => {
  isClickedBrightness = true;
  brightness.value = 0;
  changePreview();
}

brightnessRange.onmouseup = () => {
  isClickedBrightness = true;
}

function applyBrightnessFilter(brightnessCoef) {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let adjustment = 10*brightnessCoef;

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      let red = curImageData.data[getIndexOfRedInData(i, j)];
      let green = curImageData.data[getIndexOfGreenInData(i, j)];
      let blue = curImageData.data[getIndexOfBlueInData(i, j)];
      curImageData.data[getIndexOfRedInData(i, j)] = red + adjustment;
      curImageData.data[getIndexOfGreenInData(i, j)] = green + adjustment;
      curImageData.data[getIndexOfBlueInData(i, j)] = blue + adjustment;
    }
  }

  context.putImageData(curImageData, 0, 0);
  changePreview();
}

let isClickedSharp = true;
sharp.value = 0;
let sharpRange = document.getElementById("sharp");

sharpRange.oninput = () => {
  if (isClickedSharp) saveImg();
  isClickedSharp = false;
  context.drawImage(memCanvas, 0, 0);
  applyConvolutionMatrixFilter(
    [-1/256, -4/256, -6/256, -4/256, -1/256,
    -4/256, -16/256, -24/256, -16/256, -4/256,
    -6/256, -24/256, 476/256, -24/256, -6/256,
    -4/256, -16/256, -24/256, -16/256, -4/256,
    -1/256, -4/256, -6/256, -4/256, -1/256], sharpRange.value);
  changePreview();
}

sharpRange.onchange = () => {
  isClickedSharp = true;
  sharpRange.value = 0;
  changePreview();
}

sharpRange.onmouseup = () => {
  isClickedSharp = true;
}

function applySobelFilter() {
  applySimpleFilter("grey-scale");
  let srcBuff = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let horizontal = convolute([-1, -2, -1, 0, 0, 0, 1, 2 , 1], srcBuff);
  let vertical = convolute([-1, 0, 1, -2, 0, 2, -1, 0 , 1], srcBuff);
  let finalImg = context.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < finalImg.data.length; i += 4) {
     let v = Math.abs(vertical.data[i]);
     resImage.data[i] = v;
     let h = Math.abs(horizontal.data[i]);
     finalImg.data[i+1] = h;
     finalImg.data[i+2] = (v + h)/4;
     finalImg.data[i+3] = 255;
   }
   context.putImageData(finalImg, 0, 0);
}

function convolute(weights, srcBuff) {
  let width = canvas.width;
  let height = canvas.height;
  let x, sx, sy, red, green, blue, dstOff, srcOff, wt, cx, cy, scy, scx,
  katet = Math.round(Math.sqrt(weights.length)),
  half = (katet * 0.5) | 0,
  dstData = context.createImageData(width, height),
  dstBuff = dstData.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sy = y;
      sx = x;
      dstOff = (y * width + x) * 4;
      red = 0;
      green = 0;
      blue = 0;
      for (cy = 0; cy < katet; cy++) {
        for (cx = 0; cx < katet; cx++) {
          scy = sy + cy - half;
          scx = sx + cx - half;
          if (scy > 0 && scy < height && scx > 0 && scx < width) {
            srcOff = (scy * width + scx) * 4;
            wt = weights[cy * katet + cx];
            red += srcBuff[srcOff] * wt;
            green += srcBuff[srcOff + 1] * wt;
            blue += srcBuff[srcOff + 2] * wt;
          }
        }
      }
      dstBuff[dstOff] = red;
      dstBuff[dstOff + 1] = green;
      dstBuff[dstOff + 2] = blue;
      dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
    }
  }
  return dstData;
}

function applyConvolutionMatrixFilter(weights, coeff) {
  let width = canvas.width;
  let height = canvas.height;
  let x, sx, sy, red, green, blue, dstOff, srcOff, wt, cx, cy, scy, scx,
  katet = Math.round(Math.sqrt(weights.length)),
  half = (katet * 0.5) | 0,
  dstData = context.createImageData(width, height),
  dstBuff = dstData.data,
  srcBuff = context.getImageData(0, 0, width, height).data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sy = y;
      sx = x;
      dstOff = (y * width + x) * 4;
      red = 0;
      green = 0;
      blue = 0;
      for (cy = 0; cy < katet; cy++) {
        for (cx = 0; cx < katet; cx++) {
          scy = sy + cy - half;
          scx = sx + cx - half;
          if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
            srcOff = (scy * width + scx) * 4;
            wt = weights[cy * katet + cx];
            red += srcBuff[srcOff] * wt;
            green += srcBuff[srcOff + 1] * wt;
            blue += srcBuff[srcOff + 2] * wt;
          }
        }
      }
      dstBuff[dstOff] = red * coeff + srcBuff[dstOff] * (1 - coeff);
      dstBuff[dstOff + 1] = green * coeff + srcBuff[dstOff + 1] * (1 - coeff);
      dstBuff[dstOff + 2] = blue * coeff + srcBuff[dstOff + 2] * (1 - coeff);
      dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
    }
  }
  context.putImageData(dstData, 0, 0);
}

let horizontalReflectionFilterButton = document.getElementById("horizontal-reflection");
horizontalReflectionFilterButton.onclick = () => { applyHorizontalReflection(); }

let verticalReflectionFilterButton = document.getElementById("vertical-reflection");
verticalReflectionFilterButton.onclick = () => { applyVerticalReflection(); }

function applyHorizontalReflection() {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let resultImageData = new ImageData(canvas.width, canvas.height);

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      resultImageData.data[getIndexOfRedInData(i, j)] = curImageData.data[getIndexOfRedInData(i, canvas.height - 1 - j)];
      resultImageData.data[getIndexOfGreenInData(i, j)] = curImageData.data[getIndexOfGreenInData(i, canvas.height - 1 - j)];
      resultImageData.data[getIndexOfBlueInData(i, j)] = curImageData.data[getIndexOfBlueInData(i, canvas.height - 1 - j)];
      resultImageData.data[getIndexOfAlphaInData(i, j)] = curImageData.data[getIndexOfAlphaInData(i, canvas.height - 1 - j)];
    }
  }

  context.putImageData(resultImageData, 0, 0);
  changePreview();
}

function applyVerticalReflection() {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let resultImageData = new ImageData(canvas.width, canvas.height);

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      resultImageData.data[getIndexOfRedInData(i, j)] = curImageData.data[getIndexOfRedInData(canvas.width - 1 - i, j)];
      resultImageData.data[getIndexOfGreenInData(i, j)] = curImageData.data[getIndexOfGreenInData(canvas.width - 1 - i, j)];
      resultImageData.data[getIndexOfBlueInData(i, j)] = curImageData.data[getIndexOfBlueInData(canvas.width - 1 - i, j)];
      resultImageData.data[getIndexOfAlphaInData(i, j)] = curImageData.data[getIndexOfAlphaInData(canvas.width - 1 - i, j)];
    }
  }

  context.putImageData(resultImageData, 0, 0);
  changePreview();
}

let medianFilterButton = document.getElementById("median");
medianFilterButton.onclick = () => { applyMedianFilter(1); }

function applyMedianFilter(radius) {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let resultImageData = curImageData;
  let storonaKvadrata = 2 * radius + 1;

  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < canvas.width; i++) {
      for (let j = 0; j < canvas.height; j++) {

        let array = [];
        for (let l = i - radius; l <= i + radius; l++) {
          for (let m = j - radius; m <= j + radius; m++) {
            if (areInCanvas(l, m)) array.push(curImageData.data[getIndexOfRedInData(l, m) + k]);
          }
        }

        array.sort((a, b) => a - b);

        let mediam = array[Math.floor(array.length/2)];
        resultImageData.data[getIndexOfRedInData(i ,j) + k] = mediam;
      }
    }
  }
  context.putImageData(resultImageData, 0, 0);
}
