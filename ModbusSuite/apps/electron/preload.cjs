const { contextBridge, ipcRenderer } = require("electron");

console.log("[Preload] Exposing licenseAPI bridge");

contextBridge.exposeInMainWorld("licenseAPI", {

    getLicenseStatus: () => {
        console.log("[Preload] getLicenseStatus invoked");
        return ipcRenderer.invoke("get-license-status");
    },

    getMachineId: () =>
        ipcRenderer.invoke("get-machine-id"),

    browseLicense: () => {
        console.log("[Preload] browseLicense invoked");
        return ipcRenderer.invoke("browse-license");
    },

    activateLicense: (filePath) => {
        console.log("[Preload] activateLicense invoked");
        return ipcRenderer.invoke("activate-license", filePath);
    },
    

});
