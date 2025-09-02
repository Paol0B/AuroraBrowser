<template>
  <div class="bg-slate-800 border-b border-slate-600">
    <div class="flex items-center">
      <!-- Tab List -->
      <div class="flex-1 flex items-center overflow-x-auto">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="aurora-tab group flex items-center min-w-[200px] max-w-[250px] px-3 py-2 border-r border-slate-600 cursor-pointer"
          :class="{
            'bg-slate-700': tab.id === activeTab?.id,
            'hover:bg-slate-700': tab.id !== activeTab?.id
          }"
          @click="$emit('tab-select', tab)"
        >
          <!-- Tab Icon -->
          <div class="w-4 h-4 mr-2 flex-shrink-0">
            <UIcon 
              v-if="tab.status === 'loading'"
              name="i-heroicons-arrow-path"
              class="animate-spin text-blue-400"
            />
            <UIcon 
              v-else-if="tab.url.startsWith('https://')"
              name="i-heroicons-lock-closed"
              class="text-green-400"
            />
            <UIcon 
              v-else
              name="i-heroicons-globe-alt"
              class="text-slate-400"
            />
          </div>
          
          <!-- Tab Title -->
          <div class="flex-1 truncate text-sm">
            {{ tab.title || getDisplayUrl(tab.url) }}
          </div>
          
          <!-- Container Indicator -->
          <div 
            v-if="tab.container !== 'default'"
            class="w-2 h-2 rounded-full ml-2 flex-shrink-0"
            :class="getContainerColor(tab.container)"
          />
          
          <!-- Close Button -->
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            size="2xs"
            class="ml-2 opacity-0 group-hover:opacity-100 hover:bg-slate-600"
            @click.stop="$emit('tab-close', tab.id)"
          />
        </div>
        
        <!-- New Tab Button -->
        <UButton
          icon="i-heroicons-plus"
          variant="ghost"
          size="sm"
          class="ml-2 flex-shrink-0"
          @click="$emit('tab-new')"
        />
      </div>
      
      <!-- Tab Actions -->
      <div class="flex items-center space-x-1 px-2">
        <UDropdown
          :items="containerMenuItems"
          placement="bottom-end"
        >
          <UButton
            icon="i-heroicons-squares-plus"
            variant="ghost"
            size="sm"
            title="New Container Tab"
          />
        </UDropdown>
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
  tabs: Tab[]
  activeTab: Tab | null
}

defineProps<Props>()

defineEmits<{
  'tab-select': [tab: Tab]
  'tab-close': [tabId: number]
  'tab-new': []
}>()

const containerMenuItems = [
  [{
    label: 'Default',
    icon: 'i-heroicons-globe-alt',
    click: () => createContainerTab('default')
  }],
  [{
    label: 'Work',
    icon: 'i-heroicons-briefcase',
    click: () => createContainerTab('work')
  }, {
    label: 'Personal',
    icon: 'i-heroicons-user',
    click: () => createContainerTab('personal')
  }, {
    label: 'Shopping',
    icon: 'i-heroicons-shopping-cart',
    click: () => createContainerTab('shopping')
  }, {
    label: 'Social',
    icon: 'i-heroicons-chat-bubble-left-right',
    click: () => createContainerTab('social')
  }],
  [{
    label: 'Create Custom Container',
    icon: 'i-heroicons-plus-circle',
    click: () => createCustomContainer()
  }]
]

function getDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url.length > 30 ? url.substring(0, 30) + '...' : url
  }
}

function getContainerColor(container: string): string {
  const colors: Record<string, string> = {
    work: 'bg-blue-400',
    personal: 'bg-green-400',
    shopping: 'bg-orange-400',
    social: 'bg-purple-400',
    default: 'bg-slate-400'
  }
  return colors[container] || 'bg-slate-400'
}

async function createContainerTab(container: string) {
  if (window.aurora) {
    await window.aurora.tabs.open('about:blank', container)
  }
}

function createCustomContainer() {
  const name = prompt('Enter container name:')
  if (name) {
    createContainerTab(name.toLowerCase().replace(/\s+/g, '-'))
  }
}
</script>

<style scoped>
.aurora-tab {
  /* Group class applied in template */
}

.aurora-tab:hover .opacity-0 {
  opacity: 1;
}
</style>