<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";

const deviceVersion = ref("Not connected");
watch(
  () => nuxMidiController.value?.deviceVersion,
  (newVersion) => {
    if (newVersion) {
      deviceVersion.value = newVersion;
    }
  },
);
</script>

<template>
  <p v-if="nuxMidiController">
    Device: {{ nuxMidiController.getDeviceName() }} | Version:
    {{ deviceVersion }}
  </p>
  <p v-else>Waiting for NUX MG-30...</p>
</template>

<style></style>
