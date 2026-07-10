import fs from "fs";
import path from "path";
import { app } from "electron";

const APP_FOLDER = path.join(app.getPath("userData"), "license");

if (!fs.existsSync(APP_FOLDER)) {
  fs.mkdirSync(APP_FOLDER, { recursive: true });
}

const LICENSE_PATH = path.join(APP_FOLDER, "license.lic");

export function saveLicense(sourceFile) {
  fs.copyFileSync(sourceFile, LICENSE_PATH);
}

export function licenseExists() {
  return fs.existsSync(LICENSE_PATH);
}

export function getLicensePath() {
  return LICENSE_PATH;
}

export function removeLicense() {
  if (licenseExists()) {
    fs.unlinkSync(LICENSE_PATH);
  }
}