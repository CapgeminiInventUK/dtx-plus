import  printLine  from "./print";

// URL to fetch up to date bank holidays
const bankHolidaysApiURL = "https://www.gov.uk/bank-holidays.json";

type BankHolidayEvent = {
    title: string
    date: string
    notes: string
    bunting: boolean
}

 type RegionBankHolidayEvents = {
    division: string
    events: BankHolidayEvent[]
}
type BankHolidayResponse = Record<string, RegionBankHolidayEvents>

// Returns true if a date falls on a bank holiday inside JSON events
function isBankHoliday(selectedDate: Date, holidaysJSON: Array<BankHolidayEvent>) {
    for (let i = 0; i < holidaysJSON.length; i += 1) {
        const dateObj = new Date(holidaysJSON[i].date);
        dateObj.setHours(0); // Eliminate British Summer Time

        // Compare milliseconds since the Unix Epoch (JS safe way to compare dates)
        if (dateObj.getTime() === selectedDate.getTime()) {
            return true;
        }
    }
    return false;
}

// Runs callback for each calender cell that represents a bank holiday day
function forEachBankHolidayCell(myBankHolidays: BankHolidayEvent[],
    callback: (cell: HTMLInputElement) => void) {

    // Based off DTX's own cal-validator code for longevity:
    // checkCalendarValues(control,page,OverrideVAT)
    // in https://missbhadtx03.corp.capgemini.com/DTX.NET/Scripts/script.js
    const strCalendarDayPrefix = "calDates_txtCalDate";
    try {
        const selectedDateObj = (document.getElementById("drpIncurredPeriod") ||
            document.getElementById("drpPeriods")) as HTMLSelectElement | null;
        
        if (selectedDateObj) {
        
        const selectedDateText = selectedDateObj.options[selectedDateObj.selectedIndex].text;
        const selectedDate = new Date(Date.parse(selectedDateText));

        for (let intCnt = 1; intCnt < 32; intCnt += 1) {
            const obj = document.getElementById(strCalendarDayPrefix + intCnt.toString()) as
                HTMLInputElement | null;

            // Check there's a calender day input for this date
            if (obj != null) {
                selectedDate.setDate(intCnt); // Update date's date
                if (isBankHoliday(selectedDate, myBankHolidays)) {
                    callback(obj);
                }
            }
        }}
    } catch (e: any) {
        console.warn(`Error in checkCalendarValues - \n${  e.message}`);
    }
}


// Pulls bank holidays from UK gov site and sends them to handler
function fetchBankHolidaysJSON(callback: (response: BankHolidayResponse) => void) {
    fetch(bankHolidaysApiURL)
        .then((response) => response.json())
        .then((data) => callback(data));
}

// Highlights bank holiday cells in calender views
export function handleShowBankHolidays(myBankHolidays: BankHolidayEvent[]) {
    forEachBankHolidayCell(myBankHolidays, (cell) => {
        cell.classList.add("bankHolidayDay");
        cell.placeholder = "Bank H";

        // Remove 0 so placeholder text can show
        // Useful in calenders such as "Period Overview"
        if (cell.value === "0") cell.value = "";
    });
}

// Loads bank holidays JSON from cache or downloads it if cache is unset or old
// Runs callback with parameters:
//  callback(holidayRegions, holidayEvents)
export function getBankHolidaysJSON(
    settings: Record<string, any>,
    callback: (regions: Array<string>, events: Array<BankHolidayEvent>) => void) {
    const currentDate = new Date().getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const cacheAvailable = settings.cacheDateBankHolidays &&
        currentDate - thirtyDays < settings.cacheDateBankHolidays;

    if (cacheAvailable) {
        printLine("Loaded bank holidays from cache");
        callback(settings.cacheBankHolidayRegions, settings.cacheBankHolidaysEvents);
    } else {
        printLine(`Pulling bank holidays from ${  bankHolidaysApiURL}`);
        fetchBankHolidaysJSON((holidaysJSON: BankHolidayResponse) => {
            const bankHolidayRegions = Object.keys(holidaysJSON);

            // Get bank holidays table based off user's settings
            try {
                if (!settings.holidayRegion)
                    throw Error("Your bank holiday region is unset!");
                if (!holidaysJSON)
                    throw Error("Bank holidays JSON from gov.uk didn't contain your region!")
                
                const bankHolidayRegionEvents = holidaysJSON[settings.holidayRegion];

                const bankHolidayEvents = bankHolidayRegionEvents.events;

                chrome.storage.sync.set({
                    cacheBankHolidayRegions: bankHolidayRegions,
                    cacheBankHolidaysEvents: bankHolidayEvents,
                    cacheDateBankHolidays: currentDate
                },
                    () => {
                        callback(bankHolidayRegions, bankHolidayEvents)
                    });
            } catch (e) {
                throw new Error(`ERROR SHOWING BANK HOLIDAYS:\n${  e}`);
            }
        });
    }
}

