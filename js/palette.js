'use strict';

let colorInput = document.querySelector('#color');

colorInput.addEventListener('input', () => {
  curColor = hexToRgb(colorInput.value);
});

function hexToRgb(hex) {
  if ((hex.length === 4 || hex.length === 7) && hex[0] === '#') {
    if (hex.length < 7) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    let rgb = [parseInt(hex.substr(1, 2), 16),
          parseInt(hex.substr(3, 2), 16),
          parseInt(hex.substr(5, 2), 16)];
    if (rgb[0] < 256 && rgb[1] < 256 && rgb[2] < 256)
      return rgb;
  }
  throw "Wrong color code";
}
