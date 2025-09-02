<template>
  <div class="w-80 bg-slate-800 border-l border-slate-600 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-slate-600 flex items-center justify-between">
      <h2 class="text-lg font-semibold flex items-center">
        <UIcon name="i-heroicons-shield-check" class="w-5 h-5 mr-2 text-green-400" />
        Privacy Dashboard
      </h2>
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        size="sm"
        @click="$emit('close')"
      />
    </div>
    
    <!-- Privacy Stats -->
    <div class="p-4 space-y-4">
      <div class="bg-slate-700 rounded-lg p-4">
        <h3 class="font-medium mb-3">Blocked Today</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-eye-slash" class="w-4 h-4 mr-2 text-red-400" />
              <span class="text-sm">Trackers</span>
            </div>
            <span class="font-bold text-red-400">{{ privacyStats.blockedTrackers }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-no-symbol" class="w-4 h-4 mr-2 text-yellow-400" />
              <span class="text-sm">Ads</span>
            </div>
            <span class="font-bold text-yellow-400">{{ privacyStats.blockedAds }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-code-bracket" class="w-4 h-4 mr-2 text-blue-400" />
              <span class="text-sm">Scripts</span>
            </div>
            <span class="font-bold text-blue-400">{{ privacyStats.blockedScripts }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <UIcon name="i-heroicons-wifi" class="w-4 h-4 mr-2 text-purple-400" />
              <span class="text-sm">Connections</span>
            </div>
            <span class="font-bold text-purple-400">{{ privacyStats.blockedConnections }}</span>
          </div>
        </div>
      </div>
      
      <!-- Privacy Level -->
      <div class="bg-slate-700 rounded-lg p-4">
        <h3 class="font-medium mb-3">Privacy Level</h3>
        <USelectMenu
          v-model="privacyLevel"
          :options="privacyLevels"
          @change="handlePrivacyLevelChange"
        />
        <p class="text-sm text-slate-400 mt-2">{{ getPrivacyLevelDescription() }}</p>
      </div>
      
      <!-- Container Isolation -->
      <div class="bg-slate-700 rounded-lg p-4">
        <h3 class="font-medium mb-3">Container Isolation</h3>
        <div class="space-y-2">
          <div 
            v-for="container in activeContainers"
            :key="container.name"
            class="flex items-center justify-between p-2 bg-slate-600 rounded"
          >
            <div class="flex items-center">
              <div 
                class="w-3 h-3 rounded-full mr-2"
                :class="container.color"
              />
              <span class="text-sm">{{ container.name }}</span>
            </div>
            <span class="text-xs text-slate-400">{{ container.tabs }} tabs</span>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="bg-slate-700 rounded-lg p-4">
        <h3 class="font-medium mb-3">Quick Actions</h3>
        <div class="space-y-2">
          <UButton
            block
            variant="ghost"
            size="sm"
            @click="clearCookies"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
            Clear Cookies
          </UButton>
          
          <UButton
            block
            variant="ghost"
            size="sm"
            @click="clearCache"
          >
            <UIcon name="i-heroicons-archive-box-x-mark" class="w-4 h-4 mr-2" />
            Clear Cache
          </UButton>
          
          <UButton
            block
            variant="ghost"
            size="sm"
            @click="enablePrivateMode"
          >
            <UIcon name="i-heroicons-eye-slash" class="w-4 h-4 mr-2" />
            Private Mode
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PrivacyStats {
  blockedTrackers: number
  blockedAds: number
  blockedScripts: number
  blockedConnections: number
}

interface Container {
  name: string
  color: string
  tabs: number
}

defineEmits<{
  close: []
}>()

// Sample data for PoC
const privacyStats = ref<PrivacyStats>({
  blockedTrackers: 47,
  blockedAds: 23,
  blockedScripts: 12,
  blockedConnections: 89
})

const privacyLevel = ref('balanced')

const privacyLevels = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Strict', value: 'strict' },
  { label: 'Maximum', value: 'maximum' }
]

const activeContainers = ref<Container[]>([
  { name: 'default', color: 'bg-slate-400', tabs: 3 },
  { name: 'work', color: 'bg-blue-400', tabs: 2 },
  { name: 'personal', color: 'bg-green-400', tabs: 1 }
])

function getPrivacyLevelDescription() {
  const descriptions: Record<string, string> = {
    minimal: 'Basic protection with minimal site breakage',
    balanced: 'Good protection with occasional site issues',
    strict: 'Strong protection, some sites may break',
    maximum: 'Maximum protection, many sites will break'
  }
  return descriptions[privacyLevel.value] || ''
}

function handlePrivacyLevelChange() {
  console.log('[Aurora] Privacy level changed to:', privacyLevel.value)
}

function clearCookies() {
  console.log('[Aurora] Clearing cookies')
}

function clearCache() {
  console.log('[Aurora] Clearing cache')
}

function enablePrivateMode() {
  console.log('[Aurora] Enabling private mode')
}

// Update stats periodically (simulated for PoC)
onMounted(() => {
  setInterval(() => {
    privacyStats.value.blockedTrackers += Math.floor(Math.random() * 3)
    privacyStats.value.blockedAds += Math.floor(Math.random() * 2)
    privacyStats.value.blockedScripts += Math.floor(Math.random() * 1)
    privacyStats.value.blockedConnections += Math.floor(Math.random() * 5)
  }, 10000)
})
</script>