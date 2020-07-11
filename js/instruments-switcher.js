'use strict'

const allIds = ['pencil'];
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
  if (activeInstrument !== null) {
    activeInstrument.delete();
  }

  let targetId = event.target.id;
  activeInstrument = allInstruments.get(targetId);
  activeInstrument.init();
}

allIds.forEach((id) => {
  allInstruments.set(id, new Instrument(id));
  let button = document.getElementById(id);
  button.addEventListener('click', instrumentsHandler);
});
