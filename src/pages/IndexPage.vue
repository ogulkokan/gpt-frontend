<template>
  <q-page>
    <div class="row justify-center">
      <ChatComponent :received-messages="receivedMessages" :loading="loading" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import ChatComponent from "/src/components/ChatComponent.vue";
import { useMessageStore } from "src/stores/messageStore";
import { storeToRefs } from "pinia";
import { useConversationStore } from "stores/conversationStore";

const messageStore = useMessageStore();
const conversationStore = useConversationStore();

const { message, loading } = storeToRefs(messageStore);

const currentConversation = computed(() => {
  return conversationStore.conversations[
    conversationStore.currentConversationIndex
  ];
});

const receivedMessages = computed(() => {
  const conversation =
    conversationStore.conversations[conversationStore.currentConversationIndex];
  return conversation ? conversation : [];
});
</script>
