// // Injects a content script into the page with access to page functions
export default function injectScript(scriptStr: string) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(scriptStr);
  document.head.appendChild(script);
  script.remove();
}
