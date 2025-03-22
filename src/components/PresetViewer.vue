<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import EffectChain from "./EffectChain.vue";
import PresetChange from "./PresetChange.vue";
import PresetDetail from "./PresetDetail.vue";
import Device from "./Device.vue";
import KnobContainer from "./KnobContainer.vue";

const selectedPreset = ref("No preset selected");

//TODO: Only for testing use mock
//selectedPreset.value = PresetMockResponse;

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

const sliderValue = ref(0);

const updateValue = (controlPane: number, value: number) => {
  if (!nuxMidiController.value) return;
  if (!value) return;

  sliderValue.value = value;

  nuxMidiController.value.midiOutput.send([176, controlPane, value]);
};
</script>

<template>
  <div class="main-container" v-if="selectedPreset">
    <div class="preset-card">
      <PresetDetail :selectedPreset="selectedPreset" />
      <PresetChange>
        <Device />
      </PresetChange>
    </div>
    <EffectChain v-if="selectedPreset.effects" :effects="selectedPreset.effects" />
    <KnobContainer :updateValue="updateValue" />
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
  width: 20rem;
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
