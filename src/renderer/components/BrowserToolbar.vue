<template>
  <div class="bg-slate-800 p-3 flex items-center space-x-3">
    <!-- Navigation Controls -->
    <div class="flex items-center space-x-1">
      <UButton 
        icon="i-heroicons-arrow-left" 
        variant="ghost" 
        size="sm"
        :disabled="!canGoBack"
        @click="goBack"
      />
      <UButton 
        icon="i-heroicons-arrow-right" 
        variant="ghost" 
        size="sm"
        :disabled="!canGoForward"
        @click="goForward"
      />
      <UButton 
        icon="i-heroicons-arrow-path" 
        variant="ghost" 
        size="sm"
        @click="reload"
      />
    </div>

    <!-- Omnibox -->
    <div class="flex-1 relative">
      <UInput
        ref="omniboxInput"
        v-model="urlInput"
        placeholder="Search or enter URL... (try :new container-name for quick commands)"
        class="w-full"
        size="lg"
        @keyup.enter="handleOmniboxSubmit"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
      >
        <template #leading>
          <UIcon 
            :name="getSecurityIcon()" 
            :class="getSecurityIconClass()"
          />
        </template>
      </UInput>
      
      <!-- Command Suggestions -->
      <div 
        v-if="showSuggestions && commandSuggestions.length > 0"
        class="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
      >
        <div
          v-for="(suggestion, index) in commandSuggestions"
          :key="index"
          class="px-4 py-2 hover:bg-slate-600 cursor-pointer flex items-center space-x-2"
          @click="applySuggestion(suggestion)"
        >
          <UIcon :name="suggestion.icon" class="w-4 h-4" />
          <div>
            <div class="font-medium">{{ suggestion.command }}</div>
            <div class="text-sm text-slate-400">{{ suggestion.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Toggle -->
    <UButton 
      icon="i-heroicons-shield-check" 
      variant="ghost" 
      size="sm"
      :class="{ 'text-green-400': privacyMode }"
      @click="togglePrivacyMode"
    />

    <!-- Settings -->
    <UButton 
      icon="i-heroicons-cog-6-tooth" 
      variant="ghost" 
      size="sm"
      @click="openSettings"
    />
  </div>
</template>

<script setup lang="ts">
interface CommandSuggestion {
  command: string
  description: string
  icon: string
  action: () => void
}

const emit = defineEmits<{
  navigate: [url: string]
}>()

const urlInput = ref('')
const showSuggestions = ref(false)
const privacyMode = ref(true)
const canGoBack = ref(false)
const canGoForward = ref(false)
const omniboxInput = ref()

const commandSuggestions = computed<CommandSuggestion[]>(() => {
  if (!urlInput.value.startsWith(':')) return []
  
  const commands: CommandSuggestion[] = [
    {
      command: ':new container-name',
      description: 'Create new container tab',
      icon: 'i-heroicons-plus-circle',
      action: () => handleNewContainer()
    },
    {
      command: ':privacy',
      description: 'Open privacy dashboard',
      icon: 'i-heroicons-shield-check',
      action: () => openPrivacyDashboard()
    },
    {
      command: ':settings',
      description: 'Open settings',
      icon: 'i-heroicons-cog-6-tooth',
      action: () => openSettings()
    },
    {
      command: ':focus',
      description: 'Enable focus mode',
      icon: 'i-heroicons-eye-slash',
      action: () => enableFocusMode()
    }
  ]
  
  return commands.filter(cmd => 
    cmd.command.toLowerCase().includes(urlInput.value.toLowerCase())
  )
})

function handleOmniboxSubmit() {
  if (urlInput.value.startsWith(':')) {
    // Handle commands
    const matchingSuggestion = commandSuggestions.value.find(s => 
      s.command.startsWith(urlInput.value)
    )
    if (matchingSuggestion) {
      matchingSuggestion.action()
    }
  } else {
    // Handle URL navigation
    let url = urlInput.value.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url
      } else {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`
      }
    }
    emit('navigate', url)
  }
  hideSuggestions()
}

function applySuggestion(suggestion: CommandSuggestion) {
  suggestion.action()
  urlInput.value = ''
  hideSuggestions()
}

function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

function getSecurityIcon() {
  if (urlInput.value.startsWith('https://')) {
    return 'i-heroicons-lock-closed'
  } else if (urlInput.value.startsWith('http://')) {
    return 'i-heroicons-exclamation-triangle'
  }
  return 'i-heroicons-magnifying-glass'
}

function getSecurityIconClass() {
  if (urlInput.value.startsWith('https://')) {
    return 'text-green-400'
  } else if (urlInput.value.startsWith('http://')) {
    return 'text-yellow-400'
  }
  return 'text-slate-400'
}

// Navigation functions
function goBack() {
  console.log('[Aurora] Navigate back')
}

function goForward() {
  console.log('[Aurora] Navigate forward')
}

function reload() {
  console.log('[Aurora] Reload page')
}

function togglePrivacyMode() {
  privacyMode.value = !privacyMode.value
  console.log('[Aurora] Privacy mode:', privacyMode.value)
}

// Command handlers
function handleNewContainer() {
  const containerName = urlInput.value.replace(':new ', '') || 'new-container'
  console.log('[Aurora] Creating new container:', containerName)
}

function openPrivacyDashboard() {
  console.log('[Aurora] Opening privacy dashboard')
}

function openSettings() {
  console.log('[Aurora] Opening settings')
}

function enableFocusMode() {
  console.log('[Aurora] Enabling focus mode')
}
</script>