'use strict';

let textToInsert, curTextSize, dxOfText, dyOfText;
const textElements = ['textMenu', 'textPanel', 'textEnter', 'textFormat', 'fontSize',
                    'fontColor', 'textAngle', 'pastedText', 'font'];

textElements.forEach(x => window[x + '= document.getElementById(\'' + x + '\')']);

function chooseTextFormat() {
  if (!isThereSelection) {
    writeText(curCanvasWidth / 2, curCanvasHeight / 2);
  } else {
    writeText(leftTopPointSelection[0]
              + (rightBottomPointSelection[0] - leftTopPointSelection[0]) / 2,
              leftTopPointSelection[1]
              + (rightBottomPointSelection[1] - leftTopPointSelection[1]) / 2);
  }
}

function initText() {
  saveImg();
  pastedText.hidden = false;
  textPanel.hidden = false;
  textEnter.style.display = 'inline-block';
}

function insertText() {
  let padding = parseFloat(getComputedStyle(pastedText, null).getPropertyValue('padding-left').replace('px', ''));
  dxOfText = pastedText.clientWidth - padding * 2;
  dyOfText = pastedText.clientHeight - padding * 2;

  textEnter.style.display = 'none';
  textMenu.style.display = 'flex';
  pastedText.hidden = true;

  textFormat.addEventListener('click', startPointText);
  curTextSize = parseFloat(getComputedStyle(pastedText, null).getPropertyValue('font-size').replace('px', ''));
  textToInsert = pastedText.innerHTML.replace(/\<br\>/g, ' ').replace(/<\/div\>|\&nbsp;/g, '').split('<div>');
  chooseTextFormat();
}

function deleteText() {
  canvas.style.cursor = 'default';
  pastedText.hidden = true;

  if (!textPanel.hidden) {
    clearCanvas();
    context.drawImage(memCanvas, 0, 0, curCanvasWidth, curCanvasHeight);
    textPanel.hidden = true;
    textMenu.style.display = 'none';
  }

  document.removeEventListener('mousemove', drawTextInsertion);
  document.removeEventListener('mouseup', stopInsertion);

  fontSize.value = '20';
  font.value = 'serif';
  textAngle.value = 0;
  fontColor.value = '#000000';
  pastedText.innerHTML = 'Текст';
}

function writeText(x, y) {
  clearCanvas();
  context.drawImage(memCanvas, 0, 0, curCanvasWidth, curCanvasHeight);
  if (isThereSelection) rememberCanvasWithoutSelection();
  context.save();

  function write(x, y) {
    context.font = fontSize.value + 'px ' + font.value;
    context.fillStyle = fontColor.value;
    for (let i = 0, del = parseInt(fontSize.value); i < textToInsert.length; i++)
      context.fillText(textToInsert[i], x, y + i * del);
  }

  let k = fontSize.value / curTextSize;

  if (textAngle.value == 0) {
    write(x - dxOfText * k / 2, y - dyOfText * k / 2);
  } else {
    context.translate(x, y);
    context.rotate((Math.PI / 180) * textAngle.value);
    write(-dxOfText * k / 2, -dyOfText * k / 2);
  }
  context.restore();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}

function stopInsertion() {
  isDrawing = false;
  rememberState();
  document.getElementById('text').click();
}

function startPointText(e) {
  isDrawing = true;
  textPanel.hidden = true;
  pastedText.hidden = true;
  textMenu.style.display = 'none';

  drawTextInsertion(e);

  textFormat.removeEventListener('click', startPointText);
  document.addEventListener('mousemove', drawTextInsertion);
  document.addEventListener('mouseup', stopInsertion);
}

function drawTextInsertion(e) {
  canvas.style.cursor = 'crosshair';
  if (!isDrawing) return;

  writeText(...getCoordsOnCanvas(e));
}
