<template>
  <div class="flex-1 bg-slate-900 p-4">
    <!-- URL Display -->
    <div class="bg-slate-800 p-3 rounded-lg mb-4">
      <div class="flex items-center space-x-2">
        <UIcon 
          :name="getSecurityIcon()"
          :class="getSecurityIconClass()"
        />
        <span class="text-sm text-slate-300">{{ tab.url }}</span>
        <UBadge 
          v-if="tab.container !== 'default'"
          :color="getContainerBadgeColor(tab.container)"
          size="xs"
        >
          {{ tab.container }}
        </UBadge>
      </div>
    </div>
    
    <!-- Content Area -->
    <div class="bg-white rounded-lg overflow-hidden" style="height: calc(100vh - 200px);">
      <!-- Loading State -->
      <div 
        v-if="tab.status === 'loading'"
        class="flex items-center justify-center h-full bg-slate-100"
      >
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p class="text-slate-600">Loading {{ getDisplayUrl(tab.url) }}...</p>
        </div>
      </div>
      
      <!-- Simulated Web Content -->
      <div v-else class="h-full">
        <!-- For PoC, we'll show a simulated webpage -->
        <iframe
          v-if="isValidUrl(tab.url)"
          :src="getSafeUrl(tab.url)"
          class="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-navigation"
          @load="handlePageLoad"
        />
        
        <!-- New Tab Page -->
        <div 
          v-else-if="tab.url.includes('new-tab')"
          class="h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"
        >
          <div class="text-center text-slate-800">
            <h1 class="text-4xl font-bold mb-4">Aurora Browser</h1>
            <p class="text-xl mb-8">Ultra-lightweight, Privacy-first browsing</p>
            
            <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <UCard
                class="cursor-pointer hover:shadow-lg transition-shadow"
                @click="navigateToUrl('https://duckduckgo.com')"
              >
                <div class="text-center">
                  <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p class="font-medium">Search</p>
                </div>
              </UCard>
              
              <UCard
                class="cursor-pointer hover:shadow-lg transition-shadow"
                @click="openPrivacyDashboard"
              >
                <div class="text-center">
                  <UIcon name="i-heroicons-shield-check" class="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p class="font-medium">Privacy</p>
                </div>
              </UCard>
              
              <UCard
                class="cursor-pointer hover:shadow-lg transition-shadow"
                @click="navigateToUrl('https://github.com')"
              >
                <div class="text-center">
                  <UIcon name="i-heroicons-code-bracket" class="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p class="font-medium">GitHub</p>
                </div>
              </UCard>
              
              <UCard
                class="cursor-pointer hover:shadow-lg transition-shadow"
                @click="navigateToUrl('https://news.ycombinator.com')"
              >
                <div class="text-center">
                  <UIcon name="i-heroicons-newspaper" class="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p class="font-medium">News</p>
                </div>
              </UCard>
            </div>
          </div>
        </div>
        
        <!-- Error Page -->
        <div 
          v-else
          class="h-full bg-red-50 flex items-center justify-center"
        >
          <div class="text-center text-red-800">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 class="text-2xl font-bold mb-2">Page Load Error</h2>
            <p class="mb-4">Could not load: {{ tab.url }}</p>
            <UButton @click="reloadPage" color="red">Try Again</UButton>
          </div>
        </div>
      </div>
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

interface Props {
  tab: Tab
}

defineProps<Props>()

const emit = defineEmits<{
  'url-change': [url: string]
}>()

function getSecurityIcon() {
  const { tab } = defineProps<Props>()
  if (tab.url.startsWith('https://')) {
    return 'i-heroicons-lock-closed'
  } else if (tab.url.startsWith('http://')) {
    return 'i-heroicons-exclamation-triangle'
  }
  return 'i-heroicons-globe-alt'
}

function getSecurityIconClass() {
  const { tab } = defineProps<Props>()
  if (tab.url.startsWith('https://')) {
    return 'text-green-500'
  } else if (tab.url.startsWith('http://')) {
    return 'text-yellow-500'
  }
  return 'text-slate-500'
}

function getContainerBadgeColor(container: string) {
  const colors: Record<string, string> = {
    work: 'blue',
    personal: 'green',
    shopping: 'orange',
    social: 'purple'
  }
  return colors[container] || 'gray'
}

function getDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return url.startsWith('http://') || url.startsWith('https://')
  } catch {
    return false
  }
}

function getSafeUrl(url: string): string {
  // For PoC, we'll allow certain safe URLs
  const safeHosts = [
    'duckduckgo.com',
    'github.com',
    'news.ycombinator.com',
    'example.com'
  ]
  
  try {
    const urlObj = new URL(url)
    if (safeHosts.some(host => urlObj.hostname.includes(host))) {
      return url
    }
  } catch {}
  
  // Fallback to a safe demo page
  return 'data:text/html,<html><body style="font-family: sans-serif; padding: 20px; background: #f5f5f5;"><h1>Aurora Browser Demo</h1><p>This is a simulated webpage for demonstration purposes.</p><p>URL: ' + encodeURIComponent(url) + '</p></body></html>'
}

function navigateToUrl(url: string) {
  emit('url-change', url)
}

function openPrivacyDashboard() {
  console.log('[Aurora] Opening privacy dashboard')
}

function reloadPage() {
  console.log('[Aurora] Reloading page')
}

function handlePageLoad() {
  console.log('[Aurora] Page loaded')
}
</script>