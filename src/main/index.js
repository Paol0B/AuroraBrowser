const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

class AuroraBrowser {
  constructor() {
    this.mainWindow = null;
    this.tabs = new Map();
    this.tabCounter = 0;
  }

  async createMainWindow() {
    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: true
      },
      show: false
    });

    // Configure session for privacy
    this.configureSession();

    // Load the Nuxt app
    if (isDev) {
      // Development: connect to Nuxt dev server
      await this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      // Production: load static files
      await this.mainWindow.loadFile(path.join(__dirname, '../renderer/.output/public/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  configureSession() {
    const ses = session.defaultSession;
    
    // Block third-party cookies by default
    ses.cookies.set({
      url: 'https://example.com',
      name: '_aurora_privacy',
      value: 'enabled'
    });

    // Set up request filtering for privacy
    ses.webRequest.onBeforeRequest((details, callback) => {
      const url = details.url;
      
      // Basic tracker blocking (simplified for PoC)
      const trackerDomains = [
        'doubleclick.net',
        'googleadservices.com',
        'googlesyndication.com',
        'facebook.com/tr',
        'google-analytics.com'
      ];
      
      const isTracker = trackerDomains.some(domain => url.includes(domain));
      
      if (isTracker) {
        console.log('[Aurora Privacy] Blocked tracker:', url);
        callback({ cancel: true });
      } else {
        callback({ cancel: false });
      }
    });
  }

  setupIPC() {
    // Tab management
    ipcMain.handle('tab:open', (event, { url, container = 'default' }) => {
      return this.openTab(url, container);
    });

    ipcMain.handle('tab:close', (event, { tabId }) => {
      return this.closeTab(tabId);
    });

    ipcMain.handle('tab:navigate', (event, { tabId, url }) => {
      return this.navigateTab(tabId, url);
    });

    ipcMain.handle('tab:list', () => {
      return Array.from(this.tabs.values());
    });

    // Privacy stats
    ipcMain.handle('privacy:getStats', () => {
      return {
        blockedTrackers: 0, // Will be implemented with real blocking
        blockedConnections: 0,
        blockedScripts: 0
      };
    });

    // Window controls
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
      this.mainWindow?.maximize();
    });

    ipcMain.handle('window:close', () => {
      this.mainWindow?.close();
    });
  }

  openTab(url, container = 'default') {
    const tabId = ++this.tabCounter;
    const tab = {
      id: tabId,
      url: url,
      title: 'Loading...',
      container: container,
      status: 'loading'
    };
    
    this.tabs.set(tabId, tab);
    
    // In a full implementation, this would spawn a new webview/BrowserView
    console.log(`[Aurora] Opening tab ${tabId} with URL: ${url} in container: ${container}`);
    
    return { tabId, status: 'success' };
  }

  closeTab(tabId) {
    if (this.tabs.has(tabId)) {
      this.tabs.delete(tabId);
      console.log(`[Aurora] Closed tab ${tabId}`);
      return { status: 'success' };
    }
    return { status: 'error', message: 'Tab not found' };
  }

  navigateTab(tabId, url) {
    if (this.tabs.has(tabId)) {
      const tab = this.tabs.get(tabId);
      tab.url = url;
      tab.status = 'loading';
      console.log(`[Aurora] Navigating tab ${tabId} to: ${url}`);
      return { status: 'success' };
    }
    return { status: 'error', message: 'Tab not found' };
  }

  async initialize() {
    // Disable sandbox for PoC in containerized environment
    app.commandLine.appendSwitch('no-sandbox');
    
    // App event handlers
    app.whenReady().then(() => {
      this.setupIPC();
      this.createMainWindow();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });
  }
}

// Initialize Aurora Browser
const aurora = new AuroraBrowser();
aurora.initialize();