'use strict';

let colorInput = document.querySelector('#color');

colorInput.addEventListener('input', () => {
  curColor = hexToRgb(colorInput.value);
});

function hexToRgb(hex) {
  let r1 = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  let r2 = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if ((hex.length === 7 || r1) || (hex.length === 4 && r2)) {
    if (hex.length < 7) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return [parseInt(hex.substr(1, 2), 16),
          parseInt(hex.substr(3, 2), 16),
          parseInt(hex.substr(5, 2), 16)];
  }
  throw "Wrong color code";
}
