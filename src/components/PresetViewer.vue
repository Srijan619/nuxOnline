<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { MIDIMock, SysExRequest, Preset } from "../utils/mockMIDI.ts";
import EffectGroup from "./EffectGroup.vue";
import effectsMapping from "../utils/effects.ts";

const selectedPreset = ref<Preset | null>(null);
const midiMock = new MIDIMock((extractedData) => {
  if (!selectedPreset.value) {
    selectedPreset.value = { ...extractedData };
  } else {
    selectedPreset.value = { ...selectedPreset.value, ...extractedData };
  }
});

const sendMsg = async () => {
  // Fetch basic preset info (number + scene)
  midiMock.receiveMessage(SysExRequest.CURRENT_PRESET);
  midiMock.receiveMessage(SysExRequest.CURRENT_PRESET_DATA);
};

onMounted(() => {
  sendMsg();
});

const toggleEffect = (key: string) => {
  if (selectedPreset.value?.effects) {
    selectedPreset.value.effects[key] =
      selectedPreset.value.effects[key] === "On" ? "Off" : "On";
  }
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
    </div>

    <EffectGroup
      :effects="selectedPreset.effects"
      :toggleEffect="toggleEffect"
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
