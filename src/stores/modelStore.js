import { defineStore } from "pinia";
import { Api } from "../boot/axios";
// import { ref } from "vue";

export const useModelStore = defineStore("model", {
  state: () => ({
    models: ["gpt-4", "gpt-3.5-turbo"],
    selectedModel: "gpt-4",
    loading: false,
  }),
  actions: {
    setLoading(value) {
      this.loading = value;
    },
    async fetchModels() {
      try {
        this.setLoading(true);
        const res = await Api.get("/api/models");
        const data = res.data;
        this.models = data.data;
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        this.setLoading(false);
      }
    },
    setSelectedModel(model) {
      this.selectedModel = model;
    },
    getModelByName(modelName) {
      return this.models.find((model) => model.name === modelName);
    },
  },
  getters: {
    options() {
      return this.models;
    },
  },
});
