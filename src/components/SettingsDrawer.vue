<template>
  <div class="column">
    <div class="col">
      <q-btn flat align="left" class="full-width" label="Clear conversations" icon="delete"/>
    </div>
    <div class="col">
      <q-btn flat align="left" class="full-width" :label="themeModeLabel" :icon="themeModeIcon" @click="toggleThemeMode" />
    </div>
    <div class="col">
      <q-btn flat align="left" class="full-width" label="My Account" icon="person" />
    </div>
    <div class="col">
      <q-btn flat align="left" class="full-width" label="Get Help" icon="info_outline" />
    </div>
    <div class="col">
      <q-btn flat align="left" class="full-width" label="Log out" icon="logout" />
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isDarkMode = ref($q.dark.isActive)

const toggleThemeMode = () => {
  $q.dark.toggle()
  isDarkMode.value = $q.dark.isActive
}
const themeModeLabel = computed(() => (isDarkMode.value ? 'Light Mode' : 'Dark Mode'))
const themeModeIcon = computed(() => (isDarkMode.value ? 'light_mode' : 'dark_mode'))

</script>
