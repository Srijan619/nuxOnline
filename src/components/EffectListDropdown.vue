<template>
  <div class="dropdown">
    <ul>
      <li
        v-for="option in options"
        :key="option.id"
        @click="selectOption(option)"
      >
        {{ option.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { EffectOption } from "../types/index.ts";

const props = defineProps<{ options: EffectOption[] }>();
const emit = defineEmits(["select"]);

const dropdownRef = ref<HTMLElement | null>(null);

const selectOption = (option: EffectOption) => {
  emit("select", option);
};
</script>

<style scoped>
.dropdown {
  z-index: 10;
  border-radius: 0.25rem;
  max-height: 3.9vh;
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
  background: var(--retro-glow);
}
</style>
