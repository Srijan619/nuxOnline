<script setup lang="ts">
import { nuxMidiController } from "../utils/NUXMidiController.ts";

// TODO: This needs further action like disable if nothing has actually changed..
const save = () => {
  if (nuxMidiController?.value?.saveCurrentPreset) {
    nuxMidiController.value.saveCurrentPreset();
  }
};
</script>

<template>
  <button class="save-button" @click="save">Save</button>
</template>

<style scoped>
.save-button {
  font-size: 1rem;
  font-weight: bold;
  background-color: var(--retro-card-bg);
  color: var(--retro-text-primary);
  padding: 10px 20px;
  border: 2px solid var(--retro-border);
  border-radius: 4px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.save-button:hover {
  background-color: var(--retro-card-inner);
  border-color: var(--hover-border-color);
  color: var(--hover-text-color);
  cursor: pointer;
}

.save-button:active {
  transform: scale(0.98);
  background-color: var(--retro-card-bg);
}
</style>
