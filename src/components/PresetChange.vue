<script setup lang="ts">
import { ref, defineEmits } from "vue";
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

  nuxMidiController.value.changePreset(presetNumber.value);
  emit("change-preset", presetNumber.value);
};
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
