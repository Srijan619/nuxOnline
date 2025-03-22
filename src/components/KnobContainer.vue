<script setup lang="ts">
import { watch, ref } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController";
import KnobControl from "./KnobControl.vue";
import effectsMapping from "../effects";

const props = defineProps<{
  updateValue: (controlPane: number, value: number) => void;
}>();

const knobs = ref<any[]>([]);
const sliderFillColor = ref();
// Starting control numbers from your effects mapping
watch(
  () => nuxMidiController.value?.selectedEffect,
  (newVal) => {
    if (newVal) {
      const effectCategory = effectsMapping.effects[newVal.category];
      const selectedEffect = effectCategory?.options.find(
        (opt: any) => opt.id === newVal.id,
      );
      sliderFillColor.value =
        selectedEffect?.dominantColor || `var(--${newVal.category}-color)`; // Either effect pedals dominant color or main category color
      knobs.value = selectedEffect?.knobs || [];
    }
  },
);
</script>

<template>
  <div class="knob-container">
    <KnobControl v-for="(knob, index) in knobs" :key="knob.id" :title="knob.title" :size="100" :min="knob.range[0]"
      :max="knob.range[1]" @update:value="(value) => updateValue(knob?.ctrl, value)"
      :sliderFillColor="sliderFillColor" />
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
