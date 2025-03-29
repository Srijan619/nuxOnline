<template>
  <div class="effect-chain-wrapper">
    <DragDropList v-model="effectList">
      <template #default="{ item, index }">
        <div
          class="effect-box"
          :class="[
            item.active ? 'active' : 'inactive',
            item.category,
            hoveredEffect?.id === item.id ? 'effectHovered' : '',
          ]"
          @click="toggleEffectSelection(item)"
          @mouseover="startHoverTimer(item)"
          @mouseleave="clearHoverTimer"
        >
          <div class="box-content">
            <h3>{{ item.title }}</h3>
          </div>
          <div v-if="index < effectList.length - 1" class="connector"></div>
        </div>
      </template>
    </DragDropList>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Nux } from "../types/index.ts";
import DragDropList from "./reusables/DragDropList.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";
import { getEffectIndexByCategory } from "../parsers/effects/extractEffectsOrder.ts";

const { state, selectEffectOption, toggleEffect, updateEffectOrder } =
  useNUXMidiController();

const effectList = computed({
  get: () => {
    if (!state.currentPresetData?.effects) return [];
    return (
      state.currentPresetData?.effectsOrder
        ?.map((key) => state.currentPresetData?.effects![key])
        .filter((effect): effect is Nux.EffectOption => effect !== undefined) ||
      []
    );
  },
  set: (newList: Nux.EffectOption[]) => {
    if (!state.currentPresetData) return;
    console.log("Request NUX to update effect order now...", newList);
    updateEffectOrder(newList);
    //state.currentPresetData.effectsOrder = newList.map(effect => effect.id);
  },
});

const hoveredEffect = ref<Nux.EffectOption | null>(null);

// Hover timer map
const hoverTimers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map());

const startHoverTimer = (effect: Nux.EffectOption) => {
  if (!effect.id) return;
  if (hoverTimers.value.has(effect.id)) {
    clearTimeout(hoverTimers.value.get(effect.id)!);
  }

  hoverTimers.value.set(
    effect.id,
    setTimeout(() => {
      hoveredEffect.value = effect;
      showEffectOptions(effect);
    }, 500),
  );
};

const clearHoverTimer = () => {
  hoverTimers.value.forEach((timer) => clearTimeout(timer));
  hoverTimers.value.clear();
};

const showEffectOptions = (effect: Nux.EffectOption) => {
  selectEffectOption(effect);
};

const toggleEffectSelection = (effect: Nux.EffectOption) => {
  if (!effect.category) return;
  const index = getEffectIndexByCategory(effect.category);
  if (!index) return;
  toggleEffect(effect, index);
};
</script>

<style scoped>
.effect-chain-wrapper {
  width: 100%;
  scrollbar-width: none;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.5rem;
  scroll-behavior: smooth;
}
.effect-box {
  position: relative;
  border-radius: 0.25rem;
  border: 2px solid var(--retro-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: var(--retro-card-bg);
  transition: all 0.3s ease-in-out;
  isolation: isolate;
  flex-shrink: 0;
  overflow: visible;
}

.effect-box.effectHovered {
  border: 2px solid var(--hover-glow-color);
}

.effect-box:before {
  position: absolute;
  content: "";
  inset: 0.125rem;
  border-radius: 0.125rem;
  background: var(--retro-card-inner);
  z-index: 1;
  /* Subtle grain texture */
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQYV2NkYGD4z8DAwMgABXAGNgGwSgAAAP8HFR4J1PAAAAAElFTkSuQmCC");
  background-size: 4px 4px;
}

.effect-box.active {
  box-shadow: 0 0 10px var(--retro-shadow);
}

.effect-box.inactive {
  opacity: 0.7;
}

.effect-box:hover {
  transform: scale(1.03);
  border-color: var(--hover-border-color, #ff6347);
}

.effect-box:hover .box-glow {
  opacity: 0.4;
}

.effect-box:hover .box-content h3 {
  color: var(--hover-text-color, #ff6347);
}

.effect-box:hover .connector {
  background: var(--hover-connector-color, #ff6347);
}

/* Category-specific colors for vertical tag and connector */
.wah {
  --effect-color: var(--wah-color);
}

.comp {
  --effect-color: var(--comp-color);
}

.efx {
  --effect-color: var(--efx-color);
}

.amp {
  --effect-color: var(--amp-color);
}

.eq {
  --effect-color: var(--eq-color);
}

.gate {
  --effect-color: var(--gate-color);
}

.mod {
  --effect-color: var(--mod-color);
}

.delay {
  --effect-color: var(--delay-color);
}

.reverb {
  --effect-color: var(--reverb-color);
}

.ir {
  --effect-color: var(--ir-color);
}

.sr {
  --effect-color: var(--sr-color);
}

.vol {
  --effect-color: var(--vol-color);
}

.effect-box.active:after {
  position: absolute;
  content: "";
  width: 0.2rem;
  inset: 0;
  border-radius: 0.125rem;
  background: var(--effect-color);
  transition: transform 300ms ease-in-out;
  z-index: 2;
}

.effect-box:hover.active:after {
  transform: translateX(0.2rem);
}

.box-content {
  text-align: start;
  z-index: 3;
  width: 100%;
  padding: 0.5rem;
}

.box-content h3 {
  margin: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--retro-text-primary);
}

.connector {
  position: absolute;
  top: 50%;
  right: -1.5rem;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 0.15rem;
  background: var(--effect-color);
  /* Full category color */
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}

.effect-box.inactive .connector {
  background: var(--retro-text-secondary);
}

.effect-box:hover .connector {
  opacity: 1;
  background: var(--hover-connector-color, #ff6347);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .effect-chain-wrapper {
    overflow-x: auto;
  }

  .effect-chain-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .effect-box {
    width: 6rem;
    height: 3rem;
  }

  .box-content h3 {
    font-size: 0.9rem;
  }

  .connector {
    right: -1rem;
    width: 1rem;
  }
}

@media (min-width: 769px) {
  .effect-chain-wrapper {
    overflow-x: auto;
    max-width: 100%;
  }

  .effect-box {
    width: 10rem;
    height: 5rem;
  }

  .box-content h3 {
    font-size: 0.8rem;
  }
}
</style>
