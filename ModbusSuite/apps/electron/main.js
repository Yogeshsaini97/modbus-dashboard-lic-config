import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

let backendProcess;

import {
  initializeTrial,
  getTrialStatus,
} from "./services/trial.service.js";

import { getMachineId } from "./services/machine.service.js";

import {
  browseLicenseFile,
  activateLicense,
} from "./services/activation.service.js";

import {
  licenseExists,
  getLicensePath,
} from "./services/storage.service.js";

import {
  verifyLicenseFile,
} from "./services/license.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

// Set Application Name
app.setName("Hello Electron");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

 const isDev = process.env.NODE_ENV === "development";

if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
} else {
    mainWindow.loadFile(
        path.join(__dirname, "../ui/dist/index.html")
    );
}


  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startBackend() {

    if (app.isPackaged) {
        // We'll handle production later
        return;
    }

    console.log("=================================");
    console.log("Starting Backend...");
    console.log("=================================");

    backendProcess = spawn(

        process.platform === "win32" ? "npm.cmd" : "npm",

        ["start"],

        {

            cwd: path.join(__dirname, "../backend"),

            shell: true,

            stdio: "inherit"

        }

    );

    backendProcess.on("error", (err) => {

        console.error("Backend Error:", err);

    });

    backendProcess.on("close", (code) => {

        console.log("Backend Closed :", code);

    });

}
app.whenReady().then(() => {

  // Only create a trial if no activated license exists
  if (!licenseExists()) {
    initializeTrial();
  }

  startBackend();

setTimeout(() => {

    createWindow();

}, 3000);

  // =====================================================
  // MACHINE ID
  // =====================================================

  ipcMain.handle("get-machine-id", () => {
    try {
      return getMachineId();
    } catch (err) {
      console.error("Machine ID Error:", err);
      return "";
    }
  });

  // =====================================================
  // LICENSE STATUS
  // =====================================================

  ipcMain.handle("get-license-status", () => {
    try {

      if (licenseExists()) {

        const result = verifyLicenseFile(getLicensePath());

        if (result.valid) {

          return {
            version: app.getVersion(),

            licenseType: result.licenseType,

            customer: result.customer,

            expiresOn: result.expiresOn,

            remainingDays: null,

            expired: false,
          };

        }

      }

      // Trial

      const trial = getTrialStatus();

      return {

        version: app.getVersion(),

        licenseType: "TRIAL",

        remainingDays: trial.remainingDays,

        expired: trial.expired,

      };

    } catch (err) {

      console.error("License Status Error:", err);

      return {

        version: app.getVersion(),

        licenseType: "TRIAL",

        remainingDays: 0,

        expired: true,

      };

    }
  });

  // =====================================================
  // BROWSE LICENSE
  // =====================================================

  ipcMain.handle("browse-license", async () => {
    try {
      return await browseLicenseFile();
    } catch (err) {
      console.error("Browse Error:", err);
      return null;
    }
  });

  // =====================================================
  // ACTIVATE LICENSE
  // =====================================================

  ipcMain.handle("activate-license", async (event, filePath) => {
    try {
      return activateLicense(filePath);
    } catch (err) {

      console.error("Activation Error:", err);

      return {
        valid: false,
        reason: "UNKNOWN_ERROR",
      };
    }
  });

  app.on("activate", () => {

    if (BrowserWindow.getAllWindows().length === 0) {

      createWindow();

    }

  });

});

app.on("window-all-closed", () => {

    if (backendProcess) {

        backendProcess.kill();

    }

    if (process.platform !== "darwin") {

        app.quit();

    }

});