<template>
  <div class="col q-pt-xs">
    <q-banner
      no-wrap
      inline-actions
      rounded
      class="text-white cursor-pointer"
      :class="{
        'bg-grey-8': isSelected,
        'bg-grey-10': !isSelected,
      }"
      :disable="loading"
      @click="!loading && loadConversation(index)"
    >
      <div class="row q-gutter-x-sm items-center">
        <q-icon name="chat" style="font-size: 1.7em" />
        <span class="text-bold text-body1">
          {{ "Conversation " + (index + 1) }}
        </span>
        <q-space />
        <q-btn
          v-if="isSelected"
          dense
          flat
          round
          icon="delete"
          :disable="loading"
          @click="deleteConversation(index)"
        />
      </div>
    </q-banner>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useConversationStore } from "stores/conversationStore";

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const conversationStore = useConversationStore();

const isSelected = computed(
  () => conversationStore.currentConversationIndex === props.index
);

const loadConversation = () => {
  conversationStore.setCurrentConversationIndex(props.index);
};

const deleteConversation = (index) => {
  conversationStore.deleteConversation(index);
};
</script>
