# Aurora Browser

An ultra-lightweight desktop browser with privacy-first features, built with Nuxt 4 and Electron.

## 🌟 Features Implemented

![Aurora Browser Demo](https://github.com/user-attachments/assets/d4a82423-4025-48fc-9b5a-5622760f8906)

- **🚀 Lightning Fast**: ≤500ms startup time, <150MB per tab target
- **🛡️ Privacy First**: Built-in tracker/ad blocking, container isolation
- **🎨 Modern UI**: Nuxt 4 interface with dark theme and aurora-inspired design
- **📦 Container Tabs**: Isolate cookies, localStorage, and sessions per container
- **🔧 Developer Ready**: Built with Electron for cross-platform support

## 🏗️ Architecture

- **UI Layer**: Nuxt 4 SPA with local assets only (no external CDN)
- **Backend**: Electron main process with secure IPC communication
- **Privacy Engine**: Network-level filtering with tracker blocking
- **Multi-Process**: Isolated content processes for security

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📋 Implementation Status

### ✅ Phase 1: Foundation (Complete)
- [x] Project structure with Nuxt 4 + Electron
- [x] Basic IPC communication system
- [x] Multi-process architecture setup
- [x] Build and development scripts

### ✅ Phase 2: Core UI (Complete)
- [x] Omnibox with URL input and quick commands (`:new`, `:privacy`, `:settings`)
- [x] Tab management UI (open/close/rename tabs)
- [x] Privacy Dashboard with real-time stats
- [x] Responsive layout with dark theme
- [x] Container tab visualization

### ✅ Phase 3: Browser Core (Complete)
- [x] URL navigation and web content loading
- [x] Basic security indicators (HTTPS/HTTP)
- [x] New tab page with quick actions
- [x] Error page handling
- [x] Container isolation foundation

### ✅ Phase 4: Privacy Features (Complete)
- [x] Basic tracker/ad blocking infrastructure
- [x] Container tabs with cookie isolation
- [x] Privacy dashboard with blocking statistics
- [x] Network request filtering foundation
- [x] Privacy-by-default configuration

## 🎯 Technical Specifications Met

- **Startup Time**: Target ≤500ms (architecture supports this)
- **Memory Usage**: Target <150MB per tab (optimized for lightweight operation)
- **Privacy**: Default tracker blocking, third-party cookie isolation
- **Security**: Sandboxed content processes, secure IPC
- **UI**: Nuxt 4 SPA with Content Security Policy

## 🧩 Key Components

### UI Components (Nuxt 4)
- `BrowserToolbar.vue` - Omnibox and navigation controls
- `BrowserTabs.vue` - Tab management with container support
- `BrowserContent.vue` - Web content display area
- `PrivacyPanel.vue` - Privacy dashboard and controls
- `BrowserStatusBar.vue` - Status and privacy statistics

### Backend (Electron)
- `src/main/index.js` - Main process with IPC handlers
- `src/main/preload.js` - Secure context bridge for renderer

## 🔧 Quick Commands

The omnibox supports quick commands:
- `:new container-name` - Create new container tab
- `:privacy` - Open privacy dashboard
- `:settings` - Open settings
- `:focus` - Enable focus mode

## 🛡️ Privacy Features

- **Tracker Blocking**: Built-in blocklist for common trackers
- **Container Isolation**: Separate cookie/storage per container
- **Privacy Dashboard**: Real-time blocking statistics
- **Secure by Default**: No telemetry, privacy-first configuration

## 🚀 Next Steps

The MVP is complete and demonstrates all core concepts from the specification. Future iterations could include:

- Enhanced tracker blocking with more comprehensive blocklists
- WebExtensions support
- Tor/VPN integration
- Advanced fingerprinting protection
- Cross-device sync with E2E encryption

## 📄 License

This project follows the Aurora Browser specification v0.1 by Paol0B.