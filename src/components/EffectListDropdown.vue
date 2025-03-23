<template>
  <div class="dropdown">
    <ul>
      <li v-for="option in effectOptions" :key="option.id" @click="selectOption(option)" ref="listItems"
        :data-option-id="option.id" :style="{
          color:
            option.id === props.selectedEffect.id
              ? getMatchingEffectColor(selectedEffect.category, option)
              : '',
        }">
        {{ option.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import type { EffectOption } from "../types/index.ts";
import { getMatchingEffectColor } from "../utils/effectHelper.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const props = defineProps<{
  effectOptions: EffectOption[];
  selectedEffect: EffectOption;
}>();

const listItems = ref<HTMLElement[]>([]);

console.log("Effect options...", props);

const selectOption = (option: EffectOption) => {
  nuxMidiController.value?.selectEffectOption(
    { ...option, category: props.selectedEffect?.category },
    props.selectedEffect?.index,
  );
};

// Watch for changes in selectedEffect and scroll into view
watch(
  () => props.selectedEffect,
  async () => {
    await nextTick(); // Wait for DOM update
    const selectedElement = listItems.value.find(
      (el) => el.dataset.optionId === props.selectedEffect.id,
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.dropdown {
  z-index: 10;
  border-radius: 0.25rem;
  max-height: 6vh;
  overflow: scroll;
  width: fit-content;
  scrollbar-width: none;
  content: "";
  inset: 0.125rem;
  text-align: right;
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
