<script setup lang="ts">
import PresetViewer from "./components/PresetViewer.vue";
import PresetList from "./components/PresetList.vue";
import { onMounted } from "vue";
import { useNUXMidiController } from "./composables/useNUXMidiController";

const { initializeController } = useNUXMidiController();

onMounted(() => {
  initializeController();
});
</script>

<template>
  <div id="nux-container">
    <PresetList />
    <PresetViewer />
  </div>
</template>

<style scoped>
#nux-container {
  margin: 1rem;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  gap: 1rem;
  height: 100vh;
  overflow: hidden;
}
</style>
