<template>
  <div v-if="state.presets.length && !state.isFetchingPresets">
    <ul class="preset-list">
      <li
        v-for="preset in state.presets"
        :key="preset.presetNumber"
        class="preset-item"
        :class="{ active: selectedPreset === preset }"
        @click="selectPreset(preset)"
        tabindex="0"
      >
        <button class="preset-button">
          {{ preset.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";
import type { Nux } from "../types";

const { state } = useNUXMidiController();

const selectedPreset = ref(state.presets[0]);

const selectPreset = (preset: Nux.Preset) => {
  selectedPreset.value = preset;
};
</script>

<style scoped>
/* Apply the variables defined in :root */

.preset-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: none;
}

.preset-item {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease;
  padding: 10px 20px;
  color: var(--retro-text-primary);
  border-radius: 0.25rem;
  border: 1px solid var(--amp-secondary-border);
}

.preset-item:hover {
  border-color: var(--hover-border-color, #ff6347);
  transform: translateY(-2px);
}

.preset-item.active {
  background-color: var(--retro-glow);
  color: var(--retro-text-primary);
  box-shadow: 0 0 10px var(--retro-glow);
  transform: scale(1.05);
}

.preset-item:focus {
  outline: none;
  background-color: var(--retro-glow);
  color: var(--retro-text-primary);
  box-shadow: 0 0 15px var(--retro-glow);
}

.preset-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  font-family: inherit;
  padding: 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

/* Additional Styling */
.preset-list {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
