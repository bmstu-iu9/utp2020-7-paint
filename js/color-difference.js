'use strict';

function getColorDifference(rgb1, rgb2) {
  const rMean = (rgb1[0] + rgb2[0]) / 2;
  const r = rgb1[0] - rgb2[0];
  const g = rgb1[1] - rgb2[1];
  const b = rgb1[2] - rgb2[2];
  return Math.sqrt((((512 + rMean) * r * r) >> 8)
                   + 4 * g * g
                   + (((767 - rMean) * b * b) >> 8));
}

function RGBAtoRGB(rgba) {
  const r = ((1 - rgba[3] / 255) * 255) + (rgba[3] / 255 * rgba[0]);
  const g = ((1 - rgba[3] / 255) * 255) + (rgba[3] / 255 * rgba[1]);
  const b = ((1 - rgba[3] / 255) * 255) + (rgba[3] / 255 * rgba[2]);
  return [r, g, b];
}

const maxAllowableColorDifference = getColorDifference([255, 255, 255], [0, 0, 0]);

let colorDifferenceRange = document.getElementById('colorDifferenceRange');
let colorDifferenceText = document.getElementById('colorDifferenceText');

colorDifferenceRange.value = curAllowableColorDifference;
colorDifferenceText.value = `${curAllowableColorDifference}%`;

let defaultAllowableColorDifference = curAllowableColorDifference;

colorDifferenceRange.oninput = () => {
  colorDifferenceText.value = colorDifferenceRange.value + '%';
  colorDifferenceText.style.background = 'white';
}

colorDifferenceRange.onchange = () => { curAllowableColorDifference = colorDifferenceRange.value; }

colorDifferenceText.oninput = () => {
  if (checkColorDifferenceInput(colorDifferenceText.value)) {
    colorDifferenceText.style.background = 'white';
    colorDifferenceRange.value = parseInt(colorDifferenceText.value);
    curAllowableColorDifference = parseInt(colorDifferenceText.value);
  } else {
    colorDifferenceText.style.background = '#ffd4d4';
    curAllowableColorDifference = getColorDifference(colorDifferenceText, colorDifferenceRange);
  }

  function getColorDifference(colorDifferenceText, colorDifferenceRange) {
    if (parseInt(colorDifferenceText.value) > colorDifferenceRange.max) { return colorDifferenceRange.max; }
    if (parseInt(colorDifferenceText.value) < colorDifferenceRange.min) { return colorDifferenceRange.min; }
    return defaultAllowableColorDifference;
  }
}

colorDifferenceText.onchange = () => {
  if (checkColorDifferenceInput(colorDifferenceText.value)) {
    colorDifferenceText.value = parseInt(colorDifferenceText.value) + '%';
    colorDifferenceRange.value = parseInt(colorDifferenceText.value);
  } else {
    colorDifferenceRange.value = curAllowableColorDifference;
    colorDifferenceText.value = curAllowableColorDifference + '%';
    colorDifferenceText.style.background = 'white';
  }
}

function checkColorDifferenceInput(str) {
  const regExp = new RegExp(`^\\d+(%|)$`, 'i');
  return (regExp.test(str)) &&
         (parseInt(str) <= colorDifferenceRange.max) &&
         (parseInt(str) >= colorDifferenceRange.min);
}
