import { defineStore } from "pinia";

export const useModelSettingsStore = defineStore("modelSettings", {
  state: () => ({
    settings: {
      maxTokens: null,
      temperature: null,
      topP: null,
      frequencyPenalty: null,
      presencePenalty: null,
    },
  }),
  actions: {
    updateSettings(newSettings) {
      this.settings = newSettings;
    },
  },
});
