const loadfunction = window.onload;
window.onload = (event) => {
  // enter here the action you want to do once loaded

  if (loadfunction) loadfunction(event);

  createIcon(
    "SummaryDeleteButton",
    "https://img.icons8.com/fluency/48/null/filled-trash.png",
    "/images/delete.gif",
  );
  createIcon(
    "SummaryCopyButton",
    "https://img.icons8.com/fluency/48/null/copy.png",
    "/images/copy.gif",
  );

  createIcon(
    "SummaryPasteButton",
    "https://img.icons8.com/fluency/48/null/paste.png",
    "/images/paste_disabled.gif",
    true,
  );

  createIcon(
    "SummaryPasteButton",
    "https://img.icons8.com/fluency/48/null/paste.png",
    "/images/paste.gif",
    false,
  );

  createIcon(
    "SummaryUndoButton",
    "https://img.icons8.com/fluency/48/null/undo.png",
    "/images/undo_disabled.gif",
    true,
  );

  createIcon(
    "SummarySaveButton",
    "https://img.icons8.com/fluency/48/null/save.png",
    "/images/saveicon_disabled.gif",
    true,
  );
};

function createIcon(elementId, iconUrl, imageToReplace, disabled = false) {
  const element = document.getElementById(elementId);
  if (element.src.endsWith(imageToReplace)) {
    element.src = iconUrl;
    element.width = 32;
    element.height = 32;

    if (disabled) {
      element.style.filter = "grayscale(100%)";
      element.style.webkitFilter = "grayscale(100%)";
    }
  } else {
    console.log(`Element does not have URL. Found ${element.src}, expected ${imageToReplace}`);
  }
}
