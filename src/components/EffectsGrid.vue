<template>
  <div class="grid-container">
    <div
      v-for="option in effectOptions"
      :key="option.id"
      class="grid-item"
      :class="{ active: option.id === selectedEffect.id }"
      :style="{
        border:
          option.id === selectedEffect.id
            ? `2px solid ${getMatchingEffectColor(selectedEffect)}`
            : 'none',
      }"
      @click="selectOption(option)"
    >
      {{ option.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { EffectOption } from "../types/index.ts";
import { getMatchingEffectColor } from "../utils/effectHelper.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import effectsMapping from "../effects";

defineProps({
  activeColor: { type: String, default: "var(--retro-glow)" },
  itemBackgroundColor: { type: String, default: "var(--amp-bg)" },
  itemTextColor: { type: String, default: "var(--retro-text-primary)" },
  hoverColor: { type: String, default: "var(--hover-glow-color)" },
  gridGap: { type: String, default: ".5rem" },
});

const selectedEffect = ref({});

const selectOption = (option: EffectOption) => {
  nuxMidiController.value?.selectEffectOption(
    { ...option, category: selectedEffect?.value.category },
    selectedEffect?.value.index,
  );
};

const effectOptions = computed(() => {
  if (!selectedEffect.value) return [];
  return effectsMapping?.effects[selectedEffect.value.category]?.options || [];
});

watch(
  () => nuxMidiController.value?.selectedEffect,
  async (newVal) => {
    if (newVal) {
      selectedEffect.value = newVal;
    }
  },
);
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: v-bind(gridGap);
  width: 100%;
  padding: 0.2rem;
  z-index: 10;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  margin: 1rem;
  max-height: 400px;
  overflow: scroll;
  scrollbar-width: none;
}

.grid-item {
  padding: 0.1rem;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: v-bind(itemBackgroundColor);
  color: v-bind(itemTextColor);
  font-family: Arial, sans-serif;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
  user-select: none;
}

.grid-item:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  background-color: v-bind(hoverColor);
}

.grid-item.active {
  box-shadow:
    0 0 2px v-bind(getMatchingEffectColor(selectedEffect)),
    0 0 2px v-bind(getMatchingEffectColor(selectedEffect));
  transform: scale(1.15);
}

.grid-item.active:hover {
  transform: scale(1.2) translateY(-5px);
}

.grid-item:focus {
  outline: 2px solid v-bind(activeColor);
  outline-offset: 2px;
}
</style>
