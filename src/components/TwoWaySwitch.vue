<template>
  <div class="switch-wrapper">
    <div class="switch-container">
      <label class="switch">
        <input type="checkbox" v-model="localValue" @change="emitUpdate" />
        <span class="slider">
          <span class="body"></span>
          <span class="frame"></span>
          <span class="lever"></span>
          <span class="label-off">{{ offText }}</span>
          <span class="label-on">{{ onText }}</span>
          <span class="terminal-left"></span>
          <span class="terminal-right"></span>
          <span class="screw"></span>
        </span>
      </label>
      <span class="title" v-if="title">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  onText?: string; // Custom text for ON label
  offText?: string; // Custom text for OFF label
}>();

// Default values for onText and offText
const onText = props.onText || "ON";
const offText = props.offText || "OFF";

const emit = defineEmits(["update:modelValue"]);
const localValue = ref(false);

// Sync with parent value
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal;
  },
  { immediate: true },
);

const emitUpdate = () => {
  emit("update:modelValue", localValue.value);
};
</script>

<style scoped>
.switch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.switch-container {
  width: 140px;
  height: 100px;
  display: flex;
  perspective: 500px;
  flex-direction: column;
}

.switch {
  position: relative;
  width: 60px;
  height: 50px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 20px;
  left: 40px;
  width: 60px;
  height: 50px;
  transform: rotateX(20deg);
}

.frame {
  position: absolute;
  top: 8px;
  left: -2px;
  width: 64px;
  height: 44px;
  background: linear-gradient(to bottom, #d3d3d3, #a9a9a9);
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.lever {
  position: absolute;
  width: 10px;
  height: 35px;
  top: -25px;
  left: 12px;
  background: linear-gradient(to bottom, #d3d3d3, #a9a9a9);
  border-radius: 5px 5px 0 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition:
    left 0.3s,
    transform 0.3s;
  transform-origin: bottom;
  z-index: 3;
}

input:checked + .slider .lever {
  left: 38px;
  transform: rotate(30deg);
}

.label-off {
  position: absolute;
  top: 30px;
  left: -40px;
  width: 30px;
  height: 20px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transform: rotateX(
    -20deg
  ); /* Counteract the parent tilt for user perspective */
}

.label-on {
  position: absolute;
  top: -5px;
  left: -40px;
  width: 30px;
  height: 20px;
  background-color: #ff0000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transform: rotateX(
    -20deg
  ); /* Counteract the parent tilt for user perspective */
}

.terminal-left {
  position: absolute;
  bottom: -5px;
  left: 5px;
  width: 10px;
  height: 15px;
  background-color: #b87333;
  border-radius: 2px;
  transform: rotate(-10deg);
}

.terminal-right {
  position: absolute;
  bottom: -5px;
  right: 5px;
  width: 10px;
  height: 15px;
  background-color: #b87333;
  border-radius: 2px;
  transform: rotate(10deg);
}

.screw {
  position: absolute;
  bottom: 0;
  left: 3px;
  width: 14px;
  height: 14px;
  background: linear-gradient(to bottom, #c0c0c0, #a9a9a9);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.screw::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 2px;
  background-color: #666;
}

.title {
  z-index: 10;
  color: black;
}
</style>
