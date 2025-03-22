<template>
  <div class="dropdown">
    <ul>
      <li v-for="option in effectOptions" :key="option.id" @click="selectOption(option)">
        {{ option.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { EffectOption, Effect } from "../types/index.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const props = defineProps<{
  effectOptions: EffectOption[];
  selectedEffect: EffectOption;
}>();

const selectOption = (option: EffectOption) => {
  nuxMidiController.value?.selectEffectOption(
    { ...option, category: props.selectedEffect?.category },
    props.selectedEffect?.index,
  );
};
</script>

<style scoped>
.dropdown {
  z-index: 10;
  border-radius: 0.25rem;
  max-height: 10vh;
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
