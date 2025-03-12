<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MIDIMock, SysExRequest, Preset } from "../utils/mockMIDI.ts";

const selectedPreset = ref<Preset | null>(null);
const midiMock = new MIDIMock((msg, extractedData) => {
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
</script>

<template>
  <div v-if="selectedPreset">
    <h3>Selected Preset</h3>
    <div><strong>Name:</strong> {{ selectedPreset.name || "Loading..." }}</div>
    <div><strong>Preset Number:</strong> {{ selectedPreset.presetNumber }}</div>
    <div>
      <strong>Active Scene Number:</strong>
      {{ selectedPreset.activeSceneNumber }}
    </div>
  </div>
  <div v-else>
    <p>Loading preset...</p>
  </div>
</template>

<style scoped>
div {
  margin-bottom: 10px;
}
</style>
