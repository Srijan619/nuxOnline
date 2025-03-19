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

<style>
.notification {
  text-align: start;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  position: relative;
  width: 18rem;
  height: 8rem;
  background: linear-gradient(135deg, #1a0b2e, #2d1b4e);
  border-radius: 1rem;
  overflow: hidden;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  --gradient: linear-gradient(to bottom, #ff6b6b, #4ecdc4, #45b7d1);
  --color: #ff6b6b;
}

.notification:before {
  position: absolute;
  content: "";
  inset: 0.0625rem;
  border-radius: 0.9375rem;
  background: rgba(26, 11, 46, 0.95);
  z-index: 2;
}

.notification:after {
  position: absolute;
  content: "";
  width: 0.25rem;
  inset: 0.65rem auto 0.65rem 0.5rem;
  border-radius: 0.125rem;
  background: var(--gradient);
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
  color: var(--color);
  padding: 0.65rem 0.25rem 0.4rem 1.5rem;
  font-weight: 600;
  font-size: 1.2rem;
  transition:
    transform 400ms ease-in-out,
    color 400ms ease-in-out;
  z-index: 5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.notification:hover .notititle {
  transform: translateX(0.3rem);
  color: #4ecdc4;
}

.notibody {
  color: #e0dede;
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
    rgba(255, 107, 107, 0.3),
    transparent
  );
  opacity: 0;
  transition:
    opacity 400ms ease-in-out,
    transform 400ms ease-in-out;
}

.notiglow {
  z-index: 3;
  filter: blur(20px);
}

.notiborderglow {
  z-index: 1;
  filter: blur(30px);
}

.notification:hover .notiglow {
  opacity: 0.2;
  transform: translate(-50%, -50%) scale(1.1);
}

.notification:hover .notiborderglow {
  opacity: 0.15;
  transform: translate(-50%, -50%) scale(1.15);
}

.music-notes {
  position: absolute;
  top: 10px;
  right: 15px;
  color: rgba(255, 255, 255, 0.3);
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
