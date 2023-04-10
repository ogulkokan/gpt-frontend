<template>
  <q-layout view="lHh lpR lFf">
    <q-header class="text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->
        <q-toolbar-title>
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" /> -->
          </q-avatar>
          <!-- Title -->
        </q-toolbar-title>
        <div class="text-center q-px-xl">Model: Default (GPT-3.5)</div>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="drawer--left"
      style="display: flex; flex-direction: column; height: 100%"
    >
      <q-scroll-area style="flex: 0 0 79%">
        <q-list>
          <!-- <q-item-label header> Essential Links </q-item-label> -->
          <div class="column">
            <div class="col q-pa-sm">
              <q-btn
                outline
                align="left"
                class="full-width"
                label="New Chat"
                icon="add"
                @click="startNewChat"
              />
            </div>
            <div
              class="col q-pa-sm"
              v-for="index in conversationIndices"
              :key="index"
            >
              <q-btn
                outline
                align="left"
                class="full-width"
                :label="'Conversation ' + (index + 1)"
                @click="loadConversation(index)"
              />
            </div>
          </div>
        </q-list>
      </q-scroll-area>
      <q-separator />

      <SettingsDrawer style="flex: 0 0 20%" />
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      class="drawer--left"
    >
      <!-- drawer content -->
      <div style="max-width: 350px">
        <q-list>
          <q-expansion-item
            group="somegroup"
            icon="explore"
            label="Prompt Store"
            default-opened
            header-class="bg-blue-grey-10 text-white"
          >
            <PromptComponent />
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="settings"
            label="Model Settings"
            header-class="bg-blue-grey-10 text-white"
          >
            <q-card class="text-black">
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-separator />
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer :class="footerClass" class="text-white q-pa-md">
      <q-toolbar class="row justify-center">
        <div class="col-6">
          <q-input
            dark
            outlined
            color="white"
            bg-color="blue-grey-7"
            v-model="message"
            placeholder="Send a message..."
            @keyup.enter="onMessageSent"
          >
            <template v-slot:append>
              <q-btn round dense flat icon="send" @click="onMessageSent" />
            </template>
          </q-input>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import SettingsDrawer from "components/SettingsDrawer.vue";
import PromptComponent from "src/components/PromptComponent.vue";
import { useQuasar } from "quasar";
import { useMessageStore } from "stores/message-store";
import { useConversationStore } from "stores/conversationStore";
const conversationStore = useConversationStore();
const $q = useQuasar();

const footerClass = computed(() => {
  return $q.dark.isActive ? "footer--dark" : "footer--light";
});

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const message = ref("");
const inputMessage = ref("");

const messageStore = useMessageStore();

async function onMessageSent() {
  messageStore.setMessage(message.value);
  message.value = "";
  await messageStore.sendMessage(messageStore.message);
  conversationStore.addToConversation(
    { isAi: false, value: messageStore.message },
    conversationStore.currentConversationIndex
  );
  conversationStore.addToConversation(
    {
      isAi: true,
      value:
        messageStore.receivedMessages[messageStore.receivedMessages.length - 1]
          .value,
    },
    conversationStore.currentConversationIndex
  );
  messageStore.setMessage("");
  console.log(conversationStore.conversation);
}

function loadConversation(index) {
  console.log("clicked conversation", index);
  conversationStore.setCurrentConversationIndex(index);
  // Logic to load the conversation based on the index
}
const conversationIndices = computed(() => {
  return Array.from(
    { length: conversationStore.conversationCount },
    (_, i) => i
  );
});
function startNewChat() {
  conversationStore.startNewConversation();
}
</script>
