import { defineStore } from "pinia";

export const useConversationStore = defineStore("conversation", {
  state: () => ({
    conversation: [],
    conversationCount: 1,
    conversations: JSON.parse(localStorage.getItem("conversations")) || [[]], // Load conversations from localStorage
    currentConversationIndex: 0,
  }),
  getters: {
    conversationCount() {
      return this.conversations.length;
    },
  },
  actions: {
    // addToConversation(message) {
    //   this.conversation.push(message);
    // },
    incrementConversationCount() {
      // Add this method
      this.conversationCount++;
    },
    clearConversation() {
      this.conversation = [];
    },
    deleteConversation(index) {
      this.conversations.splice(index, 1);
      this.saveConversationsToLocalStorage();

      // If deleted conversation is the current one, load the first conversation
      if (this.currentConversationIndex === index) {
        this.currentConversationIndex = 0;
      } else if (this.currentConversationIndex > index) {
        // If the deleted conversation is before the current one, decrease the index
        this.currentConversationIndex -= 1;
      }
    },
    saveConversationsToLocalStorage() {
      localStorage.setItem("conversations", JSON.stringify(this.conversations));
    },
    addToConversation({ isAi, value, isLoading = false }) {
      // Check if the conversations array is initialized for the current conversation index
      if (!this.conversations[this.currentConversationIndex]) {
        this.conversations[this.currentConversationIndex] = [];
      }

      this.conversations[this.currentConversationIndex].push({
        isAi,
        value,
        isLoading,
      });
      this.saveConversationsToLocalStorage();
    },

    updateAIResponse(response) {
      const currentConversation =
        this.conversations[this.currentConversationIndex];
      const lastMessage = currentConversation[currentConversation.length - 1];

      if (lastMessage.isAi && lastMessage.isLoading) {
        lastMessage.value = response;
        lastMessage.isLoading = false;
      }
    },

    startNewConversation() {
      this.conversations.push([]);
      this.currentConversationIndex = this.conversations.length - 1;
      this.saveConversationsToLocalStorage();
    },
    setCurrentConversationIndex(index) {
      this.currentConversationIndex = index;
    },
  },
});
