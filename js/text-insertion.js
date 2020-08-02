'use strict';

let textToInsert, dxOfText, dyOfText;
let textElements = ['textMenu', 'textFormat', 'fontSize', 'fontColor', 'textAngle', 'pastedText', 'font'];

textElements.forEach(x => window[x + '= document.getElementById(\'' + x + '\')']);

function chooseTextFormat() {
  writeText(canvas.width / 2, canvas.height / 2);
}

function initText() {
  saveImg();
  pastedText.hidden = false;
  document.addEventListener('keydown', pressForInsertion);

  function pressForInsertion() {
    if (event.code == 'Enter' && event.altKey) {
      dxOfText = pastedText.getBoundingClientRect().width;
      dyOfText = pastedText.getBoundingClientRect().height;
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
  document.removeEventListener("mouseup", stopInsertion);

  fontSize.value = '20';
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

  let k = fontSize.value / 20;

  if (textAngle.value == 0) {
    write(x - dxOfText * k / 2, y - dyOfText / 2);
  } else {
    context.translate(x, y);
    context.rotate((Math.PI / 180) * textAngle.value);
    write(-dxOfText * k / 2, -dyOfText / 2);
  }
  context.restore();

  changePreview();
}

function stopInsertion() {
  isDrawing = false;
  rememberState();
  document.getElementById('text').click();
}

function startPointText(e) {
  isDrawing = true;
  textMenu.hidden = true;
  pastedText.hidden = true;

  drawTextInsertion(e);

  textFormat.removeEventListener("click", startPointText);
  canvas.addEventListener("mousemove", drawTextInsertion);
  document.addEventListener("mouseup", stopInsertion);
}

function drawTextInsertion(e) {
  if (!isDrawing) return;

  writeText(e.offsetX,  e.offsetY);
}
