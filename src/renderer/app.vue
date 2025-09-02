<template>
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <!-- Title Bar -->
    <div class="h-8 bg-slate-800 flex items-center justify-between px-4 text-xs">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div class="text-slate-400">Aurora Browser v0.1.0</div>
    </div>

    <!-- Main Browser Interface -->
    <div class="flex flex-col h-[calc(100vh-2rem)]">
      <!-- Toolbar -->
      <BrowserToolbar @navigate="handleNavigate" />
      
      <!-- Tab Bar -->
      <BrowserTabs 
        :tabs="tabs" 
        :activeTab="activeTab"
        @tab-select="selectTab"
        @tab-close="closeTab"
        @tab-new="newTab"
      />
      
      <!-- Content Area -->
      <div class="flex-1 flex">
        <!-- Main Content -->
        <div class="flex-1 bg-slate-800 m-2 rounded-lg overflow-hidden">
          <BrowserContent 
            v-if="activeTab"
            :tab="activeTab"
            @url-change="handleUrlChange"
          />
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <h2 class="text-2xl font-semibold mb-2">Welcome to Aurora Browser</h2>
              <p class="text-slate-400 mb-4">Ultra-lightweight, Privacy-first browsing</p>
              <UButton @click="newTab" size="lg">Open New Tab</UButton>
            </div>
          </div>
        </div>
        
        <!-- Privacy Panel (toggleable) -->
        <PrivacyPanel 
          v-if="showPrivacyPanel" 
          @close="showPrivacyPanel = false"
        />
      </div>
      
      <!-- Status Bar -->
      <BrowserStatusBar 
        :privacy-stats="privacyStats"
        @toggle-privacy-panel="showPrivacyPanel = !showPrivacyPanel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: number
  url: string
  title: string
  container: string
  status: string
}

interface PrivacyStats {
  blockedTrackers: number
  blockedConnections: number
  blockedScripts: number
}

// Reactive state
const tabs = ref<Tab[]>([])
const activeTab = ref<Tab | null>(null)
const showPrivacyPanel = ref(false)
const privacyStats = ref<PrivacyStats>({
  blockedTrackers: 0,
  blockedConnections: 0,
  blockedScripts: 0
})

// Initialize with a default tab
onMounted(async () => {
  await newTab()
  await loadPrivacyStats()
})

// Tab management
async function newTab() {
  if (window.aurora) {
    const result = await window.aurora.tabs.open('https://aurora-browser.local/new-tab', 'default')
    if (result.status === 'success') {
      await loadTabs()
    }
  }
}

async function closeTab(tabId: number) {
  if (window.aurora) {
    await window.aurora.tabs.close(tabId)
    await loadTabs()
  }
}

async function selectTab(tab: Tab) {
  activeTab.value = tab
}

async function loadTabs() {
  if (window.aurora) {
    tabs.value = await window.aurora.tabs.list()
    if (tabs.value.length > 0 && !activeTab.value) {
      activeTab.value = tabs.value[0]
    } else if (tabs.value.length === 0) {
      activeTab.value = null
    }
  }
}

// Navigation
async function handleNavigate(url: string) {
  if (activeTab.value && window.aurora) {
    await window.aurora.tabs.navigate(activeTab.value.id, url)
    await loadTabs()
  }
}

async function handleUrlChange(url: string) {
  if (activeTab.value) {
    activeTab.value.url = url
  }
}

// Privacy stats
async function loadPrivacyStats() {
  if (window.aurora) {
    privacyStats.value = await window.aurora.privacy.getStats()
  }
}

// Refresh privacy stats every 5 seconds
setInterval(loadPrivacyStats, 5000)
</script>