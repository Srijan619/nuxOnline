<script setup lang="ts">
import { ref, watch } from "vue";
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();

const activeSceneNumber = ref(state.currentPresetData?.activeSceneNumber || 0);

watch(
  () => state.currentPresetData?.activeSceneNumber,
  (newValue) => {
    if (newValue !== undefined) {
      activeSceneNumber.value = newValue;
    }
  },
);

const setScene = (scene: number) => {
  activeSceneNumber.value = scene;
};
</script>

<template>
  <div class="scene-container">
    <button
      v-for="scene in 3"
      :key="scene"
      class="scene-button"
      :class="{ active: activeSceneNumber === scene - 1 }"
      @click="setScene(scene - 1)"
    >
      S{{ scene }}
    </button>
  </div>
</template>

<style scoped>
.scene-container {
  display: flex;
}

.scene-button {
  font-size: 0.6rem;
  font-weight: bold;
  cursor: pointer;
  background: var(--retro-amp-bg);
  transition: all 0.2s ease-in-out;
  border-radius: 0.1rem;
}

.scene-button.active {
  background: var(--amp-secondary-border);
  color: white;
}

.scene-button:hover {
  background: #e0e0e0;
}
</style>
