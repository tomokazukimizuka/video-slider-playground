<template>
  <div
    @click="$emit('toggle-controls')"
    class="controls-control"
  >
    <span :class="{ disabled: !showControls }">🕹️</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showControls: boolean;
}>();

defineEmits<{
  'toggle-controls': [];
}>();
</script>

<style lang="scss" scoped>
.controls-control {
  cursor: pointer;
  font-size: 24px;
  .disabled {
    opacity: 0.5;
  }
}
</style>
