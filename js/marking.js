'use strict';

let shift;
let interval = 100;
let inclination_angle = 45;

function initCage() {
  startPointCage();
}

function initVertical() {
  startPointVertical();
}

function initHorizontal() {
  startPointHorizontal();
}

/*
function deleteCage() {
  cage.removeEventListener("mousedown", deleteMarking);
}

function deleteVertical() {
  vertical.removeEventListener("mousedown", deleteMarking);
}

function deleteHorizontal() {
  horizontal.removeEventListener("mousedown", deleteMarking);
}
*/

function startPointCage(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  for (let x = 0.5; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
}

function startPointVertical(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.width; x += interval) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  context.stroke();
}

function startPointHorizontal(e) {
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = curToolSize;
  context.strokeStyle = arrayToRgb(curColor);

  for (let x = 0.5; x < canvas.height; x += interval) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  context.stroke();
}

/*function deleteMarking() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}*/
