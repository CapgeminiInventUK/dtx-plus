import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  assignSpecialToken,
  decryptString,
  encryptString,
  saveSettings,
  getSettings,
} from "./content-scripts/modules/settings";
import CheckboxOption from "./components/checkbox-option";
import InputOption from "./components/input-option";
import DropdownOption from "./components/dropdown-option";

function Settings() {
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
    getSettings((settings) => {
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
        saveSettings(
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
        <CheckboxOption
          inputId="shortcutKeys"
          checked={shortcutKeys}
          onChange={setShortcutKeys}
          label="Enable shortcut keys"
        />
        <CheckboxOption
          inputId="fixSummaryTable"
          checked={fixSummaryTable}
          onChange={setFixSummaryTable}
          label="Fix summary table"
        />
        <CheckboxOption
          inputId="selectMode"
          checked={selectMode}
          onChange={setSelectMode}
          label="Select mode"
        />
        {selectMode && (
          <InputOption
            inputId="selectHours"
            value={selectHours}
            onChange={setSelectHours}
            label="Select hours"
            inputType="number"
          />
        )}
        <CheckboxOption
          inputId="showBankHolidays"
          checked={showBankHolidays}
          onChange={setShowBankHolidays}
          label="Show bank holidays"
        />
        {showBankHolidays && (
          <DropdownOption
            inputId="holidayRegion"
            value={holidayRegion}
            onChange={setHolidayRegion}
            label="Holiday region"
            options={[
              { value: "england-and-wales", label: "England and Wales" },
              { value: "scotland", label: "Scotland" },
              { value: "northern-ireland", label: "Northern Ireland" },
            ]}
          />
        )}
        <CheckboxOption
          inputId="autoLogin"
          checked={autoLogin}
          onChange={setAutoLogin}
          label="Auto login"
        />
        {autoLogin && (
          <InputOption
            inputId="employeeNumber"
            value={employeeNumber}
            onChange={setEmployeeNumber}
            label="Employee Number"
            inputType="text"
          />
        )}
        <CheckboxOption
          inputId="autoFillFields"
          checked={autoFillFields}
          onChange={setAutoFillFields}
          label="Auto fill fields"
        />
        {autoFillFields && (
          <InputOption
            inputId="autoFillTaskNumber"
            value={autoFillTaskNumber}
            onChange={setAutoFillTaskNumber}
            label="Task Number"
            inputType="text"
          />
        )}
        {autoFillFields && (
          <InputOption
            inputId="autoFillProjectCode"
            value={autoFillProjectCode}
            onChange={setAutoFillProjectCode}
            label="Auto Fill Project Code"
            inputType="text"
          />
        )}
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
