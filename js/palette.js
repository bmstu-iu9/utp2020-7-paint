'use strict';

let colorInput = document.getElementById('colorPalette');
let colorBtn = document.getElementById('colorBtn');

colorInput.addEventListener('input', () => {
  let color = colorInput.value;
  curColor = hexToRgb(color);
  colorBtn.style.background = color;
});

colorBtn.addEventListener('click', () => {
  colorInput.click();
});

function hexToRgb(hex) {
  let r1 = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  let r2 = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (r1 || r2) {
    if (hex.length < 7) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return [parseInt(hex.substr(1, 2), 16),
            parseInt(hex.substr(3, 2), 16),
            parseInt(hex.substr(5, 2), 16)];
  }
  throw 'Wrong color code';
}
