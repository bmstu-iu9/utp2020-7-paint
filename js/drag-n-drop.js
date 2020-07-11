'use strict';

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  canvas.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  canvas.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  canvas.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  canvas.classList.add('highlight');
}

function unhighlight(e) {
  canvas.classList.remove('highlight');
}

canvas.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let file = e.dataTransfer.files[0];
  handleImg(file);
}
