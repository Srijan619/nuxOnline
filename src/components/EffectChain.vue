<template>
  <div class="effect-chain" v-if="effects">
    <div
      v-for="(effect, index) in effectList"
      :key="effect.id"
      :class="['effect-box', { inactive: !effect.active }]"
      @click="toggleEffect(effect)"
    >
      <div class="box-content">
        <h3>{{ effect.title }}</h3>
      </div>
      <div v-if="index < effectList.length - 1" class="connector"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import { EffectOption } from "../types/index.ts";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const props = defineProps<{
  effects: Record<string, EffectOption>;
}>();

//HACK: This needs to be strictly put in interface later...
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
    .map((key) => props.effects[key]) // Map keys to effects
    .filter((effect): effect is EffectOption => effect !== undefined); // Remove any missing ones
});

const toggleEffect = (effect: EffectOption) => {
  nuxMidiController.value?.toggleEffect(effect);
};
</script>

<style scoped>
.effect-chain {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  overflow-x: scroll;
  z-index: 1000;
}

.effect-box {
  position: relative;
  width: 120px;
  height: 100px;
  border-radius: 8px;
  box-shadow: 0 0 0.2rem #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #222;
  transition: all 0.3s ease;
  min-width: 10rem;
}

.effect-box.inactive {
  opacity: 0.5;
  box-shadow: 0 0 0.2rem grey;
  color: #ccc;
}

.effect-box:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
}

.box-content {
  text-align: center;
}

.box-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.box-content p {
  margin: 4px 0 0;
  font-size: 12px;
}

.connector {
  position: absolute;
  top: 50%;
  right: -1.2rem;
  transform: translateY(-50%);
  width: 1.2rem;
  height: 0.2rem;
  background-color: white;
  transition: background-color 0.3s ease;
}
</style>
