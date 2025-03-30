<template>
  <div class="grid-container">
    <div
      v-for="option in state.selectedEffectOption?.options"
      :key="option.id"
      class="grid-item"
      :class="{ active: option.id === state.selectedEffectOption.id }"
      :style="{
        border:
          option.id === state.selectedEffectOption.id
            ? `2px solid ${option.dominantColor}`
            : 'none',
      }"
      @click="selectOption(option)"
    >
      {{ option.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EffectConfig, Nux } from "../types/index.ts";

defineProps({
  activeColor: { type: String, default: "var(--retro-glow)" },
  itemBackgroundColor: { type: String, default: "var(--amp-bg)" },
  itemTextColor: { type: String, default: "var(--retro-text-primary)" },
  hoverColor: { type: String, default: "var(--hover-glow-color)" },
  gridGap: { type: String, default: ".5rem" },
});
// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";
import { ref } from "vue";

const { state, toggleEffect } = useNUXMidiController();

const selectedEffectColor = ref(state.selectedEffectOption.dominantColor);

const selectOption = (option: EffectConfig.EffectOption) => {
  const effectOption = {
    ...option,
    category: state.selectedEffectOption?.category,
  } as Nux.EffectOption; //TODO: Fix this soft casting later...

  toggleEffect(effectOption, state.selectedEffectOption?.index || 0);
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: v-bind(gridGap);
  width: 100%;
  padding: 1rem;
  z-index: 10;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  margin: 1rem;
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
  padding: 0.4rem;
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
    0 0 2px v-bind(selectedEffectColor),
    0 0 2px v-bind(selectedEffectColor);
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
