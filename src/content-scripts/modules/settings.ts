import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

function assembleToken() {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = "";
  for (let i = 0; i < randomPool.length; i += 1) {
    hex += randomPool[i].toString(16);
  }
  return hex;
}

export function assignSpecialToken(callback: (newToken: string) => void) {
  const newToken = assembleToken();
  chrome.storage.sync.set({ specialToken: newToken }, () => {
    if (callback) callback(newToken);
  });
}

export function decryptString(specialToken: string, toDecrypt: string) {
  const data = AES.decrypt(toDecrypt, specialToken);
  return data.toString(CryptoJS.enc.Utf8);
}

export function encryptString(specialToken: string, toEncrypt: string) {
  const data = AES.encrypt(toEncrypt, specialToken);
  return data.toString();
}

export function saveSettings(settings: Record<string, any>, callback?: () => void) {
  chrome.storage.sync.set(settings, () => {
    if (callback) callback();
  });
}

// Load settings from storage (with defaults) and run a given function
export function getSettings(callback: (userSettings: Record<string, any>) => void) {
  chrome.storage.sync.get(
    {
      lastVersionUsed: null,

      shortcutKeys: true,
      selectMode: true,
      selectHours: 7.5,

      fixSummaryTable: true,

      showBankHolidays: true,
      holidayRegion: "england-and-wales",
      cacheBankHolidaysEvents: null,
      cacheBankHolidayRegions: null,
      cacheDateBankHolidays: null,

      autoLogin: false,
      employeeNumber: "",
      stopAutoLogin: false,
      specialToken: null,

      autoFillFields: true,
      autoFillTaskNumber: "1", // Task number is sometimes a string
      autoFillProjectCode: "",

      patternFill_startDay: 1,
      patternFill_daysOn: 4,
      patternFill_daysOff: 4,
      patternFill_includeBankHolidays: true,
    },
    (settings) => {
      if (!settings.holidayRegion || settings.holidayRegion.trim() === "") {
        settings.holidayRegion = "england-and-wales";
      }
      callback(settings);
    },
  );
}
