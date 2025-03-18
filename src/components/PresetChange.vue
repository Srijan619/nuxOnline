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

// Watch for changes to `presetNumber` and call changePreset
watch(presetNumber, (newPresetNumber) => {
  if (nuxMidiController.value) {
    nuxMidiController.value.changePreset(newPresetNumber);
    nuxMidiController.value.getDetailPresetData(newPresetNumber);
  }
});

// Watch for the first time when `nuxMidiController.value` is not undefined
watch(
  () => nuxMidiController.value,
  (newValue) => {
    if (newValue) {
      newValue.changePreset(presetNumber.value);
      newValue.getDetailPresetData(presetNumber.value);
    }
  },
  { immediate: true }, // Trigger immediately when `nuxMidiController` becomes available
);
</script>

<template>
  <div class="preset-change">
    <button
      @click="changePreset('down')"
      :disabled="presetNumber <= MIN_PRESET"
    >
      ⬅ Prev
    </button>
    <button @click="changePreset('up')" :disabled="presetNumber >= MAX_PRESET">
      Next ➡
    </button>
  </div>
</template>

<style scoped>
.preset-change {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}
</style>
