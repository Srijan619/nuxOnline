<script setup lang="ts">
import { ref, defineEmits } from "vue";

const presetNumber = ref(0);
const emit = defineEmits(["change-preset"]);

const changePreset = (direction: "up" | "down") => {
  if (direction === "up") {
    presetNumber.value = Math.min(presetNumber.value + 1, 127);
  } else {
    presetNumber.value = Math.max(presetNumber.value - 1, 0);
  }
  emit("change-preset", presetNumber.value);
};
</script>

<template>
  <div class="preset-change">
    <button @click="changePreset('down')">⬅ Prev</button>
    <button @click="changePreset('up')">Next ➡</button>
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
