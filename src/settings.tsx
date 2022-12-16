import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LoadExtensionSettings, {
  assignSpecialToken,
  decryptString,
  encryptString,
} from "./content-scripts/modules/settings";

function Settings() {
  // const [specialToken, setSpecialToken] = useState<string>("");

  const [shortcutKeys, setShortcutKeys] = useState<boolean>(false);
  const [fixSummaryTable, setFixSummaryTable] = useState<boolean>(false);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectHours, setSelectHours] = useState<string>("7.5");

  const [showBankHolidays, setShowBankHolidays] = useState<boolean>(false);
  const [holidayRegion, setHolidayRegion] = useState<string>("england-and-wales");

  const [autoLogin, setAutoLogin] = useState<boolean>(false);
  const [employeeNumber, setEmployeeNumber] = useState<string>("");

  const [autoFillFields, setAutoFillFields] = useState<boolean>(false);
  const [autoFillTaskNumber, setAutoFillTaskNumber] = useState<string>("");
  const [autoFillProjectCode, setAutoFillProjectCode] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    LoadExtensionSettings((settings) => {
      if (!settings.specialToken)
        assignSpecialToken((token) => {
          settings.specialToken = token;
        });

      setShortcutKeys(settings.shortcutKeys);
      setFixSummaryTable(settings.fixSummaryTable);
      setSelectMode(settings.selectMode);
      setSelectHours(settings.selectHours);

      setShowBankHolidays(settings.showBankHolidays);
      setHolidayRegion(settings.holidayRegion);

      setAutoLogin(settings.autoLogin);

      setEmployeeNumber(decryptString(settings.specialToken, settings.employeeNumber));

      setAutoFillFields(settings.autoFillFields);
      setAutoFillTaskNumber(settings.autoFillTaskNumber);
      setAutoFillProjectCode(settings.autoFillProjectCode);
    });
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.get(
      {
        specialToken: "",
      },
      (settings) => {
        // TODO Move this to settings.ts
        chrome.storage.sync.set(
          {
            shortcutKeys,
            fixSummaryTable,
            selectMode,
            selectHours,
            showBankHolidays,
            holidayRegion,
            autoLogin,
            employeeNumber: encryptString(settings.specialToken, employeeNumber),
            autoFillFields,
            autoFillTaskNumber,
            autoFillProjectCode,
          },
          () => {
            // Update status to let user know options were saved.
            setStatus("Settings saved.");
            const id = setTimeout(() => {
              setStatus("");
            }, 5000);
            return () => clearTimeout(id);
          },
        );
      },
    );
  };

  return (
    <>
      <h1 style={{ marginTop: "0px", marginBottom: "8px" }}>Settings</h1>
      <div>
        <div>
          <div>
            <label htmlFor="shortcutKeys">
              Shortcut Keys
              <input
                id="shortcutKeys"
                type="checkbox"
                checked={shortcutKeys}
                onChange={(e) => setShortcutKeys(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="fixSummaryTable">
            Fix Summary Table
            <input
              id="fixSummaryTable"
              type="checkbox"
              checked={fixSummaryTable}
              onChange={(e) => setFixSummaryTable(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="selectMode">
            Select Mode
            <input
              id="selectMode"
              type="checkbox"
              checked={selectMode}
              onChange={(e) => setSelectMode(e.target.checked)}
            />
          </label>
        </div>
        {selectMode && (
          <div>
            <label htmlFor="selectHours">
              Select Hours
              <input
                id="selectHours"
                type="number"
                value={selectHours}
                onChange={(e) => setSelectHours(e.target.value)}
              />
            </label>
          </div>
        )}
        <div>
          <label htmlFor="showBankHolidays">
            Show Bank Holidays
            <input
              id="showBankHolidays"
              type="checkbox"
              checked={showBankHolidays}
              onChange={(e) => setShowBankHolidays(e.target.checked)}
            />
          </label>
        </div>
        {showBankHolidays && (
          <div>
            <label htmlFor="holidayRegion">
              Holiday Region
              <select
                id="holidayRegion"
                value={holidayRegion}
                onChange={(e) => setHolidayRegion(e.target.value)}
              >
                <option value="england-and-wales">England and Wales</option>
                <option value="scotland">Scotland</option>
                <option value="northern-ireland">Northern Ireland</option>
              </select>
            </label>
          </div>
        )}
        <div>
          <label htmlFor="autoLogin">
            Auto Login
            <input
              id="autoLogin"
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
            />
          </label>
        </div>
        {autoLogin && (
          <div>
            <label htmlFor="employeeNumber">
              Employee Number
              <input
                id="employeeNumber"
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
              />
            </label>
          </div>
        )}
        <div>
          <label htmlFor="autoFillFields">
            Auto Fill Fields
            <input
              id="autoFillFields"
              type="checkbox"
              checked={autoFillFields}
              onChange={(e) => setAutoFillFields(e.target.checked)}
            />
          </label>
        </div>
        {autoFillFields && (
          <div>
            <label htmlFor="autoFillTaskNumber">
              Auto Fill Task Number
              <input
                id="autoFillTaskNumber"
                type="text"
                value={autoFillTaskNumber}
                onChange={(e) => setAutoFillTaskNumber(e.target.value)}
              />
            </label>
          </div>
        )}
        {autoFillFields && (
          <div>
            <label htmlFor="autoFillProjectCode">
              Auto Fill Project Code
              <input
                id="autoFillProjectCode"
                type="text"
                value={autoFillProjectCode}
                onChange={(e) => setAutoFillProjectCode(e.target.value)}
              />
            </label>
          </div>
        )}
        {/* <button type="button" onClick={saveOptions}> */}
        <button type="button" onClick={saveOptions}>
          Save
        </button>

        {status && (
          <div>
            <div>{status}</div>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById("root"),
);
