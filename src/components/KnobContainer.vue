<script setup lang="ts">
import { watch, ref } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController";
import KnobControl from "./KnobControl.vue";
import TwoWaySwitch from "./TwoWaySwitch.vue";
import { getEffectKnobs, getMatchingEffectColor } from "../utils/effectHelper";

defineProps<{
  updateValue: (controlPane: number, value: number) => void;
}>();

const knobs = ref<any[]>([]);
const sliderFillColor = ref();
watch(
  () => nuxMidiController.value?.selectedEffect,
  (newVal) => {
    if (newVal) {
      sliderFillColor.value = getMatchingEffectColor(
        newVal.category,
        newVal.id,
      );
      knobs.value = getEffectKnobs(newVal.category, newVal.id);
    }
  },
);

watch(
  () => nuxMidiController.value?.selectedEffectOption,
  (newVal) => {
    if (newVal) {
      sliderFillColor.value = getMatchingEffectColor(
        newVal.category,
        newVal.id,
      );
      knobs.value = getEffectKnobs(newVal.category, newVal.id);
    }
  },
);
</script>

<template>
  <div class="knob-container">
    <template v-for="knob in knobs" :key="`${knob.id}-${sliderFillColor}`">
      <TwoWaySwitch
        v-if="knob.range[0] === 0 && knob.range[1] === 1"
        v-model="knob.value"
        :title="knob.title"
        @update:modelValue="(value) => updateValue(knob?.ctrl, value ? 1 : 0)"
      />
      <KnobControl
        v-else
        :title="knob.title"
        :size="100"
        :min="knob.range[0]"
        :max="knob.range[1]"
        @update:value="(value) => updateValue(knob?.ctrl, value)"
        :sliderFillColor="sliderFillColor"
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
}
</style>
