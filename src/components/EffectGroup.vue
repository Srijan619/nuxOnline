<script setup lang="ts">
import { computed } from "vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import { EffectOption } from "../types/index.ts";

const props = defineProps<{
  effects: Record<string, EffectOption>;
  toggleEffect: (key: string) => void;
}>();

// Convert the object to an array and then group by category
const groupedEffects = computed(() => {
  const grouped: Record<string, EffectOption[]> = {};

  Object.values(props.effects).forEach((effect) => {
    if (!effect.id) return;

    const category = effect.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(effect);
  });

  return grouped;
});
</script>

<template>
  <div class="effect-group-container">
    <div
      v-for="(effects, category) in groupedEffects"
      :key="category"
      class="effect-group"
    >
      <div class="category">{{ category }}</div>
      <div class="group-content">
        <div
          v-for="(effect, index) in effects"
          :key="`${category}-${index}`"
          class="effect-item"
        >
          <ToggleSwitch
            :label="effect.title"
            :value="effect.active"
            :onToggle="() => props.toggleEffect(effect.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.effect-group-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.effect-group {
  background: #222;
  padding: 14px;
  border-radius: 8px;
}

.category {
  font-weight: bold;
  color: #fff;
  margin: 0.2rem;
}

.group-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
