<script setup lang="ts">
import PresetViewer from "./components/PresetViewer.vue";
import { onMounted } from "vue";
import { useNUXMidiController } from "./composables/useNUXMidiController";

const { initializeController } = useNUXMidiController();

onMounted(() => {
  initializeController();
});
</script>

<template>
  <div id="nux-container">
    <PresetViewer />
  </div>
</template>

<style scoped>
#nux-container {
  margin: 1rem;
  overflow: hidden;
}
</style>
