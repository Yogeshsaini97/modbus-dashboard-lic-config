import { dialog } from "electron";
import { verifyLicenseFile } from "./license.service.js";
import { saveLicense } from "./storage.service.js";

export async function browseLicenseFile() {
  const result = await dialog.showOpenDialog({
    title: "Select License File",
    properties: ["openFile"],
    filters: [
      {
        name: "License Files",
        extensions: ["lic"],
      },
    ],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
}

export function activateLicense(filePath) {

    const result = verifyLicenseFile(filePath);

    if(result.valid){

        saveLicense(filePath);

    }

    return result;

}