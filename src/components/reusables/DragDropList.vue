<template>
  <div
    v-for="(item, index) in modelValue"
    :key="index"
    draggable="true"
    class="drag-item"
    @dragstart="onDragStart(index, $event)"
    @dragover.prevent
    @dragenter="onDragEnter(index)"
    @drop="onDrop"
  >
    <slot :item="item" :index="index"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

type DragItem = any;

interface Props {
  modelValue: DragItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: DragItem[]): void;
}>();

const draggedIndex = ref<number | null>(null);

const tempList = ref([...props.modelValue]);

const onDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index;
  tempList.value = [...props.modelValue];
  event.dataTransfer!.effectAllowed = "move";
};

const onDragEnter = (targetIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return;

  const newList = [...tempList.value];
  const [movedItem] = newList.splice(draggedIndex.value, 1);
  newList.splice(targetIndex, 0, movedItem);

  tempList.value = newList;
  draggedIndex.value = targetIndex;
};

const onDrop = () => {
  emit("update:modelValue", tempList.value);
  draggedIndex.value = null;
};
</script>

<style scoped>
.drag-item {
  cursor: grab;
  transition: background 0.2s ease;
}

.drag-item:active {
  cursor: grabbing;
  background: var(--retro-card-inner);
}
</style>
