<template>
  <q-layout view="lHh lpR lFr">
    <q-header>
      <q-banner
        inline-actions
        class="text-white"
        style="background-color: #40414f"
      >
        <div class="row justify-center">
          <q-select
            standout
            dense
            v-model="selectedModel"
            :options="options"
            label="Selected Model:"
            class="q-px-md"
            bg-color="grey-7"
            color="orange"
            style="width: 250px"
            @update:model-value="updateSelectedModel"
          />
        </div>
        <template v-slot:action>
          <q-btn
            class="align-right"
            dense
            flat
            round
            icon="menu"
            @click="toggleRightDrawer"
          />
        </template>
      </q-banner>
    </q-header>

    <!-- left drawer content -->
    <q-drawer v-model="leftDrawerOpen" show-if-above class="drawer--left">
      <q-scroll-area style="height: 80vh; max-width: 300px">
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
      <SettingsComponent style="height: 19vh; max-width: 300px" />
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
            <ModelSettingsComponent />
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
            @keyup.enter="sendMessageWithSelectedModel"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click="sendMessageWithSelectedModel"
              />
            </template>
          </q-input>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import SettingsComponent from "components/SettingsComponent.vue";
import PromptComponent from "src/components/PromptComponent.vue";
import ConversationComponent from "src/components/ConversationComponent.vue";
import ModelSettingsComponent from "src/components/ModelSettingsComponent.vue";
import { useQuasar } from "quasar";
import { useMessageStore } from "src/stores/messageStore";
import { useConversationStore } from "stores/conversationStore";
import { useModelStore } from "stores/modelStore";
import { useModelSettingsStore } from "stores/modelSettingsStore";

const $q = useQuasar();

const modelStore = useModelStore();
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const modelSettingsStore = useModelSettingsStore();

const options = computed(() => modelStore.models);
const selectedModel = ref(options.value[0]);

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);
const message = ref("");
const loading = ref(false);

async function updateSelectedModel(model) {
  console.log("selected model: ", model);
  selectedModel.value = model;
  modelStore.setSelectedModel(model);
}

const footerClass = computed(() => {
  return $q.dark.isActive ? "footer--dark" : "footer--light";
});

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

async function onMessageSent(model) {
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

  // Pass the correct model parameter to sendMessage function
  const response = await messageStore.sendMessage(messageStore.message, model);

  // Update the AI response and remove the loading state
  conversationStore.updateAIResponse(response);
  messageStore.setMessage("");
  loading.value = false;
  // console.log(
  //   conversationStore.conversations[conversationStore.currentConversationIndex]
  // );
}

const conversationIndices = computed(() => {
  return Array.from(
    { length: conversationStore.totalConversations },
    (_, i) => i
  );
});

function startNewChat() {
  conversationStore.startNewConversation();
}

async function sendMessageWithSelectedModel() {
  if (selectedModel.value) {
    await onMessageSent(selectedModel.value);
  } else {
    console.error("Selected model is undefined.");
  }
}
</script>
