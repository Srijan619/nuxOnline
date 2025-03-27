<script setup lang="ts">
import { ref, watch } from "vue";
import KnobControl from "./KnobControl.vue";
import TwoWaySwitch from "./TwoWaySwitch.vue";

// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state, sendRawSysEx } = useNUXMidiController();

const selectedEffectColor = ref();

watch(
  () => state.selectedEffectOption.dominantColor,
  (newValue) => {
    selectedEffectColor.value = newValue;
  },
);

const updateValue = (controlPane: number, value: number) => {
  setTimeout(() => (sendRawSysEx(controlPane, value), 10));
};
</script>

<template>
  <div class="knob-container">
    <TransitionGroup name="knobs">
      <template
        v-for="knob in state.selectedEffectOption?.knobs"
        :key="`${knob.id}-${selectedEffectColor}-${knob.currentValue}-`"
      >
        <TwoWaySwitch
          v-if="knob && knob.range[0] === 0 && knob.range[1] === 1"
          :id="knob.id"
          :title="knob.title"
          :activeColor="selectedEffectColor"
          :initialValue="knob.currentValue === 1"
          @update:value="(value) => updateValue(knob?.ctrl, value ? 1 : 0)"
        />
        <KnobControl
          v-else
          :title="knob.title"
          :size="100"
          :min="knob.range[0]"
          :max="knob.range[1]"
          :initialValue="knob?.currentValue"
          @update:value="(value) => updateValue(knob?.ctrl, value)"
          :sliderFillColor="selectedEffectColor"
        />
      </template>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.knob-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-left: 1rem;
}

.knobs-move, /* apply transition to moving elements */
.knobs-enter-active,
.knobs-leave-active {
  transition: all 0.5s ease;
}

.knobs-enter-from,
.knobs-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.knobs-leave-active {
  position: absolute;
}
</style>
