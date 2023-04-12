import { defineStore } from "pinia";

const defaultSettings = {
  maxTokens: 2048,
  temperature: 1.0,
  topP: 1.0,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
};

const getSettingsFromLocalStorage = () => {
  const storedSettings = localStorage.getItem("settings");
  if (storedSettings) {
    return JSON.parse(storedSettings);
  }
  return defaultSettings;
};

const saveSettingsToLocalStorage = (settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};

export const useModelSettingsStore = defineStore("modelSettings", {
  state: () => ({
    settings: { ...getSettingsFromLocalStorage() },
  }),
  actions: {
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      saveSettingsToLocalStorage(this.settings);
    },
    resetSettings() {
      this.settings = { ...defaultSettings };
      saveSettingsToLocalStorage(this.settings);
    },
  },
});
