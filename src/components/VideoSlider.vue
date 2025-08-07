<template>
  <div class="slider">
    <SplideSlider
      ref="sliderRef"
      :options
      :showClones
      :showInspect
      :showControls
      @click-slide="clickslidesSlide"
      @active-index-change="activeIndexChange"
    >
      <template
        v-for="(slide, index) in slides"
        :key="index"
        #[`slide-${index}`]
      >
        <div class="slide-panel">
          <div class="wrapper">
            <template v-if="_isImage(slide.imagePath)">
              <img
                :src="slide.imagePath"
                width="100%"
                height="auto"
              />
            </template>
            <template v-else-if="_isVideo(slide.imagePath)">
              <!-- 📌 poster属性でサムネイル画像を設定する -->
              <video
                ref="videoRef"
                :src="slide.imagePath"
                playsinline
                :muted="isMuted"
                :controls="showControls"
                preload="metadata"
                style="max-width: 100%; max-height: 100%; height: 100%"
                :poster="slide.poster"
                @play="onVideoEvent('play', index, $event)"
                @pause="onVideoEvent('pause', index, $event)"
                @ended="onVideoEvent('ended', index, $event)"
                @loadedmetadata="onVideoEvent('loadedmetadata', index, $event)"
                @canplay="onVideoEvent('canplay', index, $event)"
                @canplaythrough="onVideoEvent('canplaythrough', index, $event)"
                @seeking="onVideoEvent('seeking', index, $event)"
                @seeked="onVideoEvent('seeked', index, $event)"
                @waiting="onVideoEvent('waiting', index, $event)"
                @stalled="onVideoEvent('stalled', index, $event)"
                @suspend="onVideoEvent('suspend', index, $event)"
                @abort="onVideoEvent('abort', index, $event)"
                @error="onVideoEvent('error', index, $event)"
                @durationchange="onVideoEvent('durationchange', index, $event)"
                @volumechange="onVideoEvent('volumechange', index, $event)"
                @progress="onVideoEvent('progress', index, $event)"
                @ratechange="onVideoEvent('ratechange', index, $event)"
                @playing="onVideoEvent('playing', index, $event)"
                @loadeddata="onVideoEvent('loadeddata', index, $event)"
                @emptied="onVideoEvent('emptied', index, $event)"
                @encrypted="onVideoEvent('encrypted', index, $event)"
              />
            </template>
          </div>
        </div>
      </template>
    </SplideSlider>
  </div>
</template>

<script lang="ts" setup>
import type SplideSlider from '@/components/SplideSlider.vue';
import type { Options } from '@splidejs/splide';

defineProps<{
  slides: { imagePath: string; poster?: string }[];
  isMuted: boolean;
  showControls: boolean;
  showClones: boolean;
  showInspect: boolean;
}>();

const emits = defineEmits<{
  'click-slide': [index: number, cloneIndex?: number];
  'active-index-change': [index: number];
  'video-event': [payload: { type: string; index: number; event: Event }];
  'autoplay-change': [playing: boolean];
  'video-mute-change': [isMuted: boolean];
}>();

const clickslidesSlide = (index: number, cloneIndex?: number) => emits('click-slide', index, cloneIndex);
const activeIndexChange = (index: number) => emits('active-index-change', index);
const sliderEl = useTemplateRef<InstanceType<typeof SplideSlider>>('sliderRef');
const videoEl = useTemplateRef<HTMLVideoElement>('videoRef');

const options: Options = {
  type: 'loop',
  autoWidth: true,
  focus: 'center',
  start: 0,
  speed: 700,
  gap: 16,
  snap: true,
  trimSpace: true,
  interval: 1000,
  autoplay: true,
  clones: 10,
  waitForTransition: true,
  flickPower: 200
};

const onVideoEvent = (type: string, index: number, event: Event) => {
  emits('video-event', { type, index, event });
  if (type === 'volumechange') emits('video-mute-change', (event.target as HTMLVideoElement).muted);
};

const _isImage = (path: string): boolean => /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(path);
const _isVideo = (path: string): boolean => /\.(mp4|webm|ogg|mov|avi|m4v)$/i.test(path);

defineExpose({
  playAutoplay: () => {
    sliderEl.value?.playAutoplay?.();
    emits('autoplay-change', true);
  },
  pauseAutoplay: () => {
    sliderEl.value?.pauseAutoplay?.();
    emits('autoplay-change', false);
  },
  videoPlay: async () => {
    if (!videoEl.value) return;
    try {
      // 📌 video要素内に動画を操作するメソッドが提供されているのでそれを使う
      await videoEl.value.play();
    } catch (error) {
      if (error instanceof Error) return error.message;
    }
  },
  videoPause: () => {
    if (!videoEl.value) return;
    videoEl.value.pause();
  },
  videoReset: () => {
    if (!videoEl.value) return;
    videoEl.value.pause();
    // 📌 動画再生後にサムネイル画像を表示するにはこれが必要
    videoEl.value.currentTime = 0;
    videoEl.value.load();
  }
});
</script>

<style lang="scss" scoped>
.slider {
  width: 100%;
  height: 220px;
  .slide-panel {
    overflow: hidden;
    width: min(320px, calc(100vw * (320 / 400)));
    aspect-ratio: 16/9;
    box-shadow: 3px 3px 10px 0px rgba(37, 16, 0, 0.5);
    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #000;
    }
  }
}
</style>
