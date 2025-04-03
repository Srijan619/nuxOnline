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
          <svg class="effect-background" width="100%" height="100%">
            <image
              :xlink:href="getEffectImage(item.category)"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          </svg>
          <div v-if="index < effectList.length - 1" class="connector"></div>
        </div>
      </template>
    </DragDropList>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
    updateEffectOrder(newList);
  },
});

const hoveredEffect = ref<Nux.EffectOption | null>(null);

// Hover timer map
const hoverTimers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map());

const getEffectImage = (category: string) => {
  return category ? `${category}.svg` : "";
};

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

watch(
  () => state.selectedEffectOption,
  (newVal) => {
    hoveredEffect.value = newVal;
  },
);

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
  if (index == null || index === -1) return;
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
  padding: 1rem;
  overflow-x: scroll;
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
  transition: all 0.3s ease-in-out;
  isolation: isolate;
  flex-shrink: 0;
  overflow: visible;
}

.effect-background {
  position: absolute;
  inset: 0.125rem;
  border-radius: 0.125rem;
  z-index: 1;
}

.effect-box.effectHovered {
  animation: blink-border 1s infinite;
  border: 2px solid transparent;
  box-shadow: none !important;
}

@keyframes blink-border {
  0% {
    border-color: var(--hover-glow-color);
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: var(--hover-glow-color);
  }
}

.effect-box.active {
  border: 2px solid transparent;
  box-shadow: 0 0 0.3rem var(--effect-color);
}

.effect-box.inactive {
  opacity: 0.3;
}

.effect-box:hover {
  transform: scale(1.03);
  border-color: var(--hover-border-color, #ff6347);
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

.connector {
  position: absolute;
  top: 50%;
  right: -1.5rem;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 0.15rem;
  background: var(--effect-color);
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}

.effect-box.inactive .connector {
  background: var(--retro-text-secondary);
}

.effect-box:hover .connector {
  opacity: 1;
}

@media (max-width: 1280px) {
  /* Small effect box for laptops */
  .effect-box {
    width: 4.5rem;
    height: 4.5rem;
  }
}

@media (min-width: 1281px) and (max-width: 1800px) {
  /* Medium size for MacBooks and mid-sized screens */
  .effect-box {
    width: 5.7rem;
    height: 5.7rem;
  }
}

@media (min-width: 1801px) {
  /* Larger effect box for big monitors */
  .effect-box {
    width: 10rem;
    height: 10rem;
  }
}
</style>
