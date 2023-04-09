<template>
  <q-page>
    <div class="row justify-center">
      <chat-component
        :received-messages="receivedMessages"
        :loading="loading"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import ChatComponent from "/src/components/ChatComponent.vue";
import { useMessageStore } from "stores/message-store";
import { storeToRefs } from "pinia";
import { useConversationStore } from "stores/conversationStore";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

const { message, loading } = storeToRefs(messageStore); // Remove receivedMessages from here

const currentConversation = computed(() => {
  return conversationStore.conversations[
    conversationStore.currentConversationIndex
  ];
});

const receivedMessages = computed(() => {
  return conversationStore.conversations[
    conversationStore.currentConversationIndex
  ];
});
</script>
