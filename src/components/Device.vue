<script setup lang="ts">
// 🎭 composables
import { useNUXMidiController } from "../composables/useNUXMidiController";

const { state } = useNUXMidiController();
const { deviceName, deviceVersion } = state;
</script>

<template>
  <div class="device-info">
    <span class="device-name">{{ deviceName }}</span>
    <span class="device-version">{{ deviceVersion }}</span>
  </div>
</template>

<style scoped>
.device-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--retro-text-primary);
  z-index: 2;
  position: relative;
}
.device-info > * {
  font-family: "Pixelify Sans", sans-serif;
}

.device-name {
  font-size: 1rem;
  font-weight: bold;
}

.device-version {
  font-size: 0.6rem;
  font-weight: normal;
  opacity: 0.8;
}
</style>
