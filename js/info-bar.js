'use strict';

let usedColors = [];
let usedColorsIds = [];
const maxUsedColors = [];

function getCurCoordsOnCanvas(event) {
  let eventLocation = getEventLocation(canvas, event);

  return {
    x :  eventLocation.x - curCanvasBorder,
    y :  eventLocation.y - curCanvasBorder
  };
}

function showCurCoordsOnCanvas() {

  function printCurCoords(event) {
    //display somewhere on info bar after design
    //and remove listener when bar is closed
    let coords = getCurCoordsOnCanvas(event);


  }

  canvas.addEventListener('mousemove', printCurCoords);
}

function showCurColor() {
  //set here color on some window
  //document.getElementById('curColorWindow').style.background = '#' + rgbToHex(curColor);
}
