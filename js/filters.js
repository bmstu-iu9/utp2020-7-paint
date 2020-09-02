let modal = document.querySelector('.modal');
let trigger = document.querySelector('.trigger');
let undoFilter = document.getElementById('undoFilter');
let redoFilter = document.getElementById('redoFilter');
let deletingChanges = document.getElementById('deletingChanges');

trigger.addEventListener('click', toggleFilterModal);
closeWithoutSaving.addEventListener('click', toggleFilterModal);
closeWithSaving.addEventListener('click', toggleFilterModal);

let filtersModal = document.getElementById('filters-modal');
filtersModal.addEventListener('click', useFiltersModal);

function toggleFilterModal() {
  modal.classList.toggle('show-modal');
}

function useFiltersModal() {
  let modalCanvas = document.getElementById('modalCanvas');
  let filterCanvas = document.createElement('canvas');
  let modalContext = modalCanvas.getContext('2d');

  changeWindowSize (modalCanvas, maxModalCanvasHeight, maxModalCanvasWidth);
  modalCanvas.setAttribute('width', parseInt(modalCanvas.style.width) * maxModalCanvasWidth / 100);
  modalCanvas.setAttribute('height', parseInt(modalCanvas.style.height) * maxModalCanvasHeight / 100);

  let originalCanvas = canvas;

  addEventListener('keydown', escapeExit);

  function escapeExit(event) {
    if (event.code === 'Escape') {
      closeWithoutSaving.click();
    }
  }

  filterCanvas.setAttribute('width', canvas.width);
  filterCanvas.setAttribute('height', canvas.height);
  let filterContext = filterCanvas.getContext('2d');
  filterContext.drawImage(canvas, 0, 0, canvas.width, canvas.height);

  modalContext.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
  modalContext.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);

  canvas = filterCanvas;
  context = filterContext;

  let history = [];
  let curStateFilter = -1;

  rememberFilterState();

  undoFilter.addEventListener('click', applyPrevState);
  redoFilter.addEventListener('click', applyNextState);

  closeWithoutSaving.addEventListener('click', closeModalWithoutSaving);
  closeWithSaving.addEventListener('click', closeModalWithSaving);
  deletingChanges.addEventListener('click', deleteChanges);

  function closeModalWithoutSaving() {
    canvas = originalCanvas;
    context = canvas.getContext('2d');
    removeModalEventListeners();
  }

  function closeModalWithSaving() {
    originalCanvas.getContext('2d').putImageData(context.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
    canvas = originalCanvas;
    context = canvas.getContext('2d');
    removeModalEventListeners();
    rememberState();
    changePreview();
  }

  function removeModalEventListeners() {
    undoFilter.removeEventListener('click', applyPrevState);
    redoFilter.removeEventListener('click', applyNextState);
    closeWithSaving.removeEventListener('click', closeModalWithSaving);
    closeWithoutSaving.removeEventListener('click', closeModalWithoutSaving);
    deletingChanges.removeEventListener('click', deleteChanges);
    removeEventListener('keydown', escapeExit);

    allSimpleFilters.forEach((filter) => {
      let button = document.getElementById(filter);
      button.onclick = null;
    });

    sobelFilterButton.onclick = null;
    horizontalReflectionFilterButton.onclick = null;
    verticalReflectionFilterButton.onclick = null;
    embossFilterButton.onclick = null;
    medianFilterButton.onclick = null;
    blurFilterButton.onclick = null;

    contrastRange.oninput = null;
    contrastRange.onmouseup = null;
    contrastRange.onchange = null;

    brightnessRange.oninput = null;
    brightnessRange.onmouseup = null;
    brightnessRange.onchange = null;

    sharpRange.oninput = null;
    sharpRange.onmouseup = null;
    sharpRange.onchange = null;
  }

  function applyPrevState() {
    if (curStateFilter > 0) {
      --curStateFilter;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(history[curStateFilter], 0, 0, canvas.width, canvas.height);
      modalContext.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
      modalContext.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);
    }
  }

  function applyNextState() {
    if (curStateFilter + 1 < history.length) {
      ++curStateFilter;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(history[curStateFilter], 0, 0, canvas.width, canvas.height);
      modalContext.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
      modalContext.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);
    }
  }

  function endFilter() {
    modalContext.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalContext.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);
  }

  function rememberFilterState() {
    history = history.slice(0, curStateFilter + 1);
    let img = new Image();
    img.src = canvas.toDataURL();
    history.push(img);
    ++curStateFilter;
  }

  function deleteChanges() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(history[0], 0, 0, canvas.width, canvas.height);
    modalContext.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalContext.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);
    history = history.slice(0, 1);
    curStateFilter = 0;
  }

  let allSimpleFilters = ['negative', 'grey-scale', 'sepia', 'black-white', 'binarization', 'colored'];
  allSimpleFilters.forEach((filter) => {
    let button = document.getElementById(filter);
    button.onclick = () => {
      applySimpleFilter(filter);
      rememberFilterState();
    }
  });

  let sobelFilterButton = document.getElementById('sobel');
  sobelFilterButton.onclick = () => { applySobelFilter(); rememberFilterState(); }

  let embossFilterButton = document.getElementById('emboss');
  embossFilterButton.onclick = () => {
    applyConvolutionMatrixFilter([-2, -1, 0, -1, 1, 1, 0, 1, 2], 1);
    rememberFilterState();
  }

  let medianFilterButton = document.getElementById('median');
  medianFilterButton.onclick = () => { applyMedianFilter(1); rememberFilterState(); }

  let blurFilterButton = document.getElementById('blur');
  blurFilterButton.onclick = () => {
    applyConvolutionMatrixFilter(
      [1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256,
      4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256,
      6 / 256, 24 / 256, 36 / 256, 24 / 256, 6 / 256,
      4 / 256, 16 / 256, 24 / 256, 16 / 256, 4 / 256,
      1 / 256, 4 / 256, 6 / 256, 4 / 256, 1 / 256], 1);
    rememberFilterState();
  }

  let horizontalReflectionFilterButton = document.getElementById('horizontal-reflection');
  horizontalReflectionFilterButton.onclick = () => { applyHorizontalReflection(); rememberFilterState(); }

  let verticalReflectionFilterButton = document.getElementById('vertical-reflection');
  verticalReflectionFilterButton.onclick = () => { applyVerticalReflection(); rememberFilterState(); }

  function applySimpleFilter(filterName) {
    let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let changePixel;

    switch(filterName) {
      case 'negative':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];

          curImageData.data[getIndexOfRedInData(x, y)] = 255 - red;
          curImageData.data[getIndexOfGreenInData(x, y)] = 255 - green;
          curImageData.data[getIndexOfBlueInData(x, y)] = 255 - blue;
        };
        break;
      case 'grey-scale':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];
          let grey = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

          curImageData.data[getIndexOfRedInData(x, y)] = grey;
          curImageData.data[getIndexOfGreenInData(x, y)] = grey;
          curImageData.data[getIndexOfBlueInData(x, y)] = grey;
        };
        break;
      case 'sepia':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];

          curImageData.data[getIndexOfRedInData(x, y)] = red * 0.393 + green * 0.769 + blue * 0.189;
          curImageData.data[getIndexOfGreenInData(x, y)] = red * 0.349 + green * 0.686 + blue * 0.168;
          curImageData.data[getIndexOfBlueInData(x, y)] = red * 0.272 + green * 0.534 + blue * 0.131;
        };
        break;
      case 'black-white':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];

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
        };
        break;
      case 'colored':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];

          curImageData.data[getIndexOfRedInData(x, y)] = 1.6914 * red - 0.6094 * green - 0.082 * blue;
          curImageData.data[getIndexOfGreenInData(x, y)] = -0.3086 * red + 1.3906 * green - 0.082 * blue;
          curImageData.data[getIndexOfBlueInData(x, y)] = -0.3086 * red - 0.6094 * green + 1.918 * blue;
        };
        break;
      case 'binarization':
        changePixel = function(x, y) {
          let red = curImageData.data[getIndexOfRedInData(x, y)];
          let green = curImageData.data[getIndexOfGreenInData(x, y)];
          let blue = curImageData.data[getIndexOfBlueInData(x, y)];

          curImageData.data[getIndexOfRedInData(x, y)] = 255 * Math.floor(red / 128);
          curImageData.data[getIndexOfGreenInData(x, y)] = 255 * Math.floor(green / 128);
          curImageData.data[getIndexOfBlueInData(x, y)] = 255 * Math.floor(blue / 128);
        };
        break;
    }


    for (let i = 0; i < canvas.width; i++) {
      for (let j = 0; j < canvas.height; j++) {
        changePixel(i, j);
      }
    }
    context.putImageData(curImageData, 0, 0);
    endFilter();
  }

  let isClickedContrast = true;

  contrast.value = 1;
  let contrastRange = document.getElementById('contrast');

  contrastRange.oninput = () => {
    if (isClickedContrast) saveImg();
    isClickedContrast = false;
    context.drawImage(memCanvas, 0, 0);
    applyContrastFilter(contrast.value);
  }

  contrastRange.onchange = () => {
    isClickedContrast = true;
    contrast.value = 1;
    rememberFilterState();
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
    endFilter();
  }

  let isClickedBrightness = true;
  brightness.value = 0;
  let brightnessRange = document.getElementById('brightness');

  brightnessRange.oninput = () => {
    if (isClickedBrightness) saveImg();
    isClickedBrightness = false;
    context.drawImage(memCanvas, 0, 0);
    applyBrightnessFilter(brightness.value);
  }

  brightnessRange.onchange = () => {
    isClickedBrightness = true;
    brightness.value = 0;
    rememberFilterState();
  }

  brightnessRange.onmouseup = () => {
    isClickedBrightness = true;
  }

  function applyBrightnessFilter(brightnessCoef) {
    let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let adjustment = 10 * brightnessCoef;

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
    endFilter();
  }

  let isClickedSharp = true;
  sharp.value = 0;
  let sharpRange = document.getElementById('sharp');

  sharpRange.oninput = () => {
    if (isClickedSharp) saveImg();
    isClickedSharp = false;
    context.drawImage(memCanvas, 0, 0);
    applyConvolutionMatrixFilter(
      [-1 / 256, -4 / 256, -6 / 256, -4 / 256, -1 / 256,
      -4 / 256, -16 / 256, -24 / 256, -16 / 256, -4 / 256,
      -6 / 256, -24 / 256, 476 / 256, -24 / 256, -6 / 256,
      -4 / 256, -16 / 256, -24 / 256, -16 / 256, -4 / 256,
      -1 / 256, -4 / 256, -6 / 256, -4 / 256, -1 / 256], sharpRange.value);
  }

  sharpRange.onchange = () => {
    isClickedSharp = true;
    sharpRange.value = 0;
    rememberFilterState();
  }

  sharpRange.onmouseup = () => {
    isClickedSharp = true;
  }

  function applySobelFilter() {
    applySimpleFilter('grey-scale');
    let horizontal = getResultOfConvolutionMatrixFilter([-1, -2, -1, 0, 0, 0, 1, 2 , 1], 1);
    let vertical =  getResultOfConvolutionMatrixFilter([-1, 0, 1, -2, 0, 2, -1, 0 , 1], 1);
    let finalImg = context.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < finalImg.data.length; i += 4) {
       let v = Math.abs(vertical.data[i]);
       finalImg.data[i] = v;
       let h = Math.abs(horizontal.data[i]);
       finalImg.data[i + 1] = h;
       finalImg.data[i + 2] = (v + h) / 4;
       finalImg.data[i + 3] = 255;
     }
     context.putImageData(finalImg, 0, 0);
     endFilter();
  }

  function getResultOfConvolutionMatrixFilter(weights, coeff) {
    let width = canvas.width;
    let height = canvas.height;
    let sx, sy, red, green, blue, dstOff, srcOff, wt, cx, cy, scy, scx;
    let katet = Math.round(Math.sqrt(weights.length));
    let half = (katet * 0.5) | 0;
    let dstData = context.createImageData(width, height);
    let dstBuff = dstData.data;
    let srcBuff = context.getImageData(0, 0, width, height).data;
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
    return dstData;
  }

  function applyConvolutionMatrixFilter(weights, coeff) {
    let result = getResultOfConvolutionMatrixFilter(weights, coeff);
    context.putImageData(result, 0, 0);
    endFilter();
  }

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
    endFilter();
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
    endFilter();
  }

  function applyMedianFilter(radius) {
    let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let resultImageData = curImageData;

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

          let median = array[Math.floor(array.length / 2)];
          resultImageData.data[getIndexOfRedInData(i ,j) + k] = median;
        }
      }
    }
    context.putImageData(resultImageData, 0, 0);
    endFilter();
  }
}

let maxModalCanvasHeight = document.getElementById('modalCanvasWrapper').clientHeight;
let maxModalCanvasWidth = document.getElementById('modalCanvasWrapper').clientWidth;
