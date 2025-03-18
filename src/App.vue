<script setup lang="ts">
import Device from "./components/Device.vue";
import PresetViewer from "./components/PresetViewer.vue";
</script>

<template>
  <div id="nux-container">
    <!-- <Device /> -->
    <PresetViewer />
  </div>
</template>

<style scoped>
#nux-container {
  margin: 1rem;
  padding: 1rem;
}
</style>
