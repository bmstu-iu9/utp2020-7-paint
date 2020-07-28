'use strict';

let photoResizer = document.getElementById('photoResizer');
let isResizing = false;

function insertImg(img) {
  let photoIn = document.getElementById('photoInsertion');
  let lastPhoto = document.getElementById('photoForInsertion');

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      let posOfPhoto = getElementPosition(photoResizer);
      let posOfCanvas = getElementPosition(canvas);
      let dx = posOfPhoto.x - posOfCanvas.x, dy = posOfPhoto.y - posOfCanvas.y;
      let dWidth = photoResizer.offsetWidth, dHeight = photoResizer.offsetHeight;

      photoResizer.hidden = true;
      rememberImage(img, dx, dy, dWidth, dHeight);
      context.drawImage(img, 0, 0, img.width, img.height, dx, dy, dWidth, dHeight);
      document.removeEventListener('keydown', pressForInsertion);
    }
  }

  function setInitialParameters() {
    photoResizer.hidden = false;
    photoResizer.style.width = 'auto';
    photoResizer.style.height = 'auto';
    photoResizer.style.top = canvas.getBoundingClientRect().top + 'px';
    photoResizer.style.left = canvas.getBoundingClientRect().left + 'px';
    photoResizer.style.zIndex = activeLayer.index;
  }

  if (lastPhoto) photoIn.removeChild(lastPhoto);
  photoIn.insertAdjacentHTML('afterbegin', "<img src='" + img.src + "' id='photoForInsertion'>");
  setInitialParameters();
  document.addEventListener('keydown', pressForInsertion);
  makeResizablePhoto();
}

photoResizer.ondragstart = () => false;

photoResizer.addEventListener('mousedown', (e) => {
  let img = document.getElementById('photoForInsertion');
  let shiftX = e.clientX - img.getBoundingClientRect().left;
  let shiftY = e.clientY - img.getBoundingClientRect().top;

  function moveAt(x, y) {
    photoResizer.style.left = x - shiftX + 'px';
    photoResizer.style.top = y - shiftY + 'px';
  }

  function move(e) {
    if (!isResizing) moveAt(e.clientX, e.clientY);
  }

  function stop() {
    document.removeEventListener('mousemove', move);
    photoResizer.removeEventListener('mouseup', stop);
  }

  moveAt(e.clientX, e.clientY);
  document.addEventListener('mousemove', move);
  photoResizer.addEventListener('mouseup', stop);
});

function makeResizablePhoto() {
  let element = photoResizer;
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
      originalX = element.getBoundingClientRect().left;
      originalY = element.getBoundingClientRect().top;
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
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
    }
  }
}
