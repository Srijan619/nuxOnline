<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MIDIMock, SysExRequest } from "../utils/mockMIDI.ts";
const deviceVersion = ref<string>("");

const sendMsg = () => {
  const midiMock = new MIDIMock((msg, extractedData) => {
    deviceVersion.value = extractedData.version;
  });

  midiMock.receiveMessage(SysExRequest.DEVICE_VERSION);
};

onMounted(() => {
  sendMsg();
});
</script>

<template>
  <p>Device version: {{ deviceVersion }}</p>
</template>

<style></style>
