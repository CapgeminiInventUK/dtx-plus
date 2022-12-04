// Adds shortcut button to instantly add standard UK time hours
export default function injectStandardUKTimeButton() {
  // Create icon
  const ukTimeButton = document.createElement("img");
  ukTimeButton.src = chrome.runtime.getURL("images/uk-time.png");
  ukTimeButton.width = 32;
  ukTimeButton.height = 32;
  ukTimeButton.className = "summaryButtons menuButton";
  ukTimeButton.id = "ukTimeButton";

  // Create link around icon
  const ukTimeButtonLink = document.createElement("a");
  ukTimeButtonLink.style.width = "32px";
  ukTimeButtonLink.style.height = "32px";
  ukTimeButtonLink.title = "Standard Time in UK";
  ukTimeButtonLink.className = "actionIcon";
  ukTimeButtonLink.id = "SummaryStandardTimeInUK";
  ukTimeButtonLink.href = "item.aspx?op=create&categoryId=51&itemStatus=2&categoryGroup=Time";
  ukTimeButtonLink.appendChild(ukTimeButton);

  // Create menubar list item
  const ukTimeButtonContainer = document.createElement("li");
  ukTimeButtonContainer.appendChild(ukTimeButtonLink);

  // Add list item to menu bars (supporting both bars by making a clone of the element)
  document
    .getElementById("jsddm_summary")
    ?.insertAdjacentElement("afterbegin", ukTimeButtonContainer);

  document
    .getElementById("jsddm_item")
    ?.insertAdjacentElement("afterbegin", ukTimeButtonContainer.cloneNode(true) as Element);
}
