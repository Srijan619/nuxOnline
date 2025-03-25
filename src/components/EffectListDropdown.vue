<template>
  <div class="dropdown">
    <ul>
      <li
        v-for="option in effectOptions"
        :key="option.id"
        @click="selectOption(option)"
        ref="listItems"
        :data-option-id="option.id"
        :style="{
          color:
            option.id === selectedEffect.id
              ? getMatchingEffectColor(selectedEffect)
              : '',
        }"
      >
        {{ option.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import type { EffectOption } from "../types/index.ts";
import { getMatchingEffectColor } from "../utils/effectHelper.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
import effectsMapping from "../effects";

const listItems = ref<HTMLElement[]>([]);
const selectedEffect = ref({});

const effectOptions = computed(() => {
  if (!selectedEffect.value) return [];
  return effectsMapping?.effects[selectedEffect.value.category]?.options || [];
});

const selectOption = (option: EffectOption) => {
  nuxMidiController.value?.selectEffectOption(
    { ...option, category: selectedEffect?.value.category },
    selectedEffect?.value.index,
  );
};

watch(
  () => nuxMidiController.value?.selectedEffect,
  async (newVal) => {
    if (newVal) {
      selectedEffect.value = newVal;
      await nextTick();
      scrollToSelectedEffect();
    }
  },
);

watch(
  () => nuxMidiController.value?.selectedEffectOption,
  async (newVal) => {
    if (newVal) {
      selectedEffect.value = newVal;
      await nextTick();
      scrollToSelectedEffect();
    }
  },
);

const scrollToSelectedEffect = () => {
  const selectedElement = listItems.value.find(
    (el) => el.dataset.optionId === selectedEffect.value.id,
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
