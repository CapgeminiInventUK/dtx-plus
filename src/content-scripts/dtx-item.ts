/*
    dtx-item.js
     This file handles extra features added to the adding time feature/page.
     For example: Standard time in UK
*/

import LoadExtensionSettings from "./modules/settings";

// Global variables
let checkboxChanged = false; // Flag to block context menu showing
// Event handler to update flags that represent which mouse buttons are pressed
let lmbDown = false;
let rmbDown = false;
let selectingCheckboxes = false; // Flag to disable text selection during checkbox selection


// // Injects a content script into the page with access to page functions
function injectScript(scriptStr: string) {	
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptStr);
	document.head.appendChild(script);
	script.remove();
}

// Builds a DTX-themed separator line to split up button groups
function buildMenuBarSeparator() {
	const separatorImg = document.createElement("img");
	separatorImg.src = "./images/separator.gif";
	separatorImg.border = "0";
	const separatorCell = document.createElement("td");
	separatorCell.vAlign = "middle";
	separatorCell.align = "center";
	separatorCell.appendChild(separatorImg);
	return separatorCell;
}

// Adds container to hold custom buttons in menubar for calender pages
// e.g. Select mode, auto fill etc
function injectCustomButtonsContainer() {
	// Get menu bar
	const buttonRow = document
		.querySelector<HTMLTableRowElement>(
			"#SubMenuUC1_SubMenu_div1 > table > tbody > tr"
		);
		// Add separator
		buttonRow?.appendChild(buildMenuBarSeparator());
		
		// Add custom section
		const customButtonsContainer = document.createElement("div");
		customButtonsContainer.id = "customButtonsContainer";
		buttonRow?.appendChild(customButtonsContainer);
	
}



// Sets a checkbox's checked state based off the input it's representing
function updateCheckedDisplay(
	input: HTMLInputElement,
	checkbox: HTMLInputElement,
	selectHours: number) {
	const inputHours = parseFloat(input.value) || 0;
	checkbox.checked = inputHours === selectHours;

	// Highlight checkboxes that have work hours but not a full day
	if (inputHours !== selectHours && inputHours !== 0) {
		checkbox.classList.add("semiChecked");
	} else {
		checkbox.classList.remove("semiChecked");
	}
}

