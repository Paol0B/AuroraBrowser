const { contextBridge, ipcRenderer } = require('electron');

// Expose Aurora API to renderer process
contextBridge.exposeInMainWorld('aurora', {
  // Tab management
  tabs: {
    open: (url, container) => ipcRenderer.invoke('tab:open', { url, container }),
    close: (tabId) => ipcRenderer.invoke('tab:close', { tabId }),
    navigate: (tabId, url) => ipcRenderer.invoke('tab:navigate', { tabId, url }),
    list: () => ipcRenderer.invoke('tab:list')
  },

  // Privacy features
  privacy: {
    getStats: () => ipcRenderer.invoke('privacy:getStats')
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close')
  }
});