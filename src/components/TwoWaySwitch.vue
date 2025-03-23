<template>
  <div class="switch-wrapper">
    <div class="switch-container">
      <label class="switch">
        <input type="checkbox" v-model="localValue" @change="emitUpdate" />
        <span class="slider">
          <span class="body"></span>
          <span class="frame"></span>
          <span class="lever"></span>
          <span class="label label-off">{{ offText }}</span>
          <span class="label label-on">{{ onText }}</span>
          <span class="terminal terminal-left"></span>
          <span class="terminal terminal-right"></span>
        </span>
      </label>
      <span class="title" v-if="title">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  id: string;
  onText?: string;
  offText?: string;
  onColor?: string;
  offColor?: string;
  activeColor?: string;
}>();

const onText = props.onText || props.id.split("-")[0] || "ON";
const offText = props.offText || props.id.split("-")[1] || "OFF";
const onColor = props.onColor;
const offColor = props.offColor;
const activeColor = props.activeColor;

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

const onLabelColor = computed(() => {
  return localValue.value ? activeColor : onColor;
});

const offLabelColor = computed(() => {
  return !localValue.value ? activeColor : offColor;
});

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
  background-image: url("clean-textile.png");
  background-size: 4px 4px;
  border-radius: 5px;
  background-repeat: repeat;
  background-color: #242424;
  z-index: 20;
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

.label {
  position: absolute;
  left: -60px;
  width: 40px;
  height: 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 2;
  padding: 0.5rem;
  transform: rotateX(-20deg);
  overflow: hidden;
  text-overflow: ellipsis;
}
.label-off {
  top: 30px;
  background-color: v-bind(offLabelColor);
}

.label-on {
  top: -5px;
  background-color: v-bind(onLabelColor);
}
.terminal {
  position: absolute;
  bottom: -5px;
  left: 5px;
  width: 10px;
  height: 15px;
  background-color: #b87333;
  border-radius: 2px;
}

.terminal-left {
  transform: rotate(-10deg);
}
.terminal-right {
  transform: rotate(10deg);
}

.title {
  z-index: 10;
}
</style>
