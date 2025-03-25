<template>
  <div class="grid-container">
    <div
      v-for="option in effectOptions"
      :key="option.id"
      class="grid-item"
      :style="{
        backgroundColor:
          option.id === selectedEffect.id ? activeColor : itemBackgroundColor,
        color:
          option.id === selectedEffect.id
            ? getMatchingEffectColor(selectedEffect.category)
            : itemTextColor,
      }"
      @click="selectOption(option)"
    >
      {{ option.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EffectOption } from "../types/index.ts";
import { getMatchingEffectColor } from "../utils/effectHelper.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const props = defineProps({
  effectOptions: { type: Array as () => EffectOption[], required: true },
  selectedEffect: { type: Object as () => EffectOption, required: true },
  activeColor: { type: String, default: "var(--retro-glow)" },
  itemBackgroundColor: { type: String, default: "transparent" },
  itemTextColor: { type: String, default: "white" },
  hoverColor: { type: String, default: "var(--retro-glow)" },
  gridGap: { type: String, default: "10px" },
});

const selectOption = (option: EffectOption) => {
  nuxMidiController.value?.selectEffectOption(
    { ...option, category: props.selectedEffect?.category },
    props.selectedEffect?.index,
  );
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: v-bind(gridGap);
  width: fit-content;
  padding: 0.1rem;
  z-index: 10;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.grid-item {
  padding: 0.1rem;
  cursor: pointer;
  transition:
    background 0.3s,
    color 0.3s;
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.grid-item:hover {
  color: v-bind(hoverColor);
}
</style>
