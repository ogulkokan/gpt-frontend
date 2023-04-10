<template>
  <div>
    <q-list
      bordered
      separator
      v-for="(row, index) in promptStore.results"
      :key="index"
    >
      <q-item clickable v-ripple @click="showDialog(index)">
        <q-item-section>{{ row[0] }}</q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ selectedRow[0] }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ selectedRow[1] }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePromptStore } from "stores/prompStore";

const dialogVisible = ref(false);
const selectedRow = ref([]);
const promptStore = usePromptStore();

function showDialog(index) {
  selectedRow.value = promptStore.results[index];
  dialogVisible.value = true;
}

// Call fetchAndParseCSV from the promptStore instead of a local function
promptStore.fetchAndParseCSV();
</script>
