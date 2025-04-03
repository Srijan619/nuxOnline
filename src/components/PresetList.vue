<template>
  <div v-if="state.presets.length && !state.isFetchingPresets">
    <ul class="preset-list">
      <li
        v-for="(preset, index) in state.presets"
        :key="preset.presetNumber"
        class="preset-item"
        @click="selectPreset(preset)"
        tabindex="0"
        ref="presetItems"
      >
        <button
          class="preset-button"
          :class="{
            active:
              state.currentPresetData?.presetNumber === preset?.presetNumber,
          }"
        >
          <span class="preset-number">{{ preset.formattedPresetNumber }}</span>
          <span class="preset-name">{{ preset.name }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";
import type { Nux } from "../types";

const { state, changePreset } = useNUXMidiController();

//TODO: Reuse EffectListDropdown as it has exactly same logic...make it a reusable component
// Create a ref for preset items
const presetItems = ref<HTMLElement[]>([]);

const selectPreset = (preset: Nux.Preset) => {
  changePreset(preset.presetNumber);
};

// Watch for changes in the selected preset and scroll to it
watch(
  () => state.currentPresetData?.presetNumber,
  (newPresetNumber) => {
    if (newPresetNumber !== undefined) {
      nextTick(() => {
        const selectedPresetIndex = state.presets.findIndex(
          (preset) => preset.presetNumber === newPresetNumber,
        );
        const selectedPresetElement = presetItems.value[selectedPresetIndex];

        if (selectedPresetElement) {
          selectedPresetElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest", // Scroll the nearest edge into view
          });
        }
      });
    }
  },
);
</script>

<style scoped>
/* Apply the variables defined in :root */

.preset-list {
  list-style-type: none;
  padding: 0;
  margin: 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: none;
  max-height: 95vh;
  overflow-y: auto;
  border-right: 1px solid #313131;
  padding-right: 3rem;
  width: max-content;
}

.preset-item {
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease;
  color: var(--retro-text-primary);
}

.preset-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  padding: 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.preset-button > *:hover,
.preset-button.active > * {
  color: var(--hover-border-color, #ff6347);
}

.preset-number {
  color: #888;
  font-weight: 600;
  margin-right: 0.5rem;
  font-size: small;
}
.preset-name {
  color: var(--retro-text-primary);
}
</style>
