togglePatternFillMenu = () => {
  const evt = new Event("togglePatternFillMenu", { bubbles: true, cancelable: false });
  document.dispatchEvent(evt); // Fire the event
};
