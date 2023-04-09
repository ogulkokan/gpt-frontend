import { defineStore } from "pinia";
import { ref } from "vue";
import { Api } from "../boot/axios";

export const useMessageStore = defineStore("message", {
  state: () => ({
    message: "",
    receivedMessages: [],
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
    async sendMessage(message) {
      this.receivedMessages.push({ isAi: false, value: message });

      const loadingMessageIndex = this.receivedMessages.length;
      const loadingMessage = { isAi: true, value: "Loading..." };
      this.receivedMessages.push(loadingMessage);

      try {
        this.setLoading(true);
        const res = await Api.post("/api/ask", { content: message });
        const data = res.data;
        const answer = data.bot.trim();
        const answerMessage = { isAi: true, value: answer };
        this.receivedMessages.splice(loadingMessageIndex, 1, answerMessage);
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
