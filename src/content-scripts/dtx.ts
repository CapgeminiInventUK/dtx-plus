import { getBankHolidaysJSON, handleShowBankHolidays } from "./modules/bank-holidays";
import pageContainsMenuBar from "./modules/find";
import fixMissingButtons from "./modules/fixes";
import injectStandardUKTimeButton from "./modules/menu";
import printLine from "./modules/print";
import { getSettings } from "./modules/settings";
import injectShortcutKeys from "./modules/shorcuts";

function LoadPolyfiller(userSettings: Record<string, any>) {
  fixMissingButtons();

  // Only inject if the page has a menubar of buttons
  if (pageContainsMenuBar()) {
    printLine("pageContainsMenuBar");
    injectStandardUKTimeButton();
  } else {
    printLine("does not contain pageContainsMenuBar");
  }

  // Check calendar is on page before injecting calendar features
  if (document.getElementById("calDates_tabCalendar") !== null) {
    printLine("calDates_tabCalendar found on page");

    injectShortcutKeys();

    // Inject bank holiday features
    getBankHolidaysJSON(userSettings, (holidayRegions, holidayEvents) => {
      if (userSettings.showBankHolidays) {
        printLine("showBankHolidays enabled");
        handleShowBankHolidays(holidayEvents);
      } else {
        printLine("showBankHolidays disabled");
      }
    });
  } else {
    printLine("calDates_tabCalendar not found on page");
  }
}

getSettings((userSettings: Record<string, any>) => LoadPolyfiller(userSettings));
