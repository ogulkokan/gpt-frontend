<template>
  <q-layout view="lHh lpR lFr">
    <q-header class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar> </q-avatar> -->
        </q-toolbar-title>
        <div class="text-center q-px-xl">Model: Default (GPT-3.5)</div>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
    <!-- left drawer content -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="drawer--left"
      style="display: flex; flex-direction: column; height: 100%"
    >
      <q-scroll-area style="flex: 0 0 79%">
        <q-list>
          <div class="column">
            <div class="col q-pa-sm">
              <q-btn
                outline
                align="left"
                class="full-width"
                label="New Chat"
                icon="add"
                :disable="loading"
                @click="startNewChat"
              />
            </div>
            <ConversationComponent
              v-for="index in conversationIndices"
              :key="index"
              :index="index"
              :loading="loading"
            />
          </div>
        </q-list>
      </q-scroll-area>
      <q-separator />

      <SettingsDrawer style="flex: 0 0 20%" />
    </q-drawer>

    <!-- right drawer content -->
    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      class="drawer--left"
    >
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

          <!-- <q-separator /> -->

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
import ConversationComponent from "src/components/ConversationComponent.vue";
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
const loading = ref(false);

const messageStore = useMessageStore();

async function onMessageSent() {
  messageStore.setMessage(message.value);

  // Show the user message immediately
  conversationStore.addToConversation({
    isAi: false,
    value: messageStore.message,
  });

  // Show the AI loading message immediately
  conversationStore.addToConversation({
    isAi: true,
    value: "Loading...",
    isLoading: true,
  });

  message.value = "";
  loading.value = true;

  const response = await messageStore.sendMessage(messageStore.message);

  // Update the AI response and remove the loading state
  conversationStore.updateAIResponse(response);
  messageStore.setMessage("");
  loading.value = false;
  console.log(
    conversationStore.conversations[conversationStore.currentConversationIndex]
  );
}

function deleteConversation(index) {
  conversationStore.deleteConversation(index);
}

function loadConversation(index) {
  conversationStore.saveConversationsToLocalStorage();
  conversationStore.setCurrentConversationIndex(index);
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
