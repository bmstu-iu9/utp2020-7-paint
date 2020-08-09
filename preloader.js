'use strict';

let preloaderDiv = document.createElement('div');
preloaderDiv.innerHTML = `
  <div id='preloader'>
    <div class='preloaderDots'>
      <div class='left'>
        <div class='firstDot'></div>
        <div class='secondDot'></div>
        <div class='thirdDot'></div>
      </div>
      <div class='center'>
        <div class='firstDot'></div>
        <div class='secondDot'></div>
        <div class='thirdDot'></div>
      </div>
      <div class='right'>
        <div class='firstDot'></div>
        <div class='secondDot'></div>
        <div class='thirdDot'></div>
      </div>
    </div>
  </div>
`;

document.body.insertBefore(preloaderDiv, document.body.firstChild);

let preloaderStart = document.getElementsByClassName('preloaderDots');

document.body.classList.add('preloader');

function fadeOutFunction(el) {
  document.getElementById('preloader').outerHTML = '';
  document.body.classList.remove('preloader');
}

window.onload = function () {
  setTimeout(function () {
    fadeOutFunction(preloaderStart);
  }, 0);
}
