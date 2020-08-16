'use strict';

let photoResizer = document.getElementById('photoResizer');
let photoRotator = document.getElementById('photoRotator');
let deleteImageBtn = document.getElementById('deleteImage');
let isResizing = false, isRotating = false;
let curImg, originalImgWidth, originalImgHeight;
let deltaImgX, deltaImgY;
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

deleteImageBtn.addEventListener('click', e => hideAndShow('uploadImgMenu', e));

function pressForImgInsertion() {
  if (event.code == 'Enter') {
    let posOfPhoto = getMiddleCoords(photoResizer);
    let posOfCanvas = {
      x: canvas.getBoundingClientRect().left + curCanvasBorder,
      y: canvas.getBoundingClientRect().top + curCanvasBorder
    };
    let dx = posOfPhoto.x - posOfCanvas.x + 2.5, dy = posOfPhoto.y - posOfCanvas.y + 2.5;
    let dWidth = photoResizer.clientWidth - 6, dHeight = photoResizer.clientHeight - 6;

    context.save();
    context.translate(dx, dy);
    context.rotate(photoAngle);
    context.drawImage(curImg, 0, 0, curImg.width, curImg.height, -deltaImgX, -deltaImgY, dWidth, dHeight);
    context.restore();

    deleteImageBtn.click();
    deleteImg();
    changePreview();
    rememberState();
  }
}

function getOriginalSizeOfImg() {
  let img = document.getElementById('photoForInsertion');

  photoResizer.style.width = img.style.width = originalImgWidth + 'px';
  photoResizer.style.height = img.style.height = originalImgHeight + 'px';

  deltaImgX = originalImgWidth / 2;
  deltaImgY = originalImgHeight / 2;
}

function deleteImg() {
  photoResizer.hidden = true;
  let curPhoto = document.getElementById('photoForInsertion');
  if (curPhoto) curPhoto.remove();

  document.removeEventListener('keydown', pressForImgInsertion);
  photoResizer.removeEventListener('dblclick', getOriginalSizeOfImg);
}

function insertImg(img) {
  let photoIn = document.getElementById('photoInsertion');
  curImg = img;

  function setInitialParameters() {
    let docWidth = document.documentElement.clientWidth;
    let photoWidth = img.width;
    if (docWidth - photoWidth < 10) {
      photoWidth = docWidth - 10;
      let photo = document.getElementById('photoForInsertion');
      photo.style.width = photoWidth + 'px';
    }

    sign = 1;
    if (photoAngle) {
      photoAngle = 0;
      rotatePhoto();
    }

    photoResizer.hidden = false;
    photoResizer.style.width = photoWidth + 'px';
    photoResizer.style.height = 'auto';
    photoResizer.style.top = '50px';
    photoResizer.style.left = (docWidth - photoWidth) / 2 + 'px';
    photoResizer.style.zIndex = activeLayer.index;

    originalImgWidth = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('width').replace('px', ''));
    originalImgHeight = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('height').replace('px', ''));
    deltaImgX = originalImgWidth / 2;
    deltaImgY = originalImgHeight / 2;
  }

  photoIn.insertAdjacentHTML('afterbegin', '<img src=\"' + img.src + '\" id=\"photoForInsertion\">');
  setInitialParameters();
  document.addEventListener('keydown', pressForImgInsertion);
  photoResizer.addEventListener('dblclick', getOriginalSizeOfImg);
  makeResizablePhoto(photoResizer);
}

photoResizer.ondragstart = () => false;

