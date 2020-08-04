'use strict';

const allIds = ['pencil', 'eraser', 'basicBrush', 'neonBrush', 'smoothBrush', 'sketchBrush',
'filling', 'rectangle', 'circle', 'ellipse', 'eqTriangle', 'rightTriangle', 'eyedropper',
'straightLine', 'hand', 'text', 'cage', 'horizontal', 'vertical', 'diagonal', 'doubleDiagonal'];

let allInstruments = new Map();
let activeInstrument = null;

function firstToUpper(str) {
  return str[0].toUpperCase() + str.slice(1);
}

class Instrument {
  constructor(id) {
    this.id = id;
    let upperId = firstToUpper(id);
    console.log(upperId);
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
  activeInstrument.init();
}

allIds.forEach((id) => {
  allInstruments.set(id, new Instrument(id));
  let button = document.getElementById(id);
  button.addEventListener('click', instrumentsHandler);
});
