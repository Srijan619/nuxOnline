<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import EffectGroup from "./EffectGroup.vue";
import EffectChain from "./EffectChain.vue";
import PresetChange from "./PresetChange.vue";
import PresetDetail from "./PresetDetail.vue";
import { PresetMockResponse } from "../mocks/mockNuxResponse.ts";

const selectedPreset = ref("No preset selected");

//TODO: Only for testing use mock

selectedPreset.value = PresetMockResponse;
watch(
  () => nuxMidiController.value?.currentPresetBasicData,
  (newVal) => {
    if (newVal) {
      selectedPreset.value = newVal;
    }
  },
);

watch(
  () => nuxMidiController.value?.currentPresetDetailData,
  (newVal) => {
    if (newVal) {
      selectedPreset.value = { ...selectedPreset.value, ...newVal };
      console.log("Selected preset", selectedPreset.value);
    }
  },
);

//TODO: Add back && nuxMidiController to template
</script>

<template>
  <div class="main-container" v-if="selectedPreset">
    <div class="preset-card">
      <PresetDetail :selectedPreset="selectedPreset" />
      <PresetChange />
    </div>
    <EffectChain
      v-if="selectedPreset.effects"
      :effects="selectedPreset.effects"
    />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: auto;
}

.preset-card {
  position: relative;
  width: 20rem; /* Slightly wider to accommodate both components */
  background: linear-gradient(135deg, #1a0b2e, #2d1b4e); /* Musical gradient */
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
