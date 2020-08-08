'use strict';

let photoResizer = document.getElementById('photoResizer');
let photoRotator = document.getElementById('photoRotator');
let isResizing = false, isRotating = false;
let photoAngle = 0, sign = 1;

function rotatePhoto() {
  photoResizer.style.webkitTransform = 'rotate('+photoAngle+'rad)';
  photoResizer.style.mozTransform = 'rotate('+photoAngle+'rad)';
  photoResizer.style.msTransform = 'rotate('+photoAngle+'rad)';
  photoResizer.style.oTransform = 'rotate('+photoAngle+'rad)';
  photoResizer.style.transform = 'rotate('+photoAngle+'rad)';
}

function getMiddleCoords(element) {
  return {
    x: element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2,
    y: element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2
  }
}

function insertImg(img) {
  let photoIn = document.getElementById('photoInsertion');
  let lastPhoto = document.getElementById('photoForInsertion');

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      if (isThereSelection) rememberCanvasWithoutSelection();
      let posOfPhoto = getMiddleCoords(photoResizer);
      let posOfCanvas = {
        x: canvas.getBoundingClientRect().left,
        y: canvas.getBoundingClientRect().top
      };
      let dx = posOfPhoto.x - posOfCanvas.x + 2.5, dy = posOfPhoto.y - posOfCanvas.y + 2.5;
      let dWidth = photoResizer.clientWidth - 6, dHeight = photoResizer.clientHeight - 6;

      context.save();
      context.translate(dx, dy);
      context.rotate(photoAngle);
      context.drawImage(img, 0, 0, img.width, img.height, -deltaX, -deltaY, dWidth, dHeight);
      context.restore();

      photoResizer.hidden = true;
      if (photoAngle) {
        photoAngle = 0;
        rotatePhoto();
      }
      document.removeEventListener('keydown', pressForInsertion);

      if (isThereSelection) uniteRememberAndSelectedImages();
      changePreview();
      rememberState();
    }
  }

  function setInitialParameters() {
    photoResizer.hidden = false;
    photoResizer.style.width = 'auto';
    photoResizer.style.height = 'auto';
    photoResizer.style.top = canvas.getBoundingClientRect().top + 'px';
    photoResizer.style.left = canvas.getBoundingClientRect().left + 'px';
    photoResizer.style.zIndex = activeLayer.index;

    deltaX = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('width').replace('px', '')) / 2;
    deltaY = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('height').replace('px', '')) / 2;
    sign = 1;
    photoAngle = 0;
  }

  if (lastPhoto) photoIn.removeChild(lastPhoto);
  photoIn.insertAdjacentHTML('afterbegin', "<img src='" + img.src + "' id='photoForInsertion'>");
  setInitialParameters();
  document.addEventListener('keydown', pressForInsertion);
  makeResizablePhoto(photoResizer);
}

photoResizer.ondragstart = () => false;

photoResizer.addEventListener('mousedown', (e) => {
  let img = document.getElementById('photoForInsertion');
  let curMiddle = getMiddleCoords(img);
  test.innerHTML = deltaX;
  let shiftX = e.clientX - (curMiddle.x - deltaX);
  let shiftY = e.clientY - (curMiddle.y - deltaY);

  function moveAt(x, y) {
    photoResizer.style.left = x - shiftX + 'px';
    photoResizer.style.top = y - shiftY + 'px';
  }

  function move(e) {
    if (!isResizing && !isRotating) moveAt(e.clientX, e.clientY);
  }

  function stop() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
  }

  moveAt(e.clientX, e.clientY);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);
});

photoRotator.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isRotating = true;
  let lastX = e.pageX, lastY = e.pageY;
  let center = getMiddleCoords(photoResizer);

  function rotate(e) {
    let rotatorCenter = getMiddleCoords(photoRotator);
    let x = e.pageX, y = e.pageY;
    let x1 = lastX - center.x, y1 = lastY - center.y;
    let x2 = x - center.x, y2 = y - center.y;
    let dist1 = Math.sqrt(x1**2 + y1**2), dist2 = Math.sqrt(x2**2 + y2**2);

    function getProjectionPoint(a1, a2, b1, b2, x0, y0) {
      let scalarProd = a1 * b1 + a2 * b2;
      let distB = Math.sqrt(b1**2 + b2**2);
      let pr = scalarProd / distB;
      return {
        x: b1 / distB * pr + x0,
        y: b2 / distB * pr + y0
      }
    }

    function getVectorCords(x0, y0, x1, y1) {
      return {
        x: x1 - x0,
        y: y1 - y0
      }
    }

    function equalSign(a, b) {
      return (a >= 0 && b >= 0) || (a <= 0 && b <= 0);
    }

    function coDirectional(n1, n2) {
      return equalSign(n1.x, n2.x) && equalSign(n1.y, n2.y);
    }

    let normal = getVectorCords(center.x, center.y, rotatorCenter.x, rotatorCenter.y);
    let vector = getVectorCords(center.x, center.y, x, y);
    let pr = getProjectionPoint(vector.x, vector.y, normal.x, normal.y, center.x, center.y);
    let n1 = getVectorCords(pr.x, pr.y, x, y);
    let n2 = { x: -normal.y, y: normal.x };
    let coDeirect = coDirectional(n1, n2);

    sign = (coDeirect && sign > 0 || !coDeirect && sign < 0) ? sign : sign * (-1);
    let cos = (x1 * x2 + y1 * y2) / (dist1 * dist2);
    if (Math.abs(cos) > 1) cos = Math.trunc(cos);
    photoAngle += sign * Math.acos(cos);
    lastX = x;
    lastY = y;

    rotatePhoto();
  }

  function stopRotate() {
    isRotating = false;
    document.removeEventListener('mousemove', rotate);
    document.removeEventListener('mouseup', stopRotate);
  }

  document.addEventListener('mousemove', rotate);
  document.addEventListener('mouseup', stopRotate);
});

function makeResizablePhoto(element) {
  let img = document.getElementById('photoForInsertion');
  let resizers = document.querySelectorAll('.resizer');
  let originalWidth, originalHeight, originalX, originalY;
  let originalMouseX, originalMouseY, minSize = 20;
  for (let i = 0; i < resizers.length; i++) {
    let currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      originalX = getMiddleCoords(img).x - deltaX;
      originalY = getMiddleCoords(img).y - deltaY;
      originalMouseX = e.pageX;
      originalMouseY = e.pageY;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
      isResizing = true;
      if (currentResizer.classList.contains('bottom-right')) {
        let width = originalWidth + (e.pageX - originalMouseX);
        let height = originalHeight + (e.pageY - originalMouseY);
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
        }
      } else if (currentResizer.classList.contains('bottom-left')) {
        let height = originalHeight + (e.pageY - originalMouseY);
        let width = originalWidth - (e.pageX - originalMouseX);
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
        }
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = originalX + (e.pageX - originalMouseX) + 'px';
        }
      } else if (currentResizer.classList.contains('top-right')) {
        let width = originalWidth + (e.pageX - originalMouseX);
        let height = originalHeight - (e.pageY - originalMouseY);
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = originalY + (e.pageY - originalMouseY) + 'px';
        }
      } else {
        let width = originalWidth - (e.pageX - originalMouseX);
        let height = originalHeight - (e.pageY - originalMouseY);
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = originalX + (e.pageX - originalMouseX) + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = originalY + (e.pageY - originalMouseY) + 'px';
        }
      }
      deltaX = parseFloat(element.style.width.replace('px', '')) / 2;
      deltaY = parseFloat(element.style.height.replace('px', '')) / 2;
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
    }
  }
}
