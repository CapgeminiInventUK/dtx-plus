// Load settings from storage (with defaults) and run a given function
export function LoadExtensionSettings(callback: Function) {
    chrome.storage.sync.get({
        // lastVersionUsed: null,

        // shortcutKeys: true,
        // selectMode: true,
        // selectHours: 7.5,

        // fixSummaryTable: false,

        // showBankHolidays: true,
        holidayRegion: "england-and-wales",
        cacheBankHolidaysEvents: null,
        cacheBankHolidayRegions: null,
        cacheDateBankHolidays: null,

        // autoLogin: false,
        // employeeNumber: "",
        // stopAutoLogin: false,
        // specialToken: null,

        // autoFillFields: true,
        // autoFillTaskNumber: "1", // Task number is sometimes a string
        // autoFillProjectCode: "",

        // patternFill_startDay: 1,
        // patternFill_daysOn: 4,
        // patternFill_daysOff: 4,
        // patternFill_includeBankHolidays: true,

    }, (settings) => {
        if (!settings.holidayRegion || settings.holidayRegion.trim() == "") settings.holidayRegion = "england-and-wales";
        callback(settings);
    });
}