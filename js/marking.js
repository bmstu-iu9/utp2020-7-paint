'use strict';

let shift;
let interval = 100;
let inclination_angle = 45;

let markingCanvas = document.getElementById('marking_canvas');
let markingContext = markingCanvas.getContext('2d');

markingCanvas.width = canvas.width;
markingCanvas.height = canvas.height;

function initCage() {
  startPointCage();
}

function initVertical() {
  startPointVertical();
}

function initHorizontal() {
  startPointHorizontal();
}

function deleteCage() {
  //cage.addEventListener("mousedown", deleteMarking);
}

function deleteVertical() {
  //vertical.addEventListener("mousedown", deleteMarking);
}

function deleteHorizontal() {
  //horizontal.addEventListener("mousedown", deleteMarking);
}

function startPointCage(e) {
  markingContext.lineCap = "round";
  markingContext.lineJoin = "round";
  markingContext.lineWidth = curToolSize;
  markingContext.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    markingContext.moveTo(0, x);
    markingContext.lineTo(canvas.width, x);
  }
  for (let x = 0.5; x < canvas.width; x += interval) {
    markingContext.moveTo(x, 0);
    markingContext.lineTo(x, canvas.height);
  }
  markingContext.stroke();
  cage.removeEventListener("mousedown", deleteMarking);
}

function startPointVertical(e) {
  markingContext.lineCap = "round";
  markingContext.lineJoin = "round";
  markingContext.lineWidth = curToolSize;
  markingContext.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.width; x += interval) {
    markingContext.moveTo(x, 0);
    markingContext.lineTo(x, canvas.height);
  }
  markingContext.stroke();
  vertical.removeEventListener("mousedown", deleteMarking);
}

function startPointHorizontal(e) {
  markingContext.lineCap = "round";
  markingContext.lineJoin = "round";
  markingContext.lineWidth = curToolSize;
  markingContext.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    markingContext.moveTo(0, x);
    markingContext.lineTo(canvas.width, x);
  }
  markingContext.stroke();
  horizontal.addEventListener("mousedown", deleteMarking);
}

function deleteMarking() {
  markingContext.clearRect(0, 0, canvas.width, canvas.height);
}
