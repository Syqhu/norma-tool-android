const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zzzApp", {
  notifyDailyIncomplete: (payload) => ipcRenderer.invoke("notify-daily-incomplete", payload),
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),
  checkAppUpdate: () => ipcRenderer.invoke("check-app-update"),
  openExternalUrl: (url) => ipcRenderer.invoke("open-external-url", url),
  chooseStatImage: () => ipcRenderer.invoke("choose-stat-image"),
  extractStatsFromImage: (filePath) => ipcRenderer.invoke("extract-stats-from-image", filePath),
  extractDiscFromImage: (filePath) => ipcRenderer.invoke("extract-disc-from-image", filePath),
  saveBuildCard: (payload) => ipcRenderer.invoke("save-build-card", payload),
  hoyolabLogin: () => ipcRenderer.invoke("hoyolab-login"),
  hoyolabStatus: () => ipcRenderer.invoke("hoyolab-status"),
  hoyolabSync: () => ipcRenderer.invoke("hoyolab-sync"),
  hoyolabDisconnect: () => ipcRenderer.invoke("hoyolab-disconnect")
});
