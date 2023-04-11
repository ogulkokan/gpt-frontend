import { defineStore } from "pinia";
import { ref } from "vue";
import { Api } from "../boot/axios";

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
      console.log("selected model:", model);
      const payload = {
        content: message,
        model: model,
      };

      console.log("Request payload:", payload);
      this.receivedMessages.push({ isAi: false, value: message });

      const loadingMessageIndex = this.receivedMessages.length;
      const loadingMessage = { isAi: true, value: "Loading..." };
      this.receivedMessages.push(loadingMessage);

      // Save the conversation after adding the loading message
      this.saveReceivedMessagesToLocalStorage();

      try {
        console.log("selected model:", model);
        this.setLoading(true);
        const res = await Api.post("/api/ask", payload);
        const data = res.data;
        console.log("Response data:", data);
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
        // await this.$nextTick();

        // this.receivedMessages.splice(loadingMessageIndex, 1, answerMessage);
        // Save the conversation after adding the answer message
        this.saveReceivedMessagesToLocalStorage();
        return answer; // Add this line to return the answer
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