photoResizer.addEventListener('mousedown', (e) => {
  let img = document.getElementById('photoForInsertion');
  let curMiddle = getMiddleCoords(img);
  let shiftX = e.clientX - (curMiddle.x - deltaImgX);
  let shiftY = e.clientY - (curMiddle.y - deltaImgY);

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

    function getVectorCords(x0, y0, x1, y1) {
      return {
        x: x1 - x0,
        y: y1 - y0
      }
    }

    function getProjectionPoint(a1, a2, b1, b2, x0, y0) {
      let scalarProd = a1 * b1 + a2 * b2;
      let distB = Math.sqrt(b1**2 + b2**2);
      let pr = scalarProd / distB;
      return {
        x: b1 / distB * pr + x0,
        y: b2 / distB * pr + y0
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
  let center;
  const minSize = 20;
  for (let i = 0; i < resizers.length; i++) {
    let currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      originalX = getMiddleCoords(img).x - deltaImgX;
      originalY = getMiddleCoords(img).y - deltaImgY;
      center = getTranslations(originalX + originalWidth/2, originalY + originalHeight/2);
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    });

    class Matrix {
      constructor() {
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
          this.matrix = arguments[0];
          this.length = arguments[0][0].length;
        } else {
          this.matrix = [[], [], []];
          this.length = arguments.length / 3;
          for (let j = 0, k = 0; j < this.length; j++) {
            for (let i = 0; i < 3; i++) {
              this.matrix[i][j] = arguments[k++];
            }
          }
        }
      }

      multiply (obj) {
        let res = [[], [], []];
        for (let i = 0; i < 3; i++) {
          for (let k = 0; k < obj.length; k++) {
            res[i][k] = 0;
            for (let j = 0; j < 3; j++) {
              res[i][k] += this.matrix[i][j] * obj.matrix[j][k];
            }
          }
        }
        return new Matrix(res);
      }
    }

    function getRotation(angle) {
      let sin = Math.sin(angle), cos = Math.cos(angle);
      return new Matrix(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
    }

    function getTranslations(x, y) {
      return {
        plus: new Matrix(1, 0, 0, 0, 1, 0, x, y, 1),
        minus: new Matrix(1, 0, 0, 0, 1, 0, -x, -y, 1)
      }
    }

    function getNotRotatedCoords(angle, center, obj) {
      return center.plus.multiply(getRotation(angle).multiply(center.minus)).multiply(obj);
    }

    function getNewParams(p, e) {
      let dp = getNotRotatedCoords(photoAngle, center, p);
      let dc = new Matrix ((dp.matrix[0][0] + e.pageX) / 2, (dp.matrix[1][0] + e.pageY) / 2, 1);
      let newCenter = getTranslations(dc.matrix[0][0], dc.matrix[1][0]);
      let newP = getNotRotatedCoords(-photoAngle, newCenter, dp);
      let newQ = getNotRotatedCoords(-photoAngle, newCenter, new Matrix(e.pageX, e.pageY, 1));
      return [newP.matrix, newQ.matrix];
    }

    function resize(e) {
      isResizing = true;

      if (currentResizer.classList.contains('bottom-right')) {
        let [newP0, newQ] = getNewParams(new Matrix(originalX, originalY, 1), e);
        let width = newQ[0][0] - newP0[0][0];
        let height = newQ[1][0] - newP0[1][0];
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = newP0[0][0] + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = newP0[1][0] + 'px';
        }
      } else if (currentResizer.classList.contains('bottom-left')) {
        let [newP1, newQ] = getNewParams(new Matrix(originalX + originalWidth, originalY, 1), e);
        let width = newP1[0][0] - newQ[0][0];
        let height = newQ[1][0] - newP1[1][0];
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = newP1[0][0] - width + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = newP1[1][0] + 'px';
        }
      } else if (currentResizer.classList.contains('top-right')) {
        let [newP2, newQ] = getNewParams(new Matrix(originalX, originalY + originalHeight, 1), e);
        let width = newQ[0][0] - newP2[0][0];
        let height = newP2[1][0] - newQ[1][0];
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = newP2[0][0] + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = newP2[1][0] - height + 'px';
        }
      } else {
        let [newP3, newQ] = getNewParams(new Matrix(originalX + originalWidth, originalY + originalHeight, 1), e);
        let width = newP3[0][0] - newQ[0][0];
        let height = newP3[1][0] - newQ[1][0];
        if (width > minSize) {
          img.style.width = element.style.width = width + 'px';
          img.style.left = element.style.left = newP3[0][0] - width + 'px';
        }
        if (height > minSize) {
          img.style.height = element.style.height = height + 'px';
          img.style.top = element.style.top = newP3[1][0] - height + 'px';
        }
      }
      deltaImgX = parseFloat(element.style.width.replace('px', '')) / 2;
      deltaImgY = parseFloat(element.style.height.replace('px', '')) / 2;
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
    }
  }
}
