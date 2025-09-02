# Aurora Browser Development Guide

## 🏗️ Project Structure

```
aurora-browser/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.js    # Main application logic
│   │   └── preload.js  # Secure context bridge
│   ├── renderer/       # Nuxt 4 UI application
│   │   ├── app.vue     # Main application component
│   │   ├── components/ # Vue components
│   │   ├── assets/     # Styles and static assets
│   │   └── types/      # TypeScript definitions
│   └── common/         # Shared utilities (future)
├── package.json        # Main project configuration
└── README.md          # Original specification
```

## 🛠️ Development Commands

```bash
# Install all dependencies
npm install

# Start development environment
npm run dev

# Build for production
npm run build

# Start production version
npm start

# Build UI only
npm run build:nuxt

# Start Nuxt dev server only
npm run dev:nuxt
```

## 🔧 Configuration

### Electron Configuration
- **Sandbox**: Disabled for PoC (should be enabled in production)
- **Node Integration**: Disabled for security
- **Context Isolation**: Enabled
- **Remote Module**: Disabled

### Nuxt Configuration
- **SSR**: Disabled (client-side only)
- **Target**: Static generation for Electron
- **Modules**: @nuxt/ui for components and styling
- **CSP**: Configured for security

## 🎨 UI Architecture

### Component Hierarchy
```
App.vue
├── BrowserToolbar.vue (Omnibox, navigation)
├── BrowserTabs.vue (Tab management)
├── BrowserContent.vue (Web content display)
├── PrivacyPanel.vue (Privacy dashboard)
└── BrowserStatusBar.vue (Status information)
```

### State Management
- **Reactive Data**: Vue 3 Composition API
- **IPC Communication**: Secure context bridge
- **Privacy Stats**: Real-time updates via interval

## 🔒 Security Model

### Process Isolation
- **Main Process**: System access, window management, IPC handlers
- **Renderer Process**: UI only, no direct system access
- **Content Processes**: (Future) Sandboxed web content

### IPC Security
- **Context Bridge**: Exposes only necessary APIs
- **No Node Integration**: Renderer has no Node.js access
- **Validated Inputs**: All IPC calls validated in main process

## 🛡️ Privacy Implementation

### Tracker Blocking
```javascript
// Example tracker detection
const trackerDomains = [
  'doubleclick.net',
  'googleadservices.com',
  'googlesyndication.com',
  'facebook.com/tr',
  'google-analytics.com'
];
```

### Container Isolation
- **Cookie Isolation**: Separate cookie jars per container
- **Storage Isolation**: localStorage/sessionStorage per container
- **Visual Indicators**: Color-coded container badges

## 🚀 Performance Targets

- **Cold Start**: ≤500ms
- **Memory per Tab**: <150MB target
- **UI Responsiveness**: <100ms interactions
- **Build Size**: Minimized bundle with tree-shaking

## 🧪 Testing Strategy

### Manual Testing
1. Start application with `npm run dev`
2. Test tab creation and navigation
3. Verify container isolation
4. Check privacy dashboard functionality
5. Test omnibox commands

### Automated Testing (Future)
- Component unit tests with Vitest
- E2E tests with Playwright
- Privacy feature validation
- Performance benchmarking

## 📦 Build & Distribution

### Development Build
```bash
npm run dev  # Hot reload, dev tools enabled
```

### Production Build
```bash
npm run build      # Build Nuxt + prepare for packaging
npm run start      # Test production build
```

### Platform Packaging (Future)
```bash
npm run build:electron  # Create platform-specific packages
```

## 🔍 Debugging

### Electron DevTools
- **Main Process**: Use VS Code debugger or console.log
- **Renderer Process**: Chrome DevTools available in development

### Common Issues
- **Sandbox Errors**: Use `--no-sandbox` flag for development
- **CORS Issues**: Use local file serving for static content
- **IPC Errors**: Check preload.js context bridge exposure

## 🌟 Future Enhancements

### High Priority
- Enhanced tracker blocking with EasyList integration
- Real container process isolation
- Settings persistence
- Bookmark management

### Medium Priority
- WebExtensions API support
- Download manager
- Password manager integration
- Theme customization

### Low Priority
- Tor/VPN integration
- Cross-device sync
- Mobile companion app
- Developer tools integration