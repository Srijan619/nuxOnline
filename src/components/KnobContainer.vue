<script setup lang="ts">
import KnobControl from "./KnobControl.vue";
import TwoWaySwitch from "./TwoWaySwitch.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state, sendRawSysEx } = useNUXMidiController();

const updateValue = (controlPane: number, value: number) => {
  return;
  setTimeout(() => (sendRawSysEx(controlPane, value), 10));
};
</script>

<template>
  <div class="knob-container">
    <template
      v-for="knob in state.selectedEffectOption.knobs"
      :key="`${knob.id}-${knob.currentValue}`"
    >
      <TwoWaySwitch
        v-if="knob && knob.range[0] === 0 && knob.range[1] === 1"
        :id="knob.id"
        :title="knob.title"
        :activeColor="state.selectedEffectOption.categoryColor"
        :initialValue="knob.currentValue === 1"
        @update:value="(value) => updateValue(knob?.ctrl, value ? 1 : 0)"
      />
      <KnobControl
        v-else
        :title="knob.title"
        :size="100"
        :min="knob.range[0]"
        :max="knob.range[1]"
        :initialValue="knob?.currentValue"
        @update:value="(value) => updateValue(knob?.ctrl, value)"
        :sliderFillColor="state.selectedEffectOption?.categoryColor"
      />
    </template>
  </div>
</template>

<style scoped>
.knob-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-left: 1rem;
}
</style>
