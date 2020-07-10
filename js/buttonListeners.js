function changePrevButton() {
  prevButton = curButton;
}

function removeListeners() {
  switch (prevButton) {
    case "BasicBrush": {
      deleteBrush();
      break;
    }
    case "Pencil": {
      deletePencil();
      break;
    }
  }
}