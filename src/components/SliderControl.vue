<template>
  <div
    class="slider-icon-wrapper"
    :class="{ active: isAutoplaying }"
    @click="$emit('toggle-autoplay')"
  >
    <span class="icon">🖼️ 🖼️</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isAutoplaying: boolean;
}>();

defineEmits<{
  'toggle-autoplay': [];
}>();
</script>

<style lang="scss" scoped>
.slider-icon-wrapper {
  opacity: 0.5;
  transition: opacity 0.3s ease;
  font-family: monospace;
  width: 32px;
  overflow: hidden;
  display: grid;
  place-items: center;
  white-space: nowrap;
  &.active {
    opacity: 1;
    .icon {
      animation: scroll-left 0.5s ease-out infinite;
    }
  }
  .icon {
    display: inline-block;
    width: 32px;
    font-size: 24px;
    letter-spacing: 0;
  }
}
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
