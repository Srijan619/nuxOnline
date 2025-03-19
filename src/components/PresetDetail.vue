<script setup lang="ts">
import Preset from "../types/index.ts";

const props = defineProps<{
  selectedPreset: Preset;
}>();
</script>

<template>
  <div class="notification">
    <div class="music-notes">♪ ♫</div>
    <div class="notiglow"></div>
    <div class="notiborderglow"></div>
    <div class="notititle">🎸 Selected Preset</div>
    <div class="notibody">
      <div>
        <strong>Name:</strong> {{ selectedPreset.name || "Loading..." }}
      </div>
      <div><strong>Preset:</strong> {{ selectedPreset.presetNumber }}</div>
      <div><strong>Scene:</strong> {{ selectedPreset.activeSceneNumber }}</div>
    </div>
  </div>
</template>

<style scoped>
.notification {
  text-align: start;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  height: 8rem;
  background: var(--retro-card-bg);
  border-radius: 0.25rem;
  border: 2px solid var(--retro-border);
  overflow: hidden;
  font-size: 16px;
}

.notification:before {
  position: absolute;
  content: "";
  inset: 0.125rem;
  border-radius: 0.125rem;
  background: var(--retro-card-inner); /* Inner layer */
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQYV2NkYGD4z8DAwMgABXAGNgGwSgAAAP8HFR4J1PAAAAAElFTkSuQmCC");
  background-size: 4px 4px;
  z-index: 2;
}

.notification:after {
  position: absolute;
  content: "";
  width: 0.35rem;
  inset: 0.65rem auto 0.65rem 0.5rem;
  border-radius: 0.125rem;
  /* TODO: This would actual come from active effect that is being toggled or edited..?  */
  background: var(--wah-color);
  transition:
    transform 400ms ease-in-out,
    opacity 400ms ease-in-out;
  z-index: 4;
}

.notification:hover:after {
  transform: translateX(0.3rem) scale(1.05);
  opacity: 0.9;
}

.notititle {
  color: var(--retro-text-primary);
  padding: 0.65rem 0.25rem 0.4rem 1.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  transition:
    transform 400ms ease-in-out,
    color 400ms ease-in-out;
  z-index: 5;
  text-shadow: 0 0 4px var(--retro-glow);
}

.notification:hover .notititle {
  transform: translateX(0.3rem);
  color: var(--wah-color);
}

.notibody {
  color: var(--retro-text-primary);
  padding: 0.5rem 1.5rem;
  transition: transform 400ms ease-in-out;
  z-index: 5;
  line-height: 1.4;
}

.notification:hover .notibody {
  transform: translateX(0.35rem);
}

.notiglow,
.notiborderglow {
  position: absolute;
  width: 20rem;
  height: 20rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle closest-side at center,
    var(--retro-glow),
    transparent
  );
  opacity: 0;
  transition:
    opacity 400ms ease-in-out,
    transform 400ms ease-in-out;
}

.notiglow {
  z-index: 3;
  filter: blur(25px);
}

.notiborderglow {
  z-index: 1;
  filter: blur(30px);
}

.notification:hover .notiglow {
  opacity: 0.3; /* More pronounced glow */
  transform: translate(-50%, -50%) scale(1.1);
}

.notification:hover .notiborderglow {
  opacity: 0.2;
  transform: translate(-50%, -50%) scale(1.15);
}

.music-notes {
  position: absolute;
  top: 10px;
  right: 15px;
  color: var(--retro-text-secondary);
  font-size: 1.2rem;
  z-index: 3;
  animation: floatNotes 2s infinite ease-in-out;
}

@keyframes floatNotes {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
