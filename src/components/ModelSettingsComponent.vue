<template>
  <div>
    <q-form @submit.prevent="submit">
      <q-input
        outlined
        v-model="settings.maxTokens"
        label="Max Tokens"
        type="number"
        color="white"
        label-color="white"
      />
      <q-input
        outlined
        v-model="settings.temperature"
        label="Temperature"
        type="number"
        color="white"
        label-color="white"
      />
      <q-input
        outlined
        v-model="settings.topP"
        label="Top P"
        type="number"
        color="white"
        label-color="white"
      />
      <q-input
        outlined
        v-model="settings.frequencyPenalty"
        label="Frequency Penalty"
        type="number"
        color="white"
        label-color="white"
      />
      <q-input
        outlined
        v-model="settings.presencePenalty"
        label="Presence Penalty"
        type="number"
        color="white"
        label-color="white"
      />

      <q-btn label="Update Settings" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useModelSettingsStore } from "../stores/modelSettingsStore";

const emit = defineEmits(["update-settings"]);

const settings = ref({
  maxTokens: null,
  temperature: null,
  topP: null,
  frequencyPenalty: null,
  presencePenalty: null,
});

const modelSettingsStore = useModelSettingsStore();

const submit = () => {
  console.log("updating settings: ", settings.value);
  modelSettingsStore.updateSettings(settings.value);
  emit("update-settings", settings.value);
};
</script>
