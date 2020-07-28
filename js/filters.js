let negativeFilterButton = document.getElementById("negative");
negativeFilterButton.onclick = () => { applyFilter("negative"); }

let greyScaleFilterButton = document.getElementById("grey-scale");
greyScaleFilterButton.onclick = () => { applyFilter("grey-scale"); }

let sepiaFilterButton = document.getElementById("sepia");
sepiaFilterButton.onclick = () => { applyFilter("sepia"); }

let blackWhiteFilterButton = document.getElementById("black-white");
blackWhiteFilterButton.onclick = () => { applyFilter("black-white"); }

let contrastFilterButton = document.getElementById("contrast");
contrastFilterButton.onclick = applyContrastFilter;

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
      let grey = 0.2126 * curImageData.data[getIndexOfRedInData(x, y)] + 0.7152 * curImageData.data[getIndexOfGreenInData(x, y)] + 0.0722 * curImageData.data[getIndexOfBlueInData(x, y)];
      curImageData.data[getIndexOfRedInData(x, y)] = grey;
      curImageData.data[getIndexOfGreenInData(x, y)] = grey;
      curImageData.data[getIndexOfBlueInData(x, y)] = grey;
    } else if (filterName === "sepia") {
      curImageData.data[getIndexOfRedInData(x, y)] = red * 0.393 + green * 0.769 + blue * 0.189;
      curImageData.data[getIndexOfGreenInData(x, y)] = red * 0.349 + green * 0.686 + blue * 0.168;
      curImageData.data[getIndexOfBlueInData(x, y)] = red * 0.272 + green * 0.534 + blue * 0.131;
    } else if (filterName === "black-white") {
      let threshold = 255 / 1 / 2 * 3;
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
  }  
}





