<template>
  <q-scroll-area class="scroll-area q-pa-md">
    <div
      v-for="(chat, i) in receivedMessages"
      :key="i"
      :class="messageClass(chat)"
    >
      <q-avatar v-if="chat.isAi" class="avatar">
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
      <div class="message-content">
        <template v-if="chat.isAi">
          <div v-if="!loading || i !== receivedMessages.length - 1">
            {{ chat.value }}
          </div>
          <q-spinner-hourglass
            v-if="loading && i === receivedMessages.length - 1 && chat.isAi"
            color="primary"
            size="2em"
          />
        </template>
        <template v-else>
          {{ chat.value }}
        </template>
      </div>
      <q-avatar v-if="!chat.isAi" class="avatar">
        <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
      </q-avatar>
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
  loading: {
    type: Boolean,
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
  height: 75vw;
  max-height: 85vh;
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

.avatar {
  margin: 5px;
}
</style>
