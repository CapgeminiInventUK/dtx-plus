runPatternFill = () => {
    var evt = new Event("runPatternFill", {"bubbles":true, "cancelable":false});
    document.dispatchEvent(evt); // Fire the event
}