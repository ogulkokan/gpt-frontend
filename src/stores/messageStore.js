import { defineStore } from "pinia";
import { ref } from "vue";
import { Api } from "../boot/axios";
import { useModelSettingsStore } from "./modelSettingsStore";

export const useMessageStore = defineStore("message", {
  state: () => ({
    message: "",
    receivedMessages:
      JSON.parse(localStorage.getItem("receivedMessages")) || [],
    conversation: [],
    loading: false,
  }),
  actions: {
    setMessage(value) {
      this.message = value;
    },
    addMessage(message) {
      this.conversation.push(message);
    },
    setLoading(value) {
      this.loading = value;
    },
    saveReceivedMessagesToLocalStorage() {
      localStorage.setItem(
        "receivedMessages",
        JSON.stringify(this.receivedMessages)
      );
    },
    async sendMessage(message, model) {
      const modelSettingsStore = useModelSettingsStore();
      const settings = modelSettingsStore.settings;

      const payload = {
        content: message,
        model: model,
        maxTokens: Number(settings.maxTokens),
        temperature: parseFloat(settings.temperature),
        topP: settings.topP,
        frequencyPenalty: parseFloat(settings.frequencyPenalty),
        presencePenalty: parseFloat(settings.presencePenalty),
      };

      this.receivedMessages.push({ isAi: false, value: message });

      const loadingMessageIndex = this.receivedMessages.length;
      const loadingMessage = { isAi: true, value: "Loading..." };
      this.receivedMessages.push(loadingMessage);

      this.saveReceivedMessagesToLocalStorage();

      try {
        this.setLoading(true);
        console.log("Sending message payload last one!!!!!!:", payload);
        const res = await Api.post("/api/ask", payload);
        const data = res.data;
        // console.log("Response data:", res);
        const answer = data.bot.trim();
        const answerMessage = { isAi: true, value: answer };
        // Create a new array with the updated answer message using the spread operator
        const updatedReceivedMessages = [
          ...this.receivedMessages.slice(0, loadingMessageIndex),
          answerMessage,
          ...this.receivedMessages.slice(loadingMessageIndex + 1),
        ];
        // Assign the updated array to receivedMessages to trigger reactivity
        this.receivedMessages = updatedReceivedMessages;

        this.saveReceivedMessagesToLocalStorage();
        return answer;
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
