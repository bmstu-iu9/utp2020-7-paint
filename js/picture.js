'use strict';

let photoResizer = document.getElementById('photoResizer');
let deleteImageBtn = document.getElementById('deleteImage');
let isResizing = false;
let curImg;
let deltaImgX, deltaImgY;

function getMiddleCoords(element) {
  return {
    x: element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2,
    y: element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2
  }
}

function pressForImgInsertion() {
  if (event.code == 'Enter' && event.altKey) {
    let posOfPhoto = getMiddleCoords(photoResizer);
    let posOfCanvas = {
      x: canvas.getBoundingClientRect().left,
      y: canvas.getBoundingClientRect().top
    };
    let dx = posOfPhoto.x - posOfCanvas.x + 2.5, dy = posOfPhoto.y - posOfCanvas.y + 2.5;
    let dWidth = photoResizer.clientWidth - 6, dHeight = photoResizer.clientHeight - 6;

    context.save();
    context.translate(dx, dy);
    context.drawImage(curImg, 0, 0, curImg.width, curImg.height, -deltaImgX, -deltaImgY, dWidth, dHeight);
    context.restore();

    deleteImg();
    changePreview();
    rememberState();
  }
}

function deleteImg() {
  photoResizer.hidden = true;
  document.removeEventListener('keydown', pressForImgInsertion);
  deleteImageBtn.removeEventListener('click', deleteImage);
}

function insertImg(img) {
  let photoIn = document.getElementById('photoInsertion');
  let lastPhoto = document.getElementById('photoForInsertion');
  curImg = img;

  function setInitialParameters() {
    photoResizer.hidden = false;
    photoResizer.style.width = 'auto';
    photoResizer.style.height = 'auto';
    photoResizer.style.top = canvas.getBoundingClientRect().top + 'px';
    photoResizer.style.left = canvas.getBoundingClientRect().left + 'px';
    photoResizer.style.zIndex = activeLayer.index;

    deltaImgX = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('width').replace('px', '')) / 2;
    deltaImgY = parseFloat(getComputedStyle(photoResizer, null).getPropertyValue('height').replace('px', '')) / 2;
  }

  if (lastPhoto) photoIn.removeChild(lastPhoto);
  photoIn.insertAdjacentHTML('afterbegin', '<img src=\"' + img.src + '\" id=\"photoForInsertion\">');
  setInitialParameters();
  document.addEventListener('keydown', pressForImgInsertion);
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
    if (!isResizing) moveAt(e.clientX, e.clientY);
  }

  function stop() {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
  }

  moveAt(e.clientX, e.clientY);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stop);
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
      originalX = getMiddleCoords(img).x - deltaImgX;
      originalY = getMiddleCoords(img).y - deltaImgY;
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
      deltaImgX = parseFloat(element.style.width.replace('px', '')) / 2;
      deltaImgY = parseFloat(element.style.height.replace('px', '')) / 2;
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
    }
  }
}
