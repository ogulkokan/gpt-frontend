import { defineStore } from "pinia";
import { parse } from "papaparse";

export const usePromptStore = defineStore("prompt", {
  state: () => ({
    results: [],
  }),
  actions: {
    setResults(results) {
      this.results = results;
    },
    async fetchAndParseCSV() {
      try {
        const response = await fetch("http://localhost:8000/prompts.csv");
        const csvText = await response.text();

        parse(csvText, {
          complete: (parsedResults) => {
            this.setResults(parsedResults.data);
          },
          error: (error) => {
            console.error("Error while parsing CSV:", error);
          },
        });
      } catch (error) {
        console.error("Error while fetching CSV:", error);
      }
    },
  },
});
