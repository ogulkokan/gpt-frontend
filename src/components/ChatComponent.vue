<template>
  <q-scroll-area class="scroll-area q-pa-md">
    <div
      v-for="(chat, i) in receivedMessages"
      :key="i"
      :class="messageClass(chat)"
    >
      <div class="message-content">{{ chat.value }}</div>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { ref, watchEffect } from "vue";

defineProps({
  receivedMessages: {
    type: Array,
    required: true,
  },
});

const messageClass = (chat) => {
  return {
    "message-right": !chat.isAi,
    "message-left": chat.isAi,
  };
};
</script>
<style lang="scss" scoped>
.scroll-area {
  height: 55vw;
  width: 100%;
}

.message-right {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}

.message-left {
  display: flex !important;
}

.message-content {
  max-width: 70%;
  border-radius: 4px;
  padding: 10px;
  margin: 5px;
  background-color: #eee;
  color: #333;
}
</style>
