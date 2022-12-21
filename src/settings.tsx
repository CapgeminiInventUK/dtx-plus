import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import {
  Alert,
  AppBar,
  Box,
  createTheme,
  Snackbar,
  ThemeProvider,
  Toolbar,
  Typography,
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
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Settings
            </Typography>
            <Button color="inherit" onClick={saveOptions}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 1 }}>
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
              <SwitchOption
                inputId="fixSummaryTable"
                checked={fixSummaryTable}
                onChange={setFixSummaryTable}
                label="Fix summary table"
              />
            </Grid>
            <Grid>
              <SwitchOption
                inputId="selectMode"
                checked={selectMode}
                onChange={setSelectMode}
                label="Select mode"
              />
            </Grid>
            {selectMode && (
              <Box sx={{ p: 1 }}>
                <Card>
                  <CardContent>
                    <InputOption
                      inputId="selectHours"
                      value={selectHours}
                      onChange={setSelectHours}
                      label="Select hours"
                      inputType="number"
                    />
                  </CardContent>
                </Card>
              </Box>
            )}

            <Grid>
              <SwitchOption
                inputId="showBankHolidays"
                checked={showBankHolidays}
                onChange={setShowBankHolidays}
                label="Show bank holidays"
              />
            </Grid>
            {showBankHolidays && (
              <Box sx={{ p: 1 }}>
                <Card>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </Box>
            )}
            <Grid>
              <SwitchOption
                inputId="autoLogin"
                checked={autoLogin}
                onChange={setAutoLogin}
                label="Auto login"
              />
            </Grid>
            {autoLogin && (
              <Box sx={{ p: 1 }}>
                <Card variant="outlined">
                  <CardContent>
                    <InputOption
                      inputId="employeeNumber"
                      value={employeeNumber}
                      onChange={setEmployeeNumber}
                      label="Employee Number"
                      inputType="text"
                    />
                  </CardContent>
                </Card>
              </Box>
            )}
            <Grid>
              <SwitchOption
                inputId="autoFillFields"
                checked={autoFillFields}
                onChange={setAutoFillFields}
                label="Auto fill fields"
              />
            </Grid>
            {autoFillFields && (
              <Box sx={{ p: 1 }}>
                <Card>
                  <CardContent>
                    <Grid container direction="column" spacing={2}>
                      <Grid>
                        <InputOption
                          inputId="autoFillTaskNumber"
                          value={autoFillTaskNumber}
                          onChange={setAutoFillTaskNumber}
                          label="Task Number"
                          inputType="text"
                        />
                      </Grid>
                      <Grid>
                        <InputOption
                          inputId="autoFillProjectCode"
                          value={autoFillProjectCode}
                          onChange={setAutoFillProjectCode}
                          label="Auto Fill Project Code"
                          inputType="text"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}

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
