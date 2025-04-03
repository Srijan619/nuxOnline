<script setup lang="ts">
import PresetChange from "./PresetChange.vue";
import PresetDetail from "./PresetDetail.vue";
import Device from "./Device.vue";
</script>

<template>
  <div class="preset-card">
    <PresetDetail />
    <!-- <Save /> -->
    <PresetChange>
      <Device />
    </PresetChange>
  </div>
</template>

<style scoped>
.preset-card {
  position: relative;
  width: 20rem;
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
