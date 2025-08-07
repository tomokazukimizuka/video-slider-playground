<template>
  <div
    @click="$emit('toggle-inspect')"
    class="inspect-control"
    :class="{ active: showInspect }"
  >
    <span
      class="icon"
      :class="{ disabled: !showInspect }"
      >🔬</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showInspect: boolean;
}>();

defineEmits<{
  'toggle-inspect': [];
}>();
</script>

<style lang="scss" scoped>
.inspect-control {
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
      animation: pulse 0.8s linear infinite;
    }
  }
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
