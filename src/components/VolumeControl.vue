<template>
  <div
    @click="$emit('toggle-mute')"
    class="volume-control"
  >
    <span v-if="isMuted">🔇</span>
    <span
      v-else
      :class="{ 'sound-wave': isVideoPlaying && !isMuted }"
      >🔊</span
    >
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isMuted: boolean;
  isVideoPlaying: boolean;
}>();

defineEmits<{
  'toggle-mute': [];
}>();
</script>

<style lang="scss" scoped>
.volume-control {
  cursor: pointer;
  font-size: 24px;
  .sound-wave {
    display: inline-block;
    animation: sound-wave 0.5s ease-in-out infinite;
  }
}
@keyframes sound-wave {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
