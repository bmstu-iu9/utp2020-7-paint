'use strict';

let firstClickHand = true;

function initHand() {
  if (firstClickHand) {
    toggleModal();
    hintsContent.innerHTML = 'При двойном нажатии на холст в режиме \'руки\' он центрируется';
    firstClickHand = false;
  }
  canvas.addEventListener('dragstart', function() {
    return false;
  });
  canvas.addEventListener('mousedown', startMoving);
  canvas.style.cursor = 'grab';
}

function deleteHand() {
  canvas.removeEventListener('mousedown', startMoving);
  canvas.removeEventListener('dblclick', centerCanvas);
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
    document.removeEventListener('mousemove', move);
    canvas.removeEventListener('mouseup', stopMoving);
  }

  document.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', stopMoving);
  canvas.addEventListener('dblclick', centerCanvas);
}

function centerCanvas () {
  allCanvases.forEach(layer => {
    let layerStyle = layer.style;
    layerStyle.position = 'absolute';
    layerStyle.margin = 'auto';
    layerStyle.left = 0;
    layerStyle.top = 45 + 'px';
    layerStyle.right = 0;
    layerStyle.bottom =0;
  });
}