// Adds toggle-able checkbox selection of work days to auto-fill with 7.5 (default) hours
function loadSelectMode(defaultMode: boolean, selectHours: number) {
	
	injectScript(`js/inline/call-calculate-totals.js`);

	// Add toggle select mode button to menubar
	const selectModeCheckboxName = "toggleMode";
	const selectModeCheckbox = document.createElement("input");
    selectModeCheckbox.type = "checkbox";
	selectModeCheckbox.id = selectModeCheckboxName;
    selectModeCheckbox.checked = defaultMode;
	
	const inputs = [...document
		.querySelectorAll<HTMLInputElement>("#calDates_tabCalendar > tbody input")];
	const checkboxes = inputs.map(input => {
		
		// Disable inputs being dragged
		if (input.parentElement !== null) {
			input.parentElement.ondragstart = function ondragstart() { return false };
		}
		const checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.classList.add("polyfillerCheckbox");
		checkbox.style.display = "none";
		
		// Darken weekend checkboxes
		if (input.style.backgroundColor === "rgb(225, 225, 225)") {
			input.classList.add("weekend");
			checkbox.classList.add("weekend");
		}
		
		// Highlight bank holiday checkboxes
		if (input.classList.contains("bankHolidayDay")) {
			checkbox.classList.add("bankHolidayDay");
		}
		
		// Add checkbox to calender
		input.insertAdjacentElement('afterend', checkbox);
		
		// Handler for when checkbox is changed
		function checkboxChangedHandler(checkboxInput: HTMLInputElement) {
			input.value = checkboxInput.checked ? selectHours.toString() : "";
			updateCheckedDisplay(input, checkboxInput, selectHours);
			
			// Call site function to update "Quantity" (total hrs) field
			const evt = new Event("callCalculateTotalsFunc", {"bubbles":true, "cancelable":false});
			document.dispatchEvent(evt); // Fire the event
		}
		
		// Register click handler for checkbox container (parent & children)
		//  This makes it easier to select checkboxes, as you can click
		//  the surrounding area or date label to toggle the checkbox
		checkbox.parentNode?.addEventListener("click", (event) => {
			// Check that select mode is enabled
			if (selectModeCheckbox.checked) {
				// Change checked state (if user didn't click checkbox)
				if (event.target !== checkbox) checkbox.checked = !checkbox.checked; 
				checkboxChangedHandler(checkbox); // Fire handler
			}
		});
		
		// Register right-click handler to make single-tap right clicks uncheck
		// checkboxes
		checkbox.parentNode?.addEventListener('contextmenu', (event) => {
			event.preventDefault(); // Block right-click menu showing
			
			// Check that select mode is enabled
			if (selectModeCheckbox.checked) {
				checkbox.checked = false; // Uncheck checkbox
				checkboxChangedHandler(checkbox); // Fire handler
			}
			
			return false; // Block default right-click behaviour
		}, false);
		
		
		// Credit to https://stackoverflow.com/questions/36754940/check-multiple-checkboxes-with-click-drag
		// Credit to http://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down
		function check(checkboxInput: HTMLInputElement) {
			if (!selectModeCheckbox.checked) return; // Don't run when checkboxes are disabled
			
			if (lmbDown) {
				// checkbox.checked = !box.checked; // toggle check state
				checkboxInput.checked = true;
			} else if (rmbDown) {
				checkboxInput.checked = false;
				checkboxChanged = true;
			}
			
			// Stop if neither button is pressed
			if (!lmbDown && !rmbDown) return;
			
			// Run checkbox changed handler to effect input underneath
			checkboxChangedHandler(checkboxInput);
			
			// Update checkboxes being selected flag
			selectingCheckboxes = true;
		}
		
		// Add hover handler to all checkboxes' parents (for easier selection) on page
		checkbox.parentNode?.addEventListener("mouseover", () => {
			check(checkbox)
		})
		
		return checkbox;
	});
	
	// Changes UI between select mode and manual input
	function changeSelectMode(enabled: boolean) {
		// Show & hide checkboxes or text input fields
		checkboxes.forEach(combo => { combo.style.display = enabled ? "block" : "none"; });
		inputs.forEach(combo => { combo.style.display = enabled ? "none" : "block" });
		
		const tabCalendar = document.getElementById("calDates_tabCalendar");
		if(tabCalendar !== null) {
		if (enabled) {
			tabCalendar.classList.add("selectionTooltip");
			
			inputs.forEach((input) => {
				if (input.nextElementSibling !== null) {
					const checkbox = input.nextElementSibling as HTMLInputElement;
					updateCheckedDisplay(input, checkbox, selectHours);
				}
			});
		} else {
			// Add tip to tell user how to quickly change multiple checkboxes
			tabCalendar.classList.remove("selectionTooltip");
		}}
	}
	
	selectModeCheckbox.addEventListener('change', (event) => {
		changeSelectMode((event.target as HTMLInputElement).checked);
	});
	if (defaultMode) changeSelectMode(true);
	
	const selectModeLabel = document.createElement('label');
    selectModeLabel.htmlFor = selectModeCheckboxName; /* Link clicks to checkbox element */
    selectModeLabel.innerText = "Select mode";
	
	const customButtonsContainer = document.getElementById("customButtonsContainer");
	customButtonsContainer?.appendChild(buildMenuBarSeparator()); // Add separator before checkbox
	customButtonsContainer?.appendChild(selectModeCheckbox);
	customButtonsContainer?.appendChild(selectModeLabel);
}

function setLeftButtonState(e: MouseEvent) {
	lmbDown = e.buttons === undefined 
		? e.which === 1 
		: e.buttons === 1;
	
	rmbDown = e.buttons === undefined 
			? e.which === 3
			: e.buttons === 2;
	
	// If both buttons are released, checkboxes are no longer being selected
	if (!lmbDown && !rmbDown) selectingCheckboxes = false;
}


// Disable text selection while selecting checkboxes
function disableSelect(event: Event) {
	if (selectingCheckboxes) {
		event.preventDefault();
	}
}

// Allows user to click and drag to select/deselect checkboxes using
// left and right mouse buttons
function injectDraggingCheckboxSelection() {
	// Setup mouse click events
	document.body.onmousedown = setLeftButtonState;
	document.body.onmousemove = setLeftButtonState;
	document.body.onmouseup = setLeftButtonState;
	
	window.addEventListener('selectstart', disableSelect);

	// Block right-click menu if deselecting checkboxes
	document.oncontextmenu = (event) => {
		if (checkboxChanged) {
			checkboxChanged = false;
			event.preventDefault();
			return false;
		}
		return undefined;
	}
}




