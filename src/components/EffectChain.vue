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
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scrollbar-color: #ff6b6b #0f071a;
}

.effect-chain {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1.5rem;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  scroll-behavior: smooth;
}

/* Base styles for effect boxes */
.effect-box {
  position: relative;
  width: 10rem;
  height: 6rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: linear-gradient(135deg, #1a0b2e, #2d1b4e);
  transition: all 0.3s ease-in-out;
  isolation: isolate;
  flex-shrink: 0;
  overflow: visible; /* Ensure connectors aren’t clipped */
}

.effect-box:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.6875rem;
  background: rgba(26, 11, 46, 0.95);
  z-index: 1;
}

.effect-box.active {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.effect-box.inactive {
  opacity: 0.6;
}

.effect-box:hover {
  transform: scale(1.05) translateY(-2px);
}

/* Category-specific colors */
.wah {
  --effect-color: #ff6b6b;
}
.comp {
  --effect-color: #4ecdc4;
}
.efx {
  --effect-color: #45b7d1;
}
.amp {
  --effect-color: #f7d794;
}
.eq {
  --effect-color: #95e07b;
}
.gate {
  --effect-color: #ff9f1c;
}
.mod {
  --effect-color: #9b59b6;
}
.delay {
  --effect-color: #3498db;
}
.reverb {
  --effect-color: #e74c3c;
}
.ir {
  --effect-color: #2ecc71;
}
.sr {
  --effect-color: #e67e22;
}
.vol {
  --effect-color: #ecf0f1;
}

.effect-box.active:after {
  position: absolute;
  content: "";
  width: 0.25rem;
  inset: 0.5rem auto 0.5rem 0.5rem;
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
  filter: blur(20px);
}

.effect-box:hover .box-glow {
  opacity: 0.2;
}

.box-content {
  text-align: center;
  z-index: 3;
  width: 100%;
  padding: 0.5rem;
}

.box-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--effect-color);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.connector {
  position: absolute;
  top: 50%;
  right: -1.5rem; /* Position outside the box */
  transform: translateY(-50%);
  width: 1.5rem;
  height: 0.2rem;
  background: linear-gradient(to right, #fff, var(--effect-color));
  transition: background 0.3s ease-in-out;
  z-index: 1;
}

.effect-box.inactive .connector {
  background: #999;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .effect-chain-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .effect-chain-wrapper::-webkit-scrollbar-thumb {
    background: #ff6b6b;
    border-radius: 4px;
  }

  .effect-chain-wrapper::-webkit-scrollbar-track {
    background: #0f071a;
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
  .effect-chain {
    flex-wrap: nowrap;
    width: max-content; /* Ensure all boxes are visible, scroll if needed */
    justify-content: flex-start;
    padding: 1rem;
    gap: 1.5rem;
  }

  .effect-box {
    width: 10rem;
    height: 6rem;
  }
}
</style>
