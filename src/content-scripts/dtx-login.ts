/*
    dtx-login.js
     This file handles extra features added to the DTX login page
*/

import printLine from "./modules/print";
import LoadExtensionSettings, { decryptString } from "./modules/settings";

// Auto-fills and logins in if form is available on current page
function autoLogin(employeeNumber: string) {
  const loginForm = document.getElementById("frmLogin");
  if (loginForm !== null) {
    printLine("Login form found");
    const loginFormElement = loginForm as HTMLFormElement;
    document.body.style.visibility = "hidden"; // Hide login page

    const employeeNumberInput = loginFormElement.elements.namedItem("txtEmployeeNumber");
    if (employeeNumberInput !== null) {
      (employeeNumberInput as HTMLInputElement).value = employeeNumber;
      loginFormElement.submit();
    }
  } else {
    printLine("Login form not found");
  }
}

// Runs auto-login ONLY if not previously ran
//  This prevents incorrect details causing endless login attempt spam
function LoginPageScripts(settings: Record<string, any>) {
  // Abort auto-login if disabled or login details aren't configured
  if (!settings.autoLogin || !settings.specialToken || !settings.employeeNumber) return;

  // Abort auto-login if the user explicitly logged themselves out OR if
  // auto-login was already ran (and therefore failed)
  // This flag is automatically reset after a successful login.
  // It prevents incorrect details causing endless auto-login attempts (page
  // reload spam)
  if (settings.stopAutoLogin) return;

  // Record that a login attempt will be ran
  chrome.storage.sync.set({ stopAutoLogin: true }, () => {
    autoLogin(decryptString(settings.specialToken, settings.employeeNumber));
  });
}

// Load settings from storage and run login scripts
LoadExtensionSettings((settings: Record<string, any>) => LoginPageScripts(settings));
