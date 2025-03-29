<script setup lang="ts">
import EffectChain from "./EffectChain.vue";
import PresetChange from "./PresetChange.vue";
import PresetDetail from "./PresetDetail.vue";
import Device from "./Device.vue";
import KnobContainer from "./KnobContainer.vue";
import Save from "./Save.vue";
import EffectsGrid from "./EffectsGrid.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();
</script>

<template>
  <div class="main-container">
    <div class="preset-card">
      <PresetDetail />
      <!-- <Save /> -->
      <PresetChange>
        <Device />
      </PresetChange>
    </div>
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
  margin: 1rem;
  max-width: 99%;
  overflow-x: hidden;
}

.preset-card {
  position: relative;
  width: 20rem;
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
