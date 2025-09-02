<template>
  <div class="bg-slate-800 border-t border-slate-600 p-2 flex items-center justify-between text-sm">
    <!-- Left Side - Status Info -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-signal" class="w-4 h-4 text-green-400" />
        <span class="text-slate-300">Connected</span>
      </div>
      
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-green-400" />
        <span class="text-slate-300">Secure</span>
      </div>
    </div>
    
    <!-- Center - Privacy Stats -->
    <div class="flex items-center space-x-6">
      <button
        class="flex items-center space-x-1 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
        @click="$emit('toggle-privacy-panel')"
      >
        <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-green-400" />
        <span class="text-slate-300">{{ totalBlocked }} blocked</span>
      </button>
      
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-eye-slash" class="w-4 h-4 text-red-400" />
        <span class="text-slate-300">{{ privacyStats.blockedTrackers }} trackers</span>
      </div>
      
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-squares-plus" class="w-4 h-4 text-blue-400" />
        <span class="text-slate-300">{{ containerCount }} containers</span>
      </div>
    </div>
    
    <!-- Right Side - Additional Info -->
    <div class="flex items-center space-x-4">
      <div class="text-slate-400">
        Memory: {{ memoryUsage }}MB
      </div>
      
      <div class="text-slate-400">
        Aurora v0.1.0
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PrivacyStats {
  blockedTrackers: number
  blockedConnections: number
  blockedScripts: number
}

interface Props {
  privacyStats: PrivacyStats
}

const props = defineProps<Props>()

defineEmits<{
  'toggle-privacy-panel': []
}>()

const totalBlocked = computed(() => {
  return props.privacyStats.blockedTrackers + 
         props.privacyStats.blockedConnections + 
         props.privacyStats.blockedScripts
})

const containerCount = ref(3) // Simulated container count
const memoryUsage = ref(142) // Simulated memory usage

// Simulate memory usage updates
onMounted(() => {
  setInterval(() => {
    memoryUsage.value = Math.floor(120 + Math.random() * 50)
  }, 5000)
})
</script>