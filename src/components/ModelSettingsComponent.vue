<template>
  <div>
    <q-form @submit.prevent="submit">
      <div class="column q-gutter-sm q-px-lg q-py-md">
        <q-banner rounded class="bg-blue-grey-7 text-white">
          <div class="row">
            <div class="q-mt-md">
              Max Tokens
              <q-tooltip
                anchor="center left"
                class="bg-deep-orange-10 text-body2"
                :offset="[180, 10]"
              >
                <div class="column" style="max-width: 300px">
                  The maximum number of tokens to generate in the completion.
                  The token count of your prompt plus max_tokens cannot exceed
                  the model's context length. Most models have a context length
                  of 2048 tokens (except for the newest models, which support
                  4096).
                </div>
              </q-tooltip>
            </div>
            <q-space />
            <q-input
              outlined
              v-model.number="settings.maxTokens"
              dense
              style="max-width: 100px"
              lazy-rules
              :rules="[
                (val) => val <= maxTokens || `Maximum value is ${maxTokens}`,
              ]"
            />
            <q-slider
              v-model="settings.maxTokens"
              :min="0"
              :max="maxTokens"
              :step="1"
              color="orange"
              class="text-white"
            />
          </div>
        </q-banner>
        <q-banner rounded class="bg-blue-grey-7 text-white">
          <div class="row">
            <div class="column">
              Temperature
              <q-tooltip
                anchor="center left"
                class="bg-deep-orange-10 text-body2"
                :offset="[180, 10]"
              >
                <div class="column" style="max-width: 300px">
                  What sampling temperature to use, between 0 and 2. Higher
                  values like 0.8 will make the output more random, while lower
                  values like 0.2 will make it more focused and deterministic.
                  We generally recommend altering this or top_p but not both.
                </div>
              </q-tooltip>
            </div>
            <q-space /> {{ settings.temperature }}
          </div>
          <template v-slot:action>
            <q-slider
              v-model="settings.temperature"
              :min="0"
              :max="2"
              :step="0.01"
              color="orange"
              class="text-white"
            />
          </template>
        </q-banner>

        <q-banner rounded class="bg-blue-grey-7 text-white">
          <div class="row">
            <div class="column">
              Top P
              <q-tooltip
                anchor="center left"
                class="bg-deep-orange-10 text-body2"
                :offset="[180, 10]"
              >
                <div class="column" style="max-width: 300px">
                  An alternative to sampling with temperature, called nucleus
                  sampling, where the model considers the results of the tokens
                  with top_p probability mass. So 0.1 means only the tokens
                  comprising the top 10% probability mass are considered. We
                  generally recommend altering this or temperature but not both.
                </div>
              </q-tooltip>
            </div>
            <q-space /> {{ settings.topP }}
          </div>
          <template v-slot:action>
            <q-slider
              v-model="settings.topP"
              :min="0"
              :max="1"
              :step="0.01"
              color="orange"
              class="text-white"
            />
          </template>
        </q-banner>

        <q-banner rounded class="bg-blue-grey-7 text-white">
          <div class="row">
            <div class="column">
              Frequency penalty
              <q-tooltip
                anchor="center left"
                class="bg-deep-orange-10 text-body2"
                :offset="[180, 10]"
              >
                <div class="column" style="max-width: 300px">
                  Number between -2.0 and 2.0. Positive values penalize new
                  tokens based on their existing frequency in the text so far,
                  decreasing the model's likelihood to repeat the same line
                  verbatim.
                </div>
              </q-tooltip>
            </div>
            <q-space /> {{ settings.frequencyPenalty }}
          </div>
          <template v-slot:action>
            <q-slider
              v-model="settings.frequencyPenalty"
              :min="0"
              :max="1"
              :step="0.01"
              color="orange"
              class="text-white"
            />
          </template>
        </q-banner>

        <q-banner rounded class="bg-blue-grey-7 text-white">
          <div class="row">
            <div class="column">
              Presence penalty
              <q-tooltip
                anchor="center left"
                class="bg-deep-orange-10 text-body2"
                :offset="[180, 10]"
              >
                <div class="column" style="max-width: 300px">
                  Number between -2.0 and 2.0. Positive values penalize new
                  tokens based on whether they appear in the text so far,
                  increasing the model's likelihood to talk about new topics.
                </div>
              </q-tooltip>
            </div>
            <q-space /> {{ settings.presencePenalty }}
          </div>
          <template v-slot:action>
            <q-slider
              v-model="settings.presencePenalty"
              :min="-2"
              :max="2"
              :step="0.01"
              color="orange"
              class="text-white"
            />
          </template>
        </q-banner>
      </div>
      <div class="row justify-center">
        <q-btn label="Update Settings" type="submit" color="blue-grey-7" />
      </div>
    </q-form>
    <div class="row justify-center q-py-md">
      <q-btn
        label="Default Settings"
        color="blue-grey-7"
        @click="restoreDefaultSettings"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useModelSettingsStore } from "../stores/modelSettingsStore";
import { useModelStore } from "../stores/modelStore";

const emit = defineEmits(["update-settings"]);

const modelSettingsStore = useModelSettingsStore();
const modelStore = useModelStore();

const settings = ref({ ...modelSettingsStore.settings });

const maxTokens = computed(() => {
  if (modelStore.selectedModel === "gpt-4") {
    return 4096;
  } else {
    return 2048;
  }
});

watch(maxTokens, (newValue) => {
  if (settings.value.maxTokens > newValue) {
    settings.value.maxTokens = newValue;
  }
});

const submit = () => {
  modelSettingsStore.updateSettings(settings.value);
  emit("update-settings", settings.value);
};

const restoreDefaultSettings = () => {
  modelSettingsStore.resetSettings();
  settings.value = { ...modelSettingsStore.settings };
  emit("update-settings", settings.value);
};
</script>
