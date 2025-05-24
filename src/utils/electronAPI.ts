
// Electron API interface for renderer process
export interface ElectronAPI {
  startFocusMode: (apps: string[]) => Promise<{ success: boolean; message: string }>;
  stopFocusMode: () => Promise<{ success: boolean; message: string }>;
  updateWhitelist: (apps: string[]) => Promise<{ success: boolean; message: string }>;
  getRunningApps: () => Promise<{ success: boolean; apps?: string[]; error?: string }>;
  getFocusStatus: () => Promise<{ enabled: boolean; whitelistedApps: string[]; timestamp: string }>;
  onFocusBreakDetected: (callback: (data: any) => void) => void;
}

// Check if running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' && (window as any).electron !== undefined;
};

// Mock API for web environment
const mockElectronAPI: ElectronAPI = {
  startFocusMode: async (apps: string[]) => {
    console.log('Mock: Starting focus mode with apps:', apps);
    return { success: true, message: 'Focus mode started (mock)' };
  },
  stopFocusMode: async () => {
    console.log('Mock: Stopping focus mode');
    return { success: true, message: 'Focus mode stopped (mock)' };
  },
  updateWhitelist: async (apps: string[]) => {
    console.log('Mock: Updating whitelist:', apps);
    return { success: true, message: 'Whitelist updated (mock)' };
  },
  getRunningApps: async () => {
    console.log('Mock: Getting running apps');
    return { 
      success: true, 
      apps: ['Chrome', 'VSCode', 'Spotify', 'Discord', 'Slack'] 
    };
  },
  getFocusStatus: async () => {
    return {
      enabled: false,
      whitelistedApps: [],
      timestamp: new Date().toISOString()
    };
  },
  onFocusBreakDetected: (callback: (data: any) => void) => {
    console.log('Mock: Setting up focus break detection callback');
    // In web environment, we can simulate focus breaks for testing
    setTimeout(() => {
      callback({
        runningApps: ['Chrome', 'VSCode', 'Spotify'],
        nonWhitelistedApps: ['Spotify'],
        timestamp: new Date().toISOString()
      });
    }, 10000); // Simulate a focus break after 10 seconds
  }
};

// Real Electron API using the preload script
const realElectronAPI: ElectronAPI = {
  startFocusMode: (apps: string[]) => {
    return (window as any).electron.startFocusMode(apps);
  },
  stopFocusMode: () => {
    return (window as any).electron.stopFocusMode();
  },
  updateWhitelist: (apps: string[]) => {
    return (window as any).electron.updateWhitelist(apps);
  },
  getRunningApps: () => {
    return (window as any).electron.getRunningApps();
  },
  getFocusStatus: () => {
    return (window as any).electron.getFocusStatus();
  },
  onFocusBreakDetected: (callback: (data: any) => void) => {
    return (window as any).electron.onFocusBreakDetected(callback);
  }
};

// Export the appropriate API based on environment
export const electronAPI: ElectronAPI = isElectron() ? realElectronAPI : mockElectronAPI;

// Utility function to check if we're running in Electron
export const isRunningInElectron = isElectron;
