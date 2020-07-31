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

  let coords = getElementPosition(canvas);
  let shiftX = e.pageX - coords.x;
  let shiftY = e.pageY - coords.y;

  move(e);

  function move(e) {
    let x = e.pageX, y = e.pageY;
    allCanvases.forEach(layer => {
      let layerStyle = layer.style;
      layerStyle.margin = '0';
      layerStyle.left = x - shiftX + 'px';
      layerStyle.top = y - shiftY + 'px';
    })
  }

  function stopMoving() {
    canvas.style.cursor = 'grab';
    document.removeEventListener("mousemove", move);
    canvas.removeEventListener("mouseup", stopMoving);
  }

  document.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", stopMoving);
}
