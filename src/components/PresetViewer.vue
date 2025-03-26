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

// TODO: Why is this here...it should be in KnobContainer
const updateValue = (controlPane: number, value: number) => {
  // if (!nuxMidiController.value) return;
  // if (value == null) return;
  //
  // sliderValue.value = value;
  //
  // nuxMidiController.value.midiOutput.send([176, controlPane, value]);
};
</script>

<template>
  <div class="main-container" v-if="state.currentPresetData">
    <div class="preset-card">
      <PresetDetail />
      <!-- <Save /> -->
      <PresetChange>
        <Device />
      </PresetChange>
    </div>
    <EffectChain />
    <KnobContainer :updateValue="updateValue" />
    <!-- <EffectsGrid /> -->
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 1rem;
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
