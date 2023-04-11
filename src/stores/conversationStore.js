import { defineStore } from "pinia";

export const useConversationStore = defineStore("conversation", {
  state: () => ({
    conversation: [],
    conversationCount: 1,
    conversations: JSON.parse(localStorage.getItem("conversations")) || [[]], // Load conversations from localStorage
    currentConversationIndex: 0,
  }),
  getters: {
    totalConversations() {
      return this.conversations.length;
    },
  },
  actions: {
    incrementConversationCount() {
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

      // Create a new array with the new message
      const updatedConversation = [
        ...this.conversations[this.currentConversationIndex],
        { isAi, value, isLoading },
      ];

      // Update the conversations array using the spread operator
      this.conversations = [
        ...this.conversations.slice(0, this.currentConversationIndex),
        updatedConversation,
        ...this.conversations.slice(this.currentConversationIndex + 1),
      ];

      this.saveConversationsToLocalStorage();
    },
    updateAIResponse(response) {
      const currentConversation =
        this.conversations[this.currentConversationIndex];
      const lastMessageIndex = currentConversation.length - 1;
      const lastMessage = currentConversation[lastMessageIndex];

      if (lastMessage.isAi && lastMessage.isLoading) {
        // Create a new message object with the updated values
        const updatedMessage = {
          ...lastMessage,
          value: response,
          isLoading: false,
        };

        // Create a new array with the updated message
        const updatedConversation = [
          ...currentConversation.slice(0, lastMessageIndex),
          updatedMessage,
          ...currentConversation.slice(lastMessageIndex + 1),
        ];

        // Update the conversations array using the spread operator
        this.conversations = [
          ...this.conversations.slice(0, this.currentConversationIndex),
          updatedConversation,
          ...this.conversations.slice(this.currentConversationIndex + 1),
        ];

        this.saveConversationsToLocalStorage();
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
    clearAllConversations() {
      this.conversations = [[]];
      this.currentConversationIndex = 0;
      this.saveConversationsToLocalStorage();
    },
  },
});
