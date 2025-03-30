<script setup lang="ts">
// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();
</script>

<template>
  <div class="scene-container">
    <div class="scene">{{ JSON.stringify(state.currentPresetData.scene) }}</div>
  </div>
</template>

<style scoped>
.scene-container {
  display: flex;
}
</style>
