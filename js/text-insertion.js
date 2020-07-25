'use strict';

let textToInsert, dxOfText, dyOfText;

let textMenu = document.getElementById('textMenu');
let pastedText = document.getElementById('textIndicator');
let textFormat = document.getElementById('chooseTextFormat');
let fontSize = document.getElementById('textSize');
let fontColor = document.getElementById('textColor');
let font = document.getElementById('fontSelector');
let textDeg = document.getElementById('textAngle');

function chooseTextFormat() {
  writeText(canvas.width / 2 - dxOfText, canvas.height / 2 - dyOfText);
}

function initText() {
  saveImg();
  pastedText.hidden = false;
  pastedText.style.zIndex = activeLayer.index + 1;
  document.addEventListener('keydown', pressForInsertion);

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      dxOfText = pastedText.clientWidth;
      dyOfText = pastedText.clientHeight;
      pastedText.hidden = true;
      textMenu.hidden = false;
      textMenu.style.zIndex = activeLayer.index + 1;
      textFormat.addEventListener("click", startPointText);
      textToInsert = pastedText.innerHTML.replace(/\<br\>/g, ' ').replace(/<\/div\>|\&nbsp;/g, '').split('<div>');
      chooseTextFormat();
      document.removeEventListener('keydown', pressForInsertion);
    }
  }
}

function deleteText() {
  pastedText.hidden = true;

  if (!textMenu.hidden) {
    clearCanvas();
    context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
    textMenu.hidden = true;
  }

  canvas.removeEventListener("mousemove", drawTextInsertion);
  canvas.removeEventListener("click", stopInsertion);

  fontSize.value = '48';
  font.value = 'serif';
  textDeg.value = 0;
  context.fillStyle = fontColor.value = '#000000';
  pastedText.innerHTML = 'Текст Alt + Enter';
}

function writeText(x, y) {
  clearCanvas();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);

  function write(x, y) {
    context.font = fontSize.value + 'px ' + font.value;
    context.fillStyle = fontColor.value;
    for (let i = 0, del = parseInt(fontSize.value); i < textToInsert.length; i++)
      context.fillText(textToInsert[i], x, y + i * del);
  }

  if (!textDeg.value) {
    write(x, y);
  } else {
    let ox = canvas.width / 2, oy = canvas.height / 2;
    context.save();
    context.translate(ox, oy);
    context.rotate((Math.PI / 180) * textDeg.value);
    write(x - ox, y - oy);
    context.translate(-ox, -oy);
    context.restore();
  }
}

function stopInsertion() {
  isDrawing = false;
  textFormat.removeEventListener("click", startPointText);
  document.getElementById('text').click();
}

function startPointText(e) {
  isDrawing = true;
  textMenu.hidden = true;
  pastedText.hidden = true;
  if (!isReplaying) rememberText('Text');

  drawTextInsertion(e);

  canvas.addEventListener("mousemove", drawTextInsertion);
  canvas.addEventListener("click", stopInsertion);
}

function drawTextInsertion(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords = [e.offsetX, e.offsetY];

  writeText(e.offsetX,  e.offsetY);
}
