
const { app, BrowserWindow, ipcMain, powerMonitor } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');
const os = require('os');

let mainWindow;
let focusModeEnabled = false;
let whitelistedApps = [];
let monitoringInterval;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Get running applications based on OS
function getRunningApps() {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command;

    switch (platform) {
      case 'win32':
        command = 'tasklist /fo csv | findstr /v "Image Name"';
        break;
      case 'darwin':
        command = 'ps -ax -o comm= | sed "s/.*\\///" | sort | uniq';
        break;
      case 'linux':
        command = 'ps -ax -o comm= | sed "s/.*\\///" | sort | uniq';
        break;
      default:
        reject(new Error('Unsupported platform'));
        return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      let apps = [];
      if (platform === 'win32') {
        apps = stdout
          .split('\n')
          .map(line => {
            const match = line.match(/"([^"]+)"/);
            return match ? match[1] : null;
          })
          .filter(app => app && !app.includes('.exe'));
      } else {
        apps = stdout
          .split('\n')
          .filter(app => app.trim() !== '')
          .map(app => app.trim());
      }

      resolve(apps);
    });
  });
}

// Check if any non-whitelisted apps are running
async function checkFocusBreaks() {
  try {
    const runningApps = await getRunningApps();
    const nonWhitelistedApps = runningApps.filter(app => 
      !whitelistedApps.some(whitelisted => 
        app.toLowerCase().includes(whitelisted.toLowerCase())
      )
    );

    if (nonWhitelistedApps.length > 0) {
      // Send notification to renderer process
      mainWindow.webContents.send('focus-break-detected', {
        runningApps,
        nonWhitelistedApps,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error checking focus breaks:', error);
  }
}

// IPC handlers
ipcMain.handle('start-focus-mode', (event, apps) => {
  focusModeEnabled = true;
  whitelistedApps = apps;
  
  // Start monitoring every 5 seconds
  monitoringInterval = setInterval(checkFocusBreaks, 5000);
  
  console.log('Focus mode started with whitelisted apps:', whitelistedApps);
  return { success: true, message: 'Focus mode started' };
});

ipcMain.handle('stop-focus-mode', () => {
  focusModeEnabled = false;
  whitelistedApps = [];
  
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
  
  console.log('Focus mode stopped');
  return { success: true, message: 'Focus mode stopped' };
});

ipcMain.handle('update-whitelist', (event, apps) => {
  whitelistedApps = apps;
  console.log('Whitelist updated:', whitelistedApps);
  return { success: true, message: 'Whitelist updated' };
});

ipcMain.handle('get-running-apps', async () => {
  try {
    const apps = await getRunningApps();
    return { success: true, apps };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-focus-status', () => {
  return {
    enabled: focusModeEnabled,
    whitelistedApps,
    timestamp: new Date().toISOString()
  };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle power events
powerMonitor.on('suspend', () => {
  console.log('System is going to sleep');
  if (focusModeEnabled && monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});

powerMonitor.on('resume', () => {
  console.log('System resumed from sleep');
  if (focusModeEnabled) {
    monitoringInterval = setInterval(checkFocusBreaks, 5000);
  }
});

// Clean up on app quit
app.on('before-quit', () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});
