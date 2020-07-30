'use strict';

let textToInsert, dxOfText, dyOfText;
let textElements = ['textMenu', 'textFormat', 'fontSize', 'fontColor', 'textAngle', 'pastedText', 'font'];

textElements.forEach(x => window[x + '= document.getElementById(\'' + x + '\')']);

function chooseTextFormat() {
  writeText(canvas.width / 2 - dxOfText, (canvas.height - dyOfText) / 2);
}

function initText() {
  saveImg();
  pastedText.hidden = false;
  document.addEventListener('keydown', pressForInsertion);

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      dxOfText = pastedText.offsetWidth;
      dyOfText = pastedText.offsetHeight;
      pastedText.hidden = true;
      textMenu.hidden = false;
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
  textAngle.value = 0;
  fontColor.value = '#000000';
  pastedText.innerHTML = 'Текст Alt + Enter';
}

function writeText(x, y) {
  clearCanvas();
  context.drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
  context.save();

  function write(x, y) {
    context.font = fontSize.value + 'px ' + font.value;
    context.fillStyle = fontColor.value;
    for (let i = 0, del = parseInt(fontSize.value); i < textToInsert.length; i++)
      context.fillText(textToInsert[i], x, y + i * del);
  }

  if (!textAngle.value) {
    write(x, y);
  } else {
    let ox = canvas.width / 2, oy = canvas.height / 2;
    context.translate(ox, oy);
    context.rotate((Math.PI / 180) * textAngle.value);
    write(x - ox, y - oy);
  }
  context.restore();

  changePreview();
}

function stopInsertion() {
  isDrawing = false;
  document.getElementById('text').click();
}

function startPointText(e) {
  isDrawing = true;
  textMenu.hidden = true;
  pastedText.hidden = true;
  if (!isReplaying) rememberText();

  drawTextInsertion(e);

  textFormat.removeEventListener("click", startPointText);
  canvas.addEventListener("mousemove", drawTextInsertion);
  canvas.addEventListener("click", stopInsertion);
}

function drawTextInsertion(e) {
  if (!isDrawing) return;
  if (!isReplaying) curCords[curState - 1].cords = [e.offsetX, e.offsetY];

  writeText(e.offsetX,  e.offsetY);
}
