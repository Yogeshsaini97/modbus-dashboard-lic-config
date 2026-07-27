const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("licenseAPI", {

    getLicenseStatus: () =>
        ipcRenderer.invoke("get-license-status"),

    getMachineId: () =>
        ipcRenderer.invoke("get-machine-id"),

    browseLicense: () =>
        ipcRenderer.invoke("browse-license"),

    activateLicense: (filePath) =>
    ipcRenderer.invoke(
        "activate-license",
        filePath
    ),
    

});