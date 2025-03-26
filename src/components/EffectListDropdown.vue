<template>
  <div class="dropdown">
    <ul>
      <li
        v-for="option in selectedEffectConfig?.options"
        :key="option.id"
        @click="selectOption(option)"
        ref="listItems"
        :data-option-id="option.id"
        :style="{
          color:
            option.id === selectedEffectOption.id ? option.dominantColor : '',
        }"
      >
        {{ option.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import type { EffectConfig, Nux } from "../types/index.ts";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state, selectEffectOption } = useNUXMidiController();
const { selectedEffectConfig, selectedEffectOption } = state;

const listItems = ref<HTMLElement[]>([]);

const selectOption = (option: EffectConfig.EffectOption) => {
  const effectOption = {
    ...option,
    category: selectedEffectOption?.category,
  } as Nux.EffectOption; //TODO: Fix this soft casting later...

  selectEffectOption(effectOption, selectedEffectOption?.index);
};

watch(
  () => selectedEffectOption,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      scrollToSelectedEffect();
    }
  },
);

const scrollToSelectedEffect = () => {
  const selectedElement = listItems.value.find(
    (el) => el.dataset.optionId === selectedEffectOption?.id,
  );
  if (selectedElement) {
    selectedElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }
};
</script>

<style scoped>
.dropdown {
  z-index: 10;
  border-radius: 0.25rem;
  max-height: 4vh;
  overflow: scroll;
  width: fit-content;
  scrollbar-width: none;
  content: "";
  inset: 0.125rem;
  text-align: right;
  margin-bottom: 0.5rem;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 0.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.dropdown li:hover {
  color: var(--retro-glow);
}
</style>
