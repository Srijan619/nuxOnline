<script setup lang="ts">
import { ref, computed, watch } from "vue";
import KnobControl from "./KnobControl.vue";
import TwoWaySwitch from "./TwoWaySwitch.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state, sendRawSysEx } = useNUXMidiController();

const selectedEffectColor = ref(state.selectedEffectOption.dominantColor);

const updateValue = (controlPane: number, value: number) => {
  setTimeout(() => (sendRawSysEx(controlPane, value), 10));
};

watch(
  () => state.selectedEffectOption.dominantColor,
  (newValue) => {
    if (newValue) {
      selectedEffectColor.value = newValue;
    }
  },
);

const knobs = computed(() => state.selectedEffectOption?.knobs || []);
</script>

<template>
  <div class="knob-container">
    <template
      v-for="knob in knobs"
      :key="`${knob.id}-${knob.currentValue}-${selectedEffectColor}`"
    >
      <TwoWaySwitch
        v-if="knob && knob.range[0] === 0 && knob.range[1] === 1"
        :id="knob.id"
        :title="knob.title"
        :activeColor="selectedEffectColor"
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
        :sliderFillColor="selectedEffectColor"
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
