'use strict'

const allIds = ['pencil', 'basicBrush', 'eraser'];
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
    document.getElementById(activeInstrument.id).classList.remove('isPressed');
    activeInstrument.delete();
    if (activeInstrument.id === targetId) {
      activeInstrument = null;
      return;
    }
  }

  activeInstrument = allInstruments.get(targetId);
  document.getElementById(targetId).classList.add('isPressed');
  activeInstrument.init();
}

allIds.forEach((id) => {
  allInstruments.set(id, new Instrument(id));
  let button = document.getElementById(id);
  button.addEventListener('click', instrumentsHandler);
});
