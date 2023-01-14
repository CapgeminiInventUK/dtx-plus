document.addEventListener("callSaveFuncs", () => {
  if (typeof saveFromIcon === "function") saveFromIcon();
  else if (typeof myPage.Save === "function") myPage.Save(); // Call DTX save button click function
});
