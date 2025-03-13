<script setup lang="ts">
import { ref, onMounted } from "vue";
import { nuxMidiController } from "../utils/NUXMidiController.ts";
const deviceVersion = ref<string>(
  nuxMidiController.getDeviceVersion()?.version,
);
</script>

<template>
  <p>Device version: {{ deviceVersion }}</p>
</template>

<style></style>
