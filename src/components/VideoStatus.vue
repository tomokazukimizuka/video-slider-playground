<template>
  <div
    class="status-item"
    :class="{ active: isVideoPlaying }"
  >
    <span class="icon">🎥</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVideoPlaying: boolean;
}>();
</script>

<style lang="scss" scoped>
.status-item {
  display: grid;
  place-items: center;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  &.active {
    opacity: 1;
    .icon {
      animation: rotateZ 2s linear infinite;
    }
  }
  .icon {
    font-size: 24px;
  }
}
@keyframes rotateZ {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
</style>
