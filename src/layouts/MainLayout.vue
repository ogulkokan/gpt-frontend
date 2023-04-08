<template>
  <q-layout view="lHh lpR lFf">
    <q-header class="bg-grey-8 text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->
        <q-toolbar-title>
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"> -->
          </q-avatar>
          <!-- Title -->
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="drawer--left"
      style="display: flex; flex-direction: column; height: 100%"
    >
      <q-scroll-area style="flex: 0 0 79%; max-width: 300px">
        <q-list>
          <q-item-label header> Essential Links </q-item-label>

          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
      <q-separator />

      <SettingsDrawer style="flex: 0 0 20%" />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      {{ message }}
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
import EssentialLink from "components/EssentialLink.vue";
import SettingsDrawer from "components/SettingsDrawer.vue";
import { useQuasar } from "quasar";
import { useMessageStore } from "stores/message-store";
import { useCounterStore } from "stores/example-store";
const counterStore = useCounterStore();
const $q = useQuasar();

const footerClass = computed(() => {
  return $q.dark.isActive ? "footer--dark" : "footer--light";
});

const essentialLinks = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
];

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const message = ref("");
const inputMessage = ref("");

// const emitMessageSent = (message) => {
//   app.onMessageSent?.(message);
// };
// provide("emitMessageSent", emitMessageSent);

// const sendMessage = () => {
//   console.log("message sent: ", message.value);
//   app.emit("message-sent", message.value);
// };

const messageStore = useMessageStore();
function onMessageSent() {
  messageStore.setMessage(message.value);
  messageStore.sendMessage(message.value);
  message.value = "";
}
</script>
