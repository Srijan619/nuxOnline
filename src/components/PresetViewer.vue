<script setup lang="ts">
import { ref, computed } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import EffectGroup from "./EffectGroup.vue";
import EffectChain from "./EffectChain.vue";
import PresetChange from "./PresetChange.vue";

const selectedPresetIndex = ref<number>(0);
const selectedPreset = computed(() => {
  return {
    ...nuxMidiController.getBasicPresetData(selectedPresetIndex.value),
    ...nuxMidiController.getDetailPresetData(selectedPresetIndex.value),
  };
});

const changePreset = (newPresetNumber: number) => {
  selectedPresetIndex.value = newPresetNumber;
};

const toggleEffect = (key: string) => {
  console.log("🤮 Support coming soon...");
};
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
      <PresetChange @change-preset="changePreset" />
    </div>

    <EffectChain
      :effects="selectedPreset.effects"
      :toggleEffect="toggleEffect"
    />
    <!-- <EffectGroup -->
    <!--   :effects="selectedPreset.effects" -->
    <!--   :toggleEffect="toggleEffect" -->
    <!-- /> -->
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
