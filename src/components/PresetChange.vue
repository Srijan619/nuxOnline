<script setup lang="ts">
import { ref, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const presetNumber = ref(0);
const MIN_PRESET = 0;
const MAX_PRESET = 127;

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
    nuxMidiController.value.getCurrentPresetDetailData(newPresetNumber);
  }
});

watch(
  () => nuxMidiController.value,
  (newValue) => {
    if (newValue) {
      newValue.changePreset(presetNumber.value);
      newValue.getCurrentPresetDetailData(presetNumber.value);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="preset-change"
    :style="{
      '--amp-active': nuxMidiController ? 'var(--amp-on)' : 'var(--amp-off)',
    }"
  >
    <button
      class="preset-btn prev"
      @click="changePreset('down')"
      :disabled="presetNumber <= MIN_PRESET"
    >
      〈
    </button>
    <slot></slot>
    <button
      class="preset-btn next"
      @click="changePreset('up')"
      :disabled="presetNumber >= MAX_PRESET"
    >
      〉
    </button>
  </div>
</template>

<style scoped>
.preset-change {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 18rem;
  padding: 0.75rem 1rem;
  background: var(--amp-bg);
  border-radius: 0.25rem;
  border: 3px solid var(--amp-border);
  box-shadow:
    inset 0 0 5px var(--retro-shadow),
    0 0 10px var(--retro-shadow);
  position: relative;
  overflow: hidden;
}

/* Weathered metal texture */
.preset-change:before {
  position: absolute;
  content: "";
  inset: 0.125rem;
  border-radius: 0.125rem;
  background: var(--amp-inner);
  /* Weathered metal texture with scratches */
  background-image:
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.1) 25%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.1) 75%,
      rgba(0, 0, 0, 0.1)
    ),
    linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 25%,
      transparent 75%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05)
    );
  background-size: 8px 8px;
  z-index: 1;
}

/* Input jack (left) */
.preset-change:after {
  position: absolute;
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  top: 0.5rem;
  left: 0.5rem;
  background: var(--amp-active);
  border-radius: 50%;
  box-shadow:
    inset 0 0 3px rgba(0, 0, 0, 0.8),
    0 0 5px var(--retro-shadow);
  z-index: 2;
}

.preset-btn {
  background: transparent;
  color: var(--retro-text-primary);
  font-weight: bold;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  position: relative;
  z-index: 2;
}

.preset-btn:hover:not(:disabled) {
  background: var(--amp-accent);
  color: var(--retro-text-primary);
  transform: translateY(-2px);
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
