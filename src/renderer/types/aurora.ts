// Global types for Aurora Browser

export interface Tab {
  id: number
  url: string
  title: string
  container: string
  status: 'loading' | 'ready' | 'error'
}

export interface PrivacyStats {
  blockedTrackers: number
  blockedConnections: number
  blockedScripts: number
  blockedAds?: number
}

export interface Container {
  name: string
  color: string
  tabs: number
}

export interface AuroraAPI {
  tabs: {
    open: (url: string, container?: string) => Promise<{ tabId: number; status: string }>
    close: (tabId: number) => Promise<{ status: string }>
    navigate: (tabId: number, url: string) => Promise<{ status: string }>
    list: () => Promise<Tab[]>
  }
  privacy: {
    getStats: () => Promise<PrivacyStats>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
  }
}

declare global {
  interface Window {
    aurora?: AuroraAPI
  }
}