import { defineStore } from "pinia";
import { ref } from "vue";
import { Api } from "../boot/axios";

export const useMessageStore = defineStore("message", {
  state: () => ({
    message: "",
    receivedMessages: [],
    conversation: [],
  }),
  actions: {
    setMessage(value) {
      this.message = value;
    },
    addMessage(message) {
      this.conversation.push(message);
    },
    async sendMessage(message) {
      // console.log("message pinia store", message);
      this.receivedMessages.push({ isAi: false, value: message });
      const loadingMessage = { isAi: true, value: "Loading..." };
      this.receivedMessages.push(loadingMessage);

      try {
        const res = await Api.post("/api/ask", { content: message });
        const data = res.data;
        const answer = data.bot.trim();
        const answerMessage = { isAi: true, value: answer };
        this.receivedMessages.pop();
        this.receivedMessages.push(answerMessage);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
