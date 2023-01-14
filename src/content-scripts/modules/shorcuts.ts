//  Escape to go home
import injectScript from "./inject-script";

export default function injectShortcutKeys() {
  injectScript("js/inline/call-save-function.js");

  document.addEventListener("keydown", (event) => {
    const keySPressed = event.keyCode === 83 || event.keyCode === 115; // Check if code is for 's' or 'S'
    if (event.ctrlKey && keySPressed) {
      event.preventDefault(); // Prevent browser's save dialog showing

      const evt = new Event("callSaveFuncs", { bubbles: true, cancelable: false });
      document.dispatchEvent(evt); // Fire the event
    } else if (event.key === "Escape") {
      event.preventDefault(); // Prevent escape key stopping document reloading
      const homeURL = `${window.location.origin}/DTX.NET/Summary.aspx`;
      if (window.location.href !== homeURL) window.location.href = "Summary.aspx"; // Don't run when already home
    }
  });
}
