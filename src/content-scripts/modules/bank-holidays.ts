import { printLine } from "./print";

const bankHolidays_apiURL = "https://www.gov.uk/bank-holidays.json"; // URL to fetch up to date bank holidays

interface BankHoliday{
    date: Date,
    title: String,
}

// Returns true if a date falls on a bank holiday inside JSON events
function isBankHoliday(selectedDate: Date, holidaysJSON: Array<BankHoliday>) {
    for (let i = 0; i < holidaysJSON.length; i++) {
        let dateObj = new Date(holidaysJSON[i].date);
        dateObj.setHours(0); // Eliminate British Summer Time

        // Compare milliseconds since the Unix Epoch (JS safe way to compare dates)
        if (dateObj.getTime() == selectedDate.getTime()) {
            return true;
        }
    }
    return false;
}

// Pulls bank holidays from UK gov site and sends them to handler
function fetchBankHolidaysJSON(callback: Function) {
    fetch(bankHolidays_apiURL)
        .then((response) => response.json())
        .then((data) => callback(data));
}

// Loads bank holidays JSON from cache or downloads it if cache is unset or old
// Runs callback with parameters:
//  callback(holidayRegions, holidayEvents)
export function getBankHolidaysJSON(items: any, callback: Function) {
    const currentDate = new Date().getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const cacheAvailable = items.cacheDateBankHolidays && currentDate - thirtyDays < items.cacheDateBankHolidays;

    if (cacheAvailable) {
        printLine("Loaded bank holidays from cache");
        callback(items.cacheBankHolidayRegions, items.cacheBankHolidaysEvents);
    } else {
        printLine("Pulling bank holidays from " + bankHolidays_apiURL);
        fetchBankHolidaysJSON((holidaysJSON: Array<any>) => {
            const bankHolidayRegions = Object.keys(holidaysJSON);

            // Get bank holidays table based off user's settings
            let bankHolidayEvents = holidaysJSON[items.holidayRegion];
            try {
                if (!items.holidayRegion) throw "Your bank holiday region is unset!";
                if (!bankHolidayEvents) throw "Bank holidays JSON from gov.uk didn't contain your region!";
                bankHolidayEvents = holidaysJSON[items.holidayRegion].events;
            } catch (e) {
                throw new Error("ERROR SHOWING BANK HOLIDAYS:\n" + e);
            }

            chrome.storage.sync.set({
                cacheBankHolidayRegions: bankHolidayRegions,
                cacheBankHolidaysEvents: bankHolidayEvents,
                cacheDateBankHolidays: currentDate
            },
                function () {
                    callback(bankHolidayRegions, bankHolidayEvents)
                });
        });
    }
}

