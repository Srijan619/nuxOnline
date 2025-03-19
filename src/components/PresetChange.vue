<script setup lang="ts">
import { ref, defineEmits, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const MAX_PRESET = 127;
const MIN_PRESET = 0;

const presetNumber = ref(0);

const emit = defineEmits<{
  (e: "change-preset", newPresetNumber: number): void;
}>();

const changePreset = (direction: "up" | "down") => {
  if (direction === "up") {
    presetNumber.value = Math.min(presetNumber.value + 1, MAX_PRESET);
  } else {
    presetNumber.value = Math.max(presetNumber.value - 1, MIN_PRESET);
  }
  emit("change-preset", presetNumber.value);
};

watch(presetNumber, (newPresetNumber) => {
  if (nuxMidiController.value) {
    nuxMidiController.value.changePreset(newPresetNumber);
    nuxMidiController.value.getDetailPresetData(newPresetNumber);
  }
});

watch(
  () => nuxMidiController.value,
  (newValue) => {
    if (newValue) {
      newValue.changePreset(presetNumber.value);
      newValue.getDetailPresetData(presetNumber.value);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="preset-change">
    <button
      class="preset-btn prev"
      @click="changePreset('down')"
      :disabled="presetNumber <= MIN_PRESET"
    >
      <span class="icon">〈</span> Prev
    </button>
    <div class="preset-indicator">Preset: {{ presetNumber }}</div>
    <button
      class="preset-btn next"
      @click="changePreset('up')"
      :disabled="presetNumber >= MAX_PRESET"
    >
      Next <span class="icon">&#9002</span>
    </button>
  </div>
</template>

<style scoped>
.preset-change {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 18rem; /* Match PresetDetail width */
  padding: 0.5rem 1rem;
  background: linear-gradient(
    135deg,
    #1a0b2e,
    #2d1b4e
  ); /* Match PresetDetail */
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.preset-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: rgba(26, 11, 46, 0.9);
  border: none;
  border-radius: 0.5rem;
  color: #ff6b6b; /* Match PresetDetail --color */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  position: relative;
  z-index: 2;
}

.preset-btn:hover:not(:disabled) {
  background: #ff6b6b;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon {
  font-size: 1.1rem;
}

.preset-btn:hover:not(:disabled) .icon {
  transform: scale(1.2);
}

.preset-indicator {
  color: #e0dede; 
  font-size: 0.9rem;
  text-align: center;
  z-index: 2;
}

.preset-change:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.6875rem;
  background: rgba(26, 11, 46, 0.95);
  z-index: 1;
}


</style>
