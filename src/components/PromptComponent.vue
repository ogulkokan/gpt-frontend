<template>
  <div>
    <q-list bordered separator v-for="(row, index) in results" :key="index">
      <q-item clickable v-ripple @click="showDialog(index)">
        <q-item-section>{{ row[0] }}</q-item-section>
        <!-- <q-item-section caption>{{ row[1] }}</q-item-section> -->
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
import { parse } from "papaparse";

const results = ref([]);
const dialogVisible = ref(false);
const selectedRow = ref([]);

function showDialog(index) {
  selectedRow.value = results.value[index];
  dialogVisible.value = true;
}

async function fetchAndParseCSV() {
  try {
    const response = await fetch("http://localhost:8000/prompts.csv");
    const csvText = await response.text();

    parse(csvText, {
      complete: (parsedResults) => {
        results.value = parsedResults.data;
      },
      error: (error) => {
        console.error("Error while parsing CSV:", error);
      },
    });
  } catch (error) {
    console.error("Error while fetching CSV:", error);
  }
}

fetchAndParseCSV();
</script>
