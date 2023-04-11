<template>
  <div class="column">
    <div class="col">
      <q-btn
        flat
        align="left"
        class="full-width"
        label="Clear conversations"
        icon="delete"
        @click="showDeleteDialog"
      />
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm"
              >Are you sure you want to delete all conversations?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Delete All"
              color="primary"
              @click="clearAllConversations"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="col">
      <q-btn
        flat
        align="left"
        class="full-width"
        :label="themeModeLabel"
        :icon="themeModeIcon"
        @click="toggleThemeMode"
      />
    </div>
    <div class="col">
      <q-btn
        flat
        align="left"
        class="full-width"
        label="My Account"
        icon="person"
      />
    </div>
    <div class="col">
      <q-btn
        flat
        align="left"
        class="full-width"
        label="Get Help"
        icon="info_outline"
      />
    </div>
    <div class="col">
      <q-btn
        flat
        align="left"
        class="full-width"
        label="Log out"
        icon="logout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useConversationStore } from "stores/conversationStore";

const $q = useQuasar();
const confirm = ref(false);

const isDarkMode = ref($q.dark.isActive);

const conversationStore = useConversationStore();

function clearAllConversations() {
  conversationStore.clearAllConversations();
}

function showDeleteDialog() {
  confirm.value = true;
}

const toggleThemeMode = () => {
  $q.dark.toggle();
  isDarkMode.value = $q.dark.isActive;
};
const themeModeLabel = computed(() =>
  isDarkMode.value ? "Light Mode" : "Dark Mode"
);
const themeModeIcon = computed(() =>
  isDarkMode.value ? "light_mode" : "dark_mode"
);
</script>
