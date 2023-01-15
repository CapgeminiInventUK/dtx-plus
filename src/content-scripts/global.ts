import printLine from "./modules/print";

printLine("Hello from global.ts");
const newElement = document.createElement("link");
newElement.id = "favicon";
newElement.rel = "icon";
newElement.type = "image/png";
newElement.href = chrome.runtime.getURL("icon-16.png");
document.head.appendChild(newElement);
