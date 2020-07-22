'use strict';

function initHand() {
  canvas.addEventListener("dragstart", function() {
    return false;
  });
  canvas.addEventListener("mousedown", startMoving);
  canvas.style.cursor = 'grab';
}

function deleteHand() {
  canvas.removeEventListener("mousedown", startMoving);
  canvas.style.cursor = 'default';
}

function startMoving(e) {
  canvas.style.cursor = 'grabbing';
  canvas.style.position = 'absolute';

  let coords = getCoords(canvas);
  let shiftX = e.pageX - coords.left;
  let shiftY = e.pageY - coords.top;

  move(e);

  function move(e) {
    canvas.style.left = e.pageX - shiftX + 'px';
    canvas.style.top = e.pageY - shiftY + 'px';
  }

  function stopMoving() {
    canvas.style.cursor = 'grab';
    document.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", stopMoving);
  }

  document.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", stopMoving);
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  }
}
