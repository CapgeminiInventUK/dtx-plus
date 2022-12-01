import { getBankHolidaysJSON } from "./modules/bank-holidays";
import { printLine } from "./modules/print";
import { LoadExtensionSettings } from "./modules/settings";

printLine('Starting all')
LoadExtensionSettings((userSettings: Object) => getBankHolidaysJSON(userSettings, () => {
    printLine('Ended of loading polyfill')
 }));
