//TODO Remove this and use the shared one in TS
function injectScript(scriptStr) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(scriptStr);
  document.head.appendChild(script);
  script.remove();
}

injectScript("/pattern-fill/inline/is-descendant.js");
injectScript("/pattern-fill/inline/run-pattern-fill.js");
injectScript("/pattern-fill/inline/toggle-pattern-fill-menu.js");

// Toggles the visibility of the pattern fill menu
function togglePatternFillMenu() {
  document.querySelector(".patternfill-container").classList.toggle("open");
}

// Pattern-selects all checkboxes in a calendar view
function runPatternFill() {
  const startDay = parseInt(document.getElementById("patternFillStartDay").value) || 1;
  const daysOn = parseInt(document.getElementById("patternFillDaysOn").value) || 4;
  const daysOff = parseInt(document.getElementById("patternFillDaysOff").value) || 4;
  const selectHours = parseFloat(document.getElementById("patternFillSelectHours").value) || 7.5;
  const includeBankHolidays = document.getElementById("patternFillIncludeBankHolidays").checked;

  // Save settings to Chrome storage
  chrome.storage.sync.set({
    patternFill_startDay: startDay,
    patternFill_daysOn: daysOn,
    patternFill_daysOff: daysOff,
    patternFill_includeBankHolidays: includeBankHolidays,
    selectHours: selectHours,
  });

  let inputs = [...document.querySelectorAll("#calDates_tabCalendar > tbody input")];
  inputs.forEach((input) => {
    // Gets the day the input is in control of by finding its corresponding font element's content
    const inputDate = parseInt(input.parentNode.querySelector("font").innerText);

    // Checks if the input represents a bank holiday
    const inputIsBankHoliday = input.classList.contains("bankHolidayDay");

    let shouldSelect;
    if ((!includeBankHolidays && inputIsBankHoliday) || inputDate < startDay) {
      shouldSelect = false;
    } else {
      // A block is the total days in a set of days on and days off
      const daysInBlock = daysOn + daysOff;

      // Find out where the date lies in terms of blocks
      // e.g. start date 1st, 4 days on, 3 off:
      // Jan 4th = 0.57 (or 57%) of the way through blocks in the month
      // Jan 15th = 2.14 (or 214%) of the way through blocks in the month
      const dayAsFractionOfAllBlocks = (inputDate - (startDay - 1)) / daysInBlock;

      // Strip the int, we're only interested in the fraction of the way
      // through the current block.
      // e.g. start date 1st, 4 days on, 3 off:
      // Jan 15th becomes 0.14 (or 14%) of the way through a block
      let dayAsFractionOfBlock = dayAsFractionOfAllBlocks % 1;

      // If it was a whole number, removing the decimal would make it 0
      // Turn zeros back to 1 (100% of block)
      if (dayAsFractionOfBlock === 0) dayAsFractionOfBlock = 1;

      // Find (fraction expressed as decimal) what proportion of a block is days on
      let daysOnFraction = daysOn / daysInBlock;

      // Round numbers due to floating point errors
      // While yes, this could cause inaccuracies if months were longer,
      // months aren't and using big integers would be a waste
      dayAsFractionOfBlock = parseFloat(dayAsFractionOfBlock).toPrecision(12);
      daysOnFraction = parseFloat(daysOnFraction).toPrecision(12);

      // Calculate if the fraction of the current block is less than or equal to the
      // proportion that makes up daysOn
      // Also check it's not 0 (the first day of daysOff)
      shouldSelect = dayAsFractionOfBlock <= daysOnFraction;
    }

    // Auto-complete inputs
    if (input.type === "checkbox") {
      input.checked = shouldSelect;
      input.classList.remove("semiChecked");
    } else {
      input.value = shouldSelect ? selectHours : "";
    }
  });
}

// Register event handlers fired by buttons injected into the page
document.addEventListener("togglePatternFillMenu", togglePatternFillMenu);
document.addEventListener("runPatternFill", runPatternFill);

// Add handler to hide pattern fill UI when the user clicks outside of the menu
document.addEventListener("mousedown", (e) => {
  const patternFillMenu = document.querySelector(".patternfill-container.open");
  if (!patternFillMenu) return; // Cancel if the menu is already closed/isn't found

  // Check the user didn't click inside the menu
  if (!isDescendant(patternFillMenu, e.target)) togglePatternFillMenu();
});

console.log("Pattern fill injected!");
