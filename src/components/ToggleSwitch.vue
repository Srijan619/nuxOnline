<script setup lang="ts">
defineProps<{
  label: string;
  value: Boolean;
  onToggle: () => void;
}>();
</script>

<template>
  <div class="toggle-container">
    <span class="label">{{ label }}</span>
    <label class="switch">
      <input type="checkbox" :checked="value" @change="onToggle" />
      <span class="slider"></span>
    </label>
  </div>
</template>

<style scoped>
.toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #333;
  padding: 8px 12px;
  border-radius: 6px;
  width: 100%;
}

.label {
  color: #ddd;
  font-size: 14px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e74c3c;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2ecc71;
}

input:checked + .slider:before {
  transform: translateX(14px);
}
</style>
