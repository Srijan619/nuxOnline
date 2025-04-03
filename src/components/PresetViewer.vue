<script setup lang="ts">
import EffectChain from "./EffectChain.vue";
import KnobContainer from "./KnobContainer.vue";
import EffectsGrid from "./EffectsGrid.vue";
import PresetContainer from "./PresetContainer.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();
</script>

<template>
  <div class="main-container">
    <PresetContainer />
    <EffectChain />
    <KnobContainer />
    <EffectsGrid />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 99%;
  overflow-x: hidden;
  padding: 1rem;
}
</style>
