<script setup lang="ts">
import PresetViewer from "./components/PresetViewer.vue";
import PresetList from "./components/PresetList.vue";
import { onMounted } from "vue";
import { useNUXMidiController } from "./composables/useNUXMidiController";

const { initializeController, state } = useNUXMidiController();

onMounted(() => {
  initializeController();
});
</script>

<template>
  <div id="nux-container">
    <div v-if="!state.isDeviceConnected">
      <p>
        Device is not connected. Make sure NUX-MG 30 is connected and you are
        using firmware version 4.
      </p>
    </div>
    <div v-else-if="state.isFetchingPresets" class="loading-container">
      <div class="spinner"></div>
      <p>Loading presets...</p>
    </div>
    <div v-else class="main-nux-container">
      <PresetList />
      <PresetViewer />
    </div>
  </div>
</template>

<style scoped>
.main-nux-container {
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  gap: 1rem;
  height: 100vh;
  overflow: hidden;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
