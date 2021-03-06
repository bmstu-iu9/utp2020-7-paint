'use strict';

const allIds = ['pencil', 'eraser', 'basicBrush', 'neonBrush', 'smoothBrush', 'pixelEraser',
                'sketchBrush', 'patternBrush', 'furBrush', 'rectangleBrush','circleBrush',
                'rectangle', 'circle', 'ellipse', 'eqTriangle', 'rightTriangle', 'straightLine',
                'eyedropper', 'filling', 'hand', 'text', 'stamp', 'rectangleSelection'];

let allInstruments = new Map();
let activeInstrument = null;

function firstToUpper(str) {
  return str[0].toUpperCase() + str.slice(1);
}

class Instrument {
  constructor(id) {
    this.id = id;
    let upperId = firstToUpper(id);
    this.init = window['init' + upperId];
    this.delete = window['delete' + upperId];
  }
}

function instrumentsHandler(event) {
  let targetId = event.target.id;

  if (activeInstrument !== null) {
    document.getElementById(activeInstrument.id).classList.remove('pressed');
    activeInstrument.delete();
    if (activeInstrument.id === targetId) {
      activeInstrument = null;
      return;
    }
  }

  activeInstrument = allInstruments.get(targetId);
  document.getElementById(targetId).classList.add('pressed');
  if (!activeLayer.locked) {
    activeInstrument.init();
  }
}

allIds.forEach((id) => {
  allInstruments.set(id, new Instrument(id));
  let button = document.getElementById(id);
  button.addEventListener('click', instrumentsHandler);
});
