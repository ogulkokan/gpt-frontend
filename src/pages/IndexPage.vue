<template>
  <q-page>
    <!-- <div>answer: {{ lastAiMessage }}</div> -->
    <div class="q-pa-md">
      <chat-component :received-messages="receivedMessages" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import ChatComponent from "/src/components/ChatComponent.vue";
import { useMessageStore } from "stores/message-store";
import { storeToRefs } from "pinia";

const messageStore = useMessageStore();
const { message, receivedMessages } = storeToRefs(messageStore);

const lastAiMessage = computed(() => {
  const lastMessage = receivedMessages.value.slice(-1)[0];
  return lastMessage?.isAi ? lastMessage.value : "";
});
</script>
