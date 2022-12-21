import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";

import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

import {
  assignSpecialToken,
  decryptString,
  encryptString,
  saveSettings,
  getSettings,
} from "./content-scripts/modules/settings";
import SwitchOption from "./components/switch-option";
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
    <Grid2 container direction="column" spacing={2}>
      <Grid2>
        <h1 style={{ marginTop: "0px", marginBottom: "8px" }}>Settings</h1>
      </Grid2>
      <Grid2>
        <SwitchOption
          inputId="shortcutKeys"
          checked={shortcutKeys}
          onChange={setShortcutKeys}
          label="Shortcut keys"
        />
      </Grid2>
      <Grid2>
        <SwitchOption
          inputId="fixSummaryTable"
          checked={fixSummaryTable}
          onChange={setFixSummaryTable}
          label="Fix summary table"
        />
      </Grid2>
      <Grid2>
        <SwitchOption
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
      </Grid2>
      <Grid2>
        <SwitchOption
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
      </Grid2>
      <Grid2>
        <SwitchOption
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
      </Grid2>
      <Grid2>
        <SwitchOption
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
      </Grid2>
      <Grid2>
        <Button variant="outlined" onClick={saveOptions}>
          Save
        </Button>
      </Grid2>

      {status && (
        <Grid2>
          <div>{status}</div>
        </Grid2>
      )}
    </Grid2>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById("root"),
);
