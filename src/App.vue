<script setup lang="ts">
import DeviceVersion from "./components/DeviceVersion.vue";
import PresetViewer from "./components/PresetViewer.vue";
</script>

<template>
  <div id="nux-container">
    <DeviceVersion />
    <PresetViewer />
  </div>
</template>

<style scoped>
#nux-container {
  margin: 1rem;
  padding: 1rem;
}
</style>
