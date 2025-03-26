<script setup lang="ts">
import { watch, ref } from "vue";
import KnobControl from "./KnobControl.vue";
import TwoWaySwitch from "./TwoWaySwitch.vue";
import { getEffectKnobs, getMatchingEffectColor } from "../utils/effectHelper";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();
const { currentPresetData, selectedEffect } = state;

defineProps<{
  updateValue: (controlPane: number, value: number) => void;
}>();

const knobs = ref<any[]>([]);

watch(
  () => nuxMidiController.value?.selectedEffect,
  (newVal) => {
    if (newVal) {
      knobs.value = getEffectKnobs(newVal);
    }
  },
);

watch(
  () => nuxMidiController.value?.selectedEffectOption,
  (newVal) => {
    if (newVal) {
      knobs.value = getEffectKnobs(newVal);
    }
  },
);

watch(
  () => nuxMidiController.value?.currentPresetDetailData,
  (newVal) => {
    if (newVal) {
      console.log("I need to update", newVal);
      const category = nuxMidiController.value?.selectedEffect?.category;
      if (!category) return;
      knobs.value = newVal.effects[category]?.knobs;
    }
  },
);
</script>

<template>
  <div class="knob-container">
    <template
      v-for="knob in knobs"
      :key="`${knob.id}-${selectedEffect.categoryColor}-${knob.currentValue}-`"
    >
      <TwoWaySwitch
        v-if="knob && knob.range[0] === 0 && knob.range[1] === 1"
        :id="knob.id"
        :title="knob.title"
        :activeColor="selectedEffect.categoryColor"
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
        :sliderFillColor="selectedEffect.categoryColor"
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
