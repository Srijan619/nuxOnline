<template>
  <div class="effect-chain-wrapper">
    <div class="effect-chain">
      <div
        v-for="(effect, index) in effectList"
        :key="effect.id"
        class="effect-box"
        :class="[effect.active ? 'active' : 'inactive', effect.category]"
        @click="toggleEffect(effect)"
      >
        <div class="box-glow"></div>
        <div class="box-content">
          <h3>{{ effect.title }}</h3>
        </div>
        <div v-if="index < effectList.length - 1" class="connector"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EffectOption } from "../types/index.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const props = defineProps<{
  effects: Record<string, EffectOption>;
}>();

const orderedKeys: (keyof Effect)[] = [
  "wah",
  "comp",
  "efx",
  "amp",
  "eq",
  "gate",
  "mod",
  "delay",
  "reverb",
  "ir",
  "sr",
  "vol",
];

const effectList = computed(() => {
  return orderedKeys
    .map((key) => props.effects[key])
    .filter((effect): effect is EffectOption => effect !== undefined);
});

const toggleEffect = (effect: EffectOption) => {
  nuxMidiController.value?.toggleEffect(effect);
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
  padding: 1rem;
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
  box-shadow: 0 0 15px var(--retro-glow);
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

.box-glow {
  position: absolute;
  width: 12rem;
  height: 12rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle closest-side at center,
    var(--effect-color),
    transparent
  );
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  z-index: 0;
  filter: blur(25px);
}

.effect-box:hover .box-glow {
  opacity: 0.3;
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
  color: var(--retro-text-primary); /* Simple, consistent text color */
  text-shadow: 0 0 4px var(--retro-glow); /* Retro glow */
}

.connector {
  position: absolute;
  top: 50%;
  right: -1.5rem;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 0.15rem;
  background: var(--effect-color); /* Full category color */
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}
.effect-box.inactive .connector {
  background: var(--retro-text-secondary);
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
    padding: 0.5rem;
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
    padding: 1rem;
    gap: 1.5rem;
  }
}
</style>
