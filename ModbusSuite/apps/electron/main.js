import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

let backendProcess;

import {
  initializeTrial,
  getTrialStatus,
} from "../../packages/licensing/trial.service.js";

import { getMachineId } from "../../packages/licensing/machine.service.js";

import {
  browseLicenseFile,
  activateLicense,
} from "../../packages/licensing/activation.service.js";

import {
  licenseExists,
  getLicensePath,
} from "../../packages/licensing/storage.service.js";

import {
  verifyLicenseFile,
} from "../../packages/licensing/license.service.js";

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

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) {
      console.error("[Electron] Renderer failed to load", {
        errorCode,
        errorDescription,
        validatedURL,
      });
    }
  });

  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    console.log("[Renderer console]", { level, message, line, sourceId });
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error("[Electron] Renderer process exited", details);
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173").catch((error) => {
      console.error("[Electron] Unable to load the Vite dev server", error);
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../ui/dist/index.html")
    ).catch((error) => {
      console.error("[Electron] Unable to load the built renderer", error);
    });
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

  console.log("[Electron] Starting", {
    isPackaged: app.isPackaged,
    nodeEnv: process.env.NODE_ENV || "production",
  });

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

      console.log("[Licensing IPC] get-license-status");

      if (licenseExists()) {

        const result = verifyLicenseFile(getLicensePath());

        if (result.valid) {

          console.log("[Licensing IPC] License is valid", {
            licenseType: result.licenseType,
            expiresOn: result.expiresOn,
          });

          return {
            version: app.getVersion(),

            machineId: getMachineId(),

            licenseType: result.licenseType,

            customer: result.customer,

            expiresOn: result.expiresOn,

            remainingDays: result.remainingDays,

            expired: false,
          };

        }

        console.warn("[Licensing IPC] Installed license is invalid", {
          reason: result.reason,
        });

        return {
          version: app.getVersion(),
          machineId: getMachineId(),
          licenseType: "INVALID",
          expired: true,
          reason: result.reason,
        };

      }

      // Trial

      const trial = getTrialStatus();

      console.log("[Licensing IPC] Returning trial status", trial);

      return {

        version: app.getVersion(),

        machineId: getMachineId(),

        licenseType: "TRIAL",

        remainingDays: trial.remainingDays,

        expired: trial.expired,

      };

    } catch (err) {

      console.error("[Licensing IPC] License status failed", err);

      return {

        version: app.getVersion(),

        machineId: "",

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
      console.log("[Licensing IPC] browse-license");
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
      console.log("[Licensing IPC] activate-license");
      const result = activateLicense(filePath);
      console.log("[Licensing IPC] License activation result", {
        valid: result.valid,
        reason: result.reason,
      });
      return result;
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
