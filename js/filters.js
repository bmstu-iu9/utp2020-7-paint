let negativeFilterButton = document.getElementById("negative");
negativeFilterButton.onclick = () => { applyFilter("negative"); }

let greyScaleFilterButton = document.getElementById("grey-scale");
greyScaleFilterButton.onclick = () => { applyFilter("grey-scale"); }

let sepiaFilterButton = document.getElementById("sepia");
sepiaFilterButton.onclick = () => { applyFilter("sepia"); }

let blackWhiteFilterButton = document.getElementById("black-white");
blackWhiteFilterButton.onclick = () => { applyFilter("black-white"); }

let coloredFilterButton = document.getElementById("colored");
coloredFilterButton.onclick = () => { applyFilter("colored"); }

function applyFilter(filterName) {
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
    }
    else if (filterName === "colored") {
      curImageData.data[getIndexOfRedInData(x, y)] = 1.6914 * red - 0.6094 * green - 0.082 * blue;
      curImageData.data[getIndexOfGreenInData(x, y)] = -0.3086 * red + 1.3906 * green - 0.082 * blue;
      curImageData.data[getIndexOfBlueInData(x, y)] = -0.3086 * red - 0.6094 * green + 1.918 * blue;
    }
  }
}

let contrastCoef = 0;
let contrast = document.getElementById("contrast");

contrast.value = 0;

let isClicked = true;

contrast.oninput = () => {
  if (isClicked) saveImg();
  isClicked = false;
  contrastCoef = contrast.value;
  context.drawImage(memCanvas, 0, 0);
  applyContrastFilter();
}

contrast.onchange = () => {
  isClicked = true;
}

function applyContrastFilter() {
  let curImageData = context.getImageData(0, 0, canvas.width, canvas.height);

  let average = 0;
  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
      let red = curImageData.data[getIndexOfRedInData(i, j)];
      let green = curImageData.data[getIndexOfGreenInData(i, j)];
      let blue = curImageData.data[getIndexOfBlueInData(i, j)];
      average += (red * 0.299 + green * 0.587 + blue * 0.114) / (canvas.width * canvas.height);
    }
  }

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
