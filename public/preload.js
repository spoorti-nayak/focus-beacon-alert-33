
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  startFocusMode: (apps) => ipcRenderer.invoke('start-focus-mode', apps),
  stopFocusMode: () => ipcRenderer.invoke('stop-focus-mode'),
  updateWhitelist: (apps) => ipcRenderer.invoke('update-whitelist', apps),
  getRunningApps: () => ipcRenderer.invoke('get-running-apps'),
  getFocusStatus: () => ipcRenderer.invoke('get-focus-status'),
  onFocusBreakDetected: (callback) => {
    ipcRenderer.on('focus-break-detected', (event, data) => callback(data));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
