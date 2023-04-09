import { defineStore } from "pinia";

export const useConversationStore = defineStore("conversation", {
  state: () => ({
    conversation: [],
    conversationCount: 1,
    conversations: [[]],
    currentConversationIndex: 0,
  }),
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
    // addToConversation(message, index) {
    //   this.conversations[index].push(message);
    // },
    addToConversation({ isAi, value }) {
      // Check if the conversations array is initialized for the current conversation index
      if (!this.conversations[this.currentConversationIndex]) {
        this.conversations[this.currentConversationIndex] = [];
      }

      this.conversations[this.currentConversationIndex].push({
        isAi,
        value,
      });
    },
    startNewConversation() {
      this.conversations.push([]);
      this.conversationCount += 1;
      this.currentConversationIndex = this.conversationCount - 1;
    },
    setCurrentConversationIndex(index) {
      this.currentConversationIndex = index;
    },
  },
});
