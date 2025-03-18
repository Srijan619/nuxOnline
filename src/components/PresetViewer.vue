<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import EffectGroup from "./EffectGroup.vue";
import EffectChain from "./EffectChain.vue";
import PresetChange from "./PresetChange.vue";

const selectedPreset = ref("No preset selected");

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
      console.log("Effects", selectedPreset.value?.effects);
    }
  },
);
</script>

<template>
  <div class="preset-container" v-if="selectedPreset">
    <div class="card">
      <h3>🎸 Selected Preset</h3>
      <div>
        <strong>Name:</strong> {{ selectedPreset.name || "Loading..." }}
      </div>
      <div>
        <strong>Preset Number:</strong> {{ selectedPreset.presetNumber }}
      </div>
      <div>
        <strong>Active Scene Number:</strong>
        {{ selectedPreset.activeSceneNumber }}
      </div>
      <PresetChange />
    </div>

    <EffectChain
      v-if="selectedPreset.effects"
      :effects="selectedPreset.effects"
    />
  </div>

  <div v-else class="loading">
    <p>Loading preset...</p>
  </div>
</template>

<style scoped>
.preset-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: auto;
}

.card {
  background: #222;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

h3 {
  margin-bottom: 8px;
}
</style>
