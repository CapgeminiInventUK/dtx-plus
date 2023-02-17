import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import SaveIcon from "@mui/icons-material/Save";

import {
  Button,
  Unstable_Grid2 as Grid,
  Alert,
  AppBar,
  Box,
  createTheme,
  Snackbar,
  ThemeProvider,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

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

const theme = createTheme({
  spacing: 8,
  palette: {
    mode: "light",
    primary: {
      main: "#0B75B0",
    },
    secondary: {
      main: "#1F0C3C",
    },
    background: {
      default: "#F5F5F5",
    },
  },
});

const showStatusDurationMs = 6000;

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
            }, showStatusDurationMs);
            return () => clearTimeout(id);
          },
        );
      },
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="column" spacing={0}>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              DTX Plus Settings
            </Typography>
            <Button color="inherit" onClick={saveOptions} startIcon={<SaveIcon />}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 1.5 }}>
          <Grid container direction="column" spacing={2}>
            <Grid>
              <SwitchOption
                inputId="shortcutKeys"
                checked={shortcutKeys}
                onChange={setShortcutKeys}
                label="Shortcut keys"
              />
            </Grid>
            <Grid>
              <Typography variant="caption" display="block" gutterBottom>
                <b>Ctrl + S</b> - Save timesheet <b>Esc</b> - Cancel timesheet
              </Typography>
            </Grid>
            <Divider variant="middle" />
            <Grid>
              <SwitchOption
                inputId="fixSummaryTable"
                checked={fixSummaryTable}
                onChange={setFixSummaryTable}
                label="Fix summary table"
              />
            </Grid>
            <Grid>
              <Typography variant="caption" display="block" gutterBottom>
                Fix columns on the summary view to show correct column widths to match headers
              </Typography>
            </Grid>
            <Divider variant="middle" />
            <Grid>
              <SwitchOption
                inputId="selectMode"
                checked={selectMode}
                onChange={setSelectMode}
                label="Show check boxes for each day"
              />
            </Grid>
            <Grid>
              <Typography variant="caption" display="block" gutterBottom>
                Show check boxes for each day which will populate the hours field with the value you
                set below when enabled.
              </Typography>
            </Grid>
            {selectMode && (
              <Grid>
                <InputOption
                  inputId="selectHours"
                  value={selectHours}
                  onChange={setSelectHours}
                  label="Hours to input for day"
                  inputType="number"
                />
              </Grid>
            )}
            <Divider variant="middle" />
            <Grid>
              <SwitchOption
                inputId="showBankHolidays"
                checked={showBankHolidays}
                onChange={setShowBankHolidays}
                label="Display bank holidays"
              />
            </Grid>
            <Grid>
              <Typography variant="caption" display="block" gutterBottom>
                Display highlighted fields for bank holidays in the date picker.
              </Typography>
            </Grid>
            {showBankHolidays && (
              <Grid>
                <DropdownOption
                  inputId="holidayRegion"
                  value={holidayRegion}
                  onChange={setHolidayRegion}
                  label="Region to use for bank holidays"
                  options={[
                    { value: "england-and-wales", label: "England and Wales" },
                    { value: "scotland", label: "Scotland" },
                    { value: "northern-ireland", label: "Northern Ireland" },
                  ]}
                />
              </Grid>
            )}
            <Divider variant="middle" />
            <Grid>
              <SwitchOption
                inputId="autoLogin"
                checked={autoLogin}
                onChange={setAutoLogin}
                label="Auto login"
              />
              <Grid>
                <Typography variant="caption" display="block" gutterBottom>
                  Skip entering your employee number to access DTX.
                </Typography>
              </Grid>
              {autoLogin && (
                <Grid>
                  <InputOption
                    inputId="employeeNumber"
                    value={employeeNumber}
                    onChange={setEmployeeNumber}
                    label="Employee Number"
                    inputType="text"
                  />
                </Grid>
              )}
            </Grid>
            <Divider variant="middle" />
            <Grid>
              <SwitchOption
                inputId="autoFillFields"
                checked={autoFillFields}
                onChange={setAutoFillFields}
                label="Auto fill fields"
              />
              <Grid>
                <Typography variant="caption" display="block" gutterBottom>
                  Autofill the project code and task number fields when you create new item on
                  timesheet. <br />
                  <b>Note:</b> This is built in to DTX now, go to My Preferences and enter Project
                  Number and Task Code for Time
                </Typography>
                {autoFillFields && (
                  <Grid container direction="column" spacing={2}>
                    <Grid>
                      <InputOption
                        inputId="autoFillProjectCode"
                        value={autoFillProjectCode}
                        onChange={setAutoFillProjectCode}
                        label="Project Code"
                        inputType="text"
                      />
                    </Grid>
                    <Grid>
                      <InputOption
                        inputId="autoFillTaskNumber"
                        value={autoFillTaskNumber}
                        onChange={setAutoFillTaskNumber}
                        label="Task Number"
                        inputType="text"
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Snackbar open={status.length > 0} autoHideDuration={showStatusDurationMs}>
              <Alert severity="success" sx={{ width: "100%" }}>
                {status}
              </Alert>
            </Snackbar>
          </Grid>
        </Box>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById("root"),
);
