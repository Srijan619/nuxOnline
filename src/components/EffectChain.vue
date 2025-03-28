<template>
  <div class="effect-chain-wrapper">
    <div class="effect-chain">
      <div
        v-for="(effect, index) in effectList"
        :key="effect.id"
        class="effect-box"
        :class="[
          effect.active ? 'active' : 'inactive',
          effect.category,
          hoveredEffect?.id === effect.id ? 'effectHovered' : '',
        ]"
        @click="toggleEffectSelection(effect, index)"
        @mouseover="startHoverTimer(effect)"
        @mouseleave="clearHoverTimer"
      >
        <div class="box-content">
          <h3>{{ effect.title }}</h3>
        </div>
        <div v-if="index < effectList.length - 1" class="connector"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Nux } from "../types/index.ts";
import { EffectCategory } from "../types/types.ts";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state, selectEffectOption, toggleEffect } = useNUXMidiController();

//TODO: Check if this garbage ordering is at all working...NUX should define the order anyway

const effectList = computed(() => {
  if (!state.currentPresetData?.effects) return [];
  return state.currentPresetData?.effectsOrder
    ?.map((key) => state.currentPresetData?.effects![key])
    .filter((effect): effect is Nux.EffectOption => effect !== undefined);
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

const toggleEffectSelection = (effect: Nux.EffectOption, index: number) => {
  toggleEffect(effect, index);
};
</script>

<style scoped>
.effect-chain-wrapper {
  width: 100%;
  scrollbar-width: none;
}

.effect-chain {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.5rem;
  scroll-behavior: smooth;
}

.effect-box {
  position: relative;
  width: 10rem;
  height: 6rem;
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

  .effect-chain {
    width: max-content;
    gap: 1rem;
  }

  .effect-box {
    width: 8rem;
    height: 5rem;
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

  .effect-chain {
    flex-wrap: nowrap;
    width: max-content;
    justify-content: flex-start;
    gap: 1.5rem;
  }
}
</style>
