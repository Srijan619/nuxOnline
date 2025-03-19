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
    <slot></slot>
    <button
      class="preset-btn next"
      @click="changePreset('up')"
      :disabled="presetNumber >= MAX_PRESET"
    >
      Next <span class="icon">〉</span>
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
  background: var(--amp-border);
  border-radius: 50%;
  box-shadow:
    inset 0 0 3px rgba(0, 0, 0, 0.8),
    0 0 5px var(--retro-shadow);
  z-index: 2;
}

/* Output jack (right) */
.preset-change::after {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  top: 0.5rem;
  right: 0.5rem;
  position: absolute;
  background: var(--amp-border);
  border-radius: 50%;
  box-shadow:
    inset 0 0 3px rgba(0, 0, 0, 0.8),
    0 0 5px var(--retro-shadow);
  z-index: 2;
}

.preset-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.5rem;
  background: var(--amp-inner);
  border: 2px solid var(--amp-border);
  border-radius: 0.25rem;
  color: var(--retro-text-primary);
  font-size: 1rem;
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
  box-shadow: 0 0 8px var(--retro-glow);
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon {
  font-size: 1.1rem;
  transition: transform 300ms ease-in-out;
}

.preset-btn:hover:not(:disabled) .icon {
  transform: scale(1.2);
}
</style>
