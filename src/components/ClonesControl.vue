<template>
  <div
    @click="$emit('toggle-clones')"
    class="clones-control"
    :class="{ active: showClones }"
  >
    <span
      class="icon"
      :class="{ disabled: !showClones }"
      >🧬</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showClones: boolean;
}>();

defineEmits<{
  'toggle-clones': [];
}>();
</script>

<style lang="scss" scoped>
.clones-control {
  display: grid;
  place-items: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
  font-size: 24px;
  .disabled {
    opacity: 0.5;
  }
  &.active {
    .icon {
      animation: rotateDiag 0.8s linear infinite;
    }
  }
}
@keyframes rotateDiag {
  from {
    transform: rotate3d(1, -1, 0, 0deg);
  }
  to {
    transform: rotate3d(1, -1, 0, 360deg);
  }
}
</style>
