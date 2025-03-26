<template>
  <div
    class="round-slider"
    ref="slider"
    :style="sliderStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @wheel="onWheel"
  >
    <svg class="slider-track" :width="size" :height="size">
      <circle class="track-bg" :cx="radius" :cy="radius" :r="trackRadius" />
      <circle
        class="track-fill"
        :cx="radius"
        :cy="radius"
        :r="trackRadius"
        :style="[fillStyle, trackFillStyle]"
      />
    </svg>
    <div class="slider-title" :style="titleStyle">
      <span>{{ title }}</span>
    </div>
    <div class="slider-knob" :style="knobStyle">
      <div class="knob-inner"></div>
      <div class="knob-indicator" :style="knobIndicatorStyle"></div>
    </div>
    <div class="slider-labels" :style="labelStyle">
      <span>{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  initialValue?: number;
  min?: number;
  max?: number;
  size?: number;
  startAngle?: number;
  title?: string;
  sliderFillColor?: string;
}>();

const emit = defineEmits<{
  (e: "update:value", value: number): void;
}>();

const value = ref(props.initialValue || 50);
const slider = ref(null);
const isDragging = ref(false);

const size = props.size || 220;
const radius = computed(() => size / 2);
const knobRadius = computed(() => size * 0.09);
const trackRadius = computed(
  () => radius.value - knobRadius.value - size * 0.045,
);
const minValue = props.min || 0;
const maxValue = props.max || 100;
const title = props.title || "";
const sliderFillColor = props.sliderFillColor;

const startAngle = props.startAngle || 200; // Default: bottom left (225°)

const sliderStyle = computed(() => ({
  width: `${size}px`,
  height: `${size}px`,
}));

const angle = computed(() => {
  const range = maxValue - minValue;
  const normalizedAngle = ((value.value - minValue) / range) * 360;
  return (normalizedAngle + startAngle) % 360;
});

const fillStyle = computed(() => {
  const range = maxValue - minValue;
  const fillAngle = ((value.value - minValue) / range) * 360;
  return {
    strokeDasharray: `${(fillAngle / 360) * (Math.PI * 2 * trackRadius.value)} ${Math.PI * 2 * trackRadius.value}`,
    transform: `rotate(${startAngle - 90}deg)`,
  };
});

const titleStyle = computed(() => ({
  position: "absolute",
  top: `${radius.value - trackRadius.value - knobRadius.value - size * 0.2}px`,
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: `${size * 0.12}px`,
  whiteSpace: "nowrap",
}));

const knobStyle = computed(() => {
  const rad = (angle.value - 90) * (Math.PI / 180);
  const x = radius.value - knobRadius.value + Math.cos(rad) * trackRadius.value;
  const y = radius.value - knobRadius.value + Math.sin(rad) * trackRadius.value;
  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${knobRadius.value * 2}px`,
    height: `${knobRadius.value * 2}px`,
    transform: `rotate(${angle.value}deg)`,
  };
});

const labelStyle = computed(() => ({
  fontSize: `${size * 0.14}px`,
}));

const trackFillStyle = computed(() => ({
  stroke: sliderFillColor,
}));

const knobIndicatorStyle = computed(() => ({
  background: sliderFillColor,
}));

const startDrag = (e) => {
  e.preventDefault();
  isDragging.value = true;
  updateFromEvent(e);
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
};

const onDrag = (e) => {
  if (isDragging.value) {
    // Only update if dragging
    updateFromEvent(e);
  }
};
const updateFromEvent = (e) => {
  if (!isDragging.value) return;
  if (!slider.value) return;
  const rect = slider.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const offsetX = clientX - rect.left - radius.value;
  const offsetY = clientY - rect.top - radius.value;
  let angle = Math.atan2(offsetY, offsetX) * (180 / Math.PI) + 90;
  angle = (angle - startAngle + 360) % 360;
  updateValue(angle);
};

const updateValue = (angle) => {
  const range = maxValue - minValue;
  const newValue = Math.round((angle / 360) * range + minValue);
  value.value = Math.max(minValue, Math.min(maxValue, newValue));
  emit("update:value", value.value);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
};

const onWheel = (e) => {
  e.preventDefault();
  const range = maxValue - minValue;
  const step = Math.max(1, Math.round(range / 20));
  const delta = e.deltaY < 0 ? step : -step;
  const newValue = Math.max(minValue, Math.min(maxValue, value.value + delta));
  value.value = newValue;
  emit("update:value", value.value);
};

onMounted(() => {
  console.log("knocontrol initialvalue..", props);
  const range = maxValue - minValue;
  const initialAngle = ((value.value - minValue) / range) * 360;
  //updateValue(initialAngle);
});

defineExpose({ value });
</script>

<style scoped>
.round-slider {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
}

.track-bg {
  fill: none;
  stroke: var(--amp-inner);
  stroke-width: 8;
}

.track-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dasharray 0.2s ease;
}

.slider-knob {
  position: absolute;
  transition: all 0.1s ease;
}

.knob-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--amp-inner) 0%,
    var(--amp-off) 70%
  );
  border-radius: 50%;
  border: 2px solid var(--amp-border);
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 0 5px var(--retro-glow);
}

.knob-indicator {
  position: absolute;
  width: 10%;
  height: 30%;
  background: var(--amp-accent);
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.slider-title {
  color: var(--retro-text-primary);
  font-weight: bold;
  pointer-events: none;
}

.slider-labels {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--retro-text-primary);
  font-family: "Courier New", monospace;
  font-weight: bold;
  text-shadow: 0 0 2px var(--retro-glow);
}

.round-slider:hover .knob-inner {
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.5),
    inset 0 0 8px var(--hover-glow-color);
}
</style>