// Injects a button into calender views to select work days in a pattern
// Func is async, it returns 1 when it completes
async function injectPatternFill(
	patternFill_startDay: number,
	patternFill_daysOn: number,
	patternFill_daysOff: number,
	patternFill_includeBankHolidays: boolean,
	selectHours: boolean) {
	const response = await fetch(chrome.runtime.getURL("pattern-fill/pattern-fill.html"));
	const patternFillHTML = await response.text();

	// Add autofill button to menubar
	const customButtonsContainer = document.getElementById("customButtonsContainer");
	customButtonsContainer?.insertAdjacentHTML('beforeend', patternFillHTML);

	// Set default settings from Chrome storage
	(document.getElementById("patternFillStartDay") as HTMLInputElement).value =
		patternFill_startDay.toString();
	(document.getElementById("patternFillDaysOff") as HTMLInputElement).value =
		patternFill_daysOff.toString();
	(document.getElementById("patternFillDaysOn") as HTMLInputElement).value =
		patternFill_daysOn.toString();
	(document.getElementById("patternFillSelectHours") as HTMLInputElement).value =
		selectHours.toString();
	(document.getElementById("patternFillIncludeBankHolidays") as HTMLInputElement).checked =
		patternFill_includeBankHolidays;

	return Promise.resolve(1);
}



// Injects a button into calender views to quick-select multiple days
const fillModes = Object.freeze({"business_days":0, "all":1, "none":2});
function injectAutoFillButton(selectHours: number) {
	
	// Create fill button
	const autoFillButton = document.createElement("button");
	autoFillButton.type = "button"; // Stop submit running on click
	autoFillButton.innerText = "Auto-fill";
	autoFillButton.id = "autoFillButton";
	
	let fillModeIndex = 0;
	autoFillButton.addEventListener('click', () => {
		const inputs = [
			...document.querySelectorAll<HTMLInputElement>("#calDates_tabCalendar > tbody input")
		];

		inputs.forEach((input) => {
			const inputIsWeekend = input.classList.contains("weekend");
			const inputIsBankHoliday = input.classList.contains("bankHolidayDay");
			
			let shouldSelect = true;
			const fillMode = Object.values(fillModes)[fillModeIndex];
			
			switch(fillMode) {
				case fillModes.all:
					break;
				case fillModes.business_days:
					shouldSelect = !inputIsBankHoliday && !inputIsWeekend;
					break;
				default:
					shouldSelect = false;
			}
			
			// Auto-complete inputs
			if (input.type === "checkbox") {
				input.checked = shouldSelect;
				input.classList.remove("semiChecked");
			} else {
				input.value = shouldSelect ? selectHours.toString() : "";
			}
		});
		
		// Change to next fill mode for next click
		fillModeIndex += 1;
		if (fillModeIndex > Object.keys(fillModes).length - 1) fillModeIndex = 0;
	});
	
	// Add autofill button to menubar
	const customButtonsContainer = document.getElementById("customButtonsContainer");	
	customButtonsContainer?.appendChild(autoFillButton);
}



// Attempts to fill task number with user's default if nothing is entered yet
function autoFillTaskNumber(taskNumber: string) {
	const taskInput = document.getElementById("txtTaskNumber") as HTMLInputElement;
	if (!!taskInput && taskInput.value === "") taskInput.value = taskNumber;
}
// Attempts to fill project code with user's default if nothing is entered yet
function autoFillProjectCode(projectCode: string) {
	const projectInput = document.getElementById("drpProjectCode_input") as HTMLInputElement;
	if (!!projectInput && projectInput.value === "") projectInput.value = projectCode;
	
	// Trigger DTX project code change handler
	const leftArrow = 37; // Fire left arrow as it's harmless and won't change the field value
	projectInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: leftArrow } ));
}


// Characters like "&" are blocked from the "Task ID" field, despite being allowed in Win DTX
// Strangely, they're also only blocked onkeydown and can be easily copy-pasted in by anyone
function bypassBlockedNonAlphanumericChars() {
	injectScript(`js/inline/return-text-numeric.js`);
}



async function ItemPageScripts(settings: Record<string, any>) {
    injectCustomButtonsContainer();
    injectAutoFillButton(settings.selectHours);

    // Inject pattern filler and wait completion before continuing
    await injectPatternFill(
        settings.patternFill_startDay,
        settings.patternFill_daysOn,
        settings.patternFill_daysOff,
        settings.patternFill_includeBankHolidays,
        settings.selectHours
	);
	
	bypassBlockedNonAlphanumericChars();

    if (settings.autoFillFields) {
        autoFillTaskNumber(settings.autoFillTaskNumber);
        autoFillProjectCode(settings.autoFillProjectCode);
	}

	loadSelectMode(settings.selectMode, settings.selectHours); // Inject checkbox mode
	injectDraggingCheckboxSelection();
}

// Load settings from storage and run login scripts
LoadExtensionSettings((settings: Record<string, any>) => ItemPageScripts(settings));
