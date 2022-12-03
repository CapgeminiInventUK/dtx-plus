import { getBankHolidaysJSON, handleShowBankHolidays } from "./modules/bank-holidays";
import  pageContainsMenuBar  from "./modules/find";
import  fixMissingButtons  from "./modules/fixes";
import  injectStandardUKTimeButton  from "./modules/menu";
import printLine from "./modules/print";
import  LoadExtensionSettings  from "./modules/settings";


function LoadPolyfiller(userSettings: Record<string, any>) {

    fixMissingButtons();

    	// Only inject if the page has a menubar of buttons
    if (pageContainsMenuBar()) {
        printLine('pageContainsMenuBar')
		injectStandardUKTimeButton();
    } else {
        printLine('does not contain pageContainsMenuBar')
    }

    // Check calender is on page before injecting calender features
    if (document.getElementById("calDates_tabCalendar") !== undefined) {
        printLine('calDates_tabCalendar found on page')
        // Inject bank holiday features
        getBankHolidaysJSON(userSettings, (holidayRegions, holidayEvents) => {
            if (userSettings.showBankHolidays) {
                printLine('showBankHolidays enabled')
                handleShowBankHolidays(holidayEvents);
            } else {
                printLine('showBankHolidays disabled')
            }
        });
    } else {
        printLine('calDates_tabCalendar not found on page')
    }
}

LoadExtensionSettings((userSettings: Record<string, any>) => LoadPolyfiller(userSettings));
