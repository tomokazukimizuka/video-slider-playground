<template>
  <div class="wrapper">
    <div class="slider-panel">
      <VideoSlider
        ref="videoSliderRef"
        :slides
        :isMuted
        :showControls
        :showClones
        :showInspect
        @click-slide="clickSlide"
        @active-index-change="onActiveIndexChange"
        @video-event="onVideoEvent"
        @autoplay-change="onAutoplayChange"
        @video-mute-change="onVideoMuteChange"
      />
    </div>
    <div class="control-panel">
      <div class="status-panel">
        <VideoStatus :isVideoPlaying />
        <VolumeControl
          :isMuted
          :isVideoPlaying
          @toggle-mute="toggleMute"
        />
        <ControlsControl
          :showControls
          @toggle-controls="toggleControls"
        />
        <SliderControl
          :isAutoplaying
          @toggle-autoplay="toggleAutoplay"
        />
        <ClonesControl
          :showClones
          @toggle-clones="toggleClones"
        />
        <InspectControl
          :showInspect
          @toggle-inspect="toggleInspect"
        />
      </div>
      <div class="log-area">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-item"
        >
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type VideoSlider from '@/components/VideoSlider.vue';

const image1 = './1.png';
const image2 = './2.png';
const image3 = './3.png';
const video1 = './video1.mp4';
const thumbnail = './thumbnail.png';

const slides = [{ imagePath: image1 }, { imagePath: image2 }, { imagePath: image3 }, { imagePath: video1, poster: thumbnail }];

const activeIndex = ref(0);
const isVideoPlaying = ref(false);
const isAutoplaying = ref(true);
const isMuted = ref(true);
const toggleMute = () => (isMuted.value = !isMuted.value);

const showControls = ref(false);
const toggleControls = () => {
  showControls.value = !showControls.value;
  addLog(`🕹️${showControls.value ? '動画スライドにコントロールを表示しました' : '動画スライドのコントロールを非表示にしました'}`);
};

const showClones = ref(false);
const toggleClones = () => {
  showClones.value = !showClones.value;
  addLog(`🧬${showClones.value ? 'クローンスライドが可視化されました' : 'クローンスライドの可視化を解除しました'}`);
};

const showInspect = ref(false);
const toggleInspect = () => {
  showInspect.value = !showInspect.value;
  addLog(`🔬${showInspect.value ? 'スライドの状態が可視化されました' : 'スライドの状態可視化を解除しました'}`);
};

const clickSlide = async (index: number, cloneIndex?: number) => {
  if (cloneIndex === -1) {
    addLog(`🖱️✅スライドがクリックされました index: ${index}`);
  } else {
    addLog(`🖱️🧬クローンスライドがクリックされました cloneIndex: ${cloneIndex}`);
  }
  // 動画スライドがクリックされた場合 動画スライドがアクティブな場合 且つ クローンスライドではない場合
  if (index === video1Index && activeIndex.value === video1Index && cloneIndex === -1) {
    if (isVideoPlaying.value) {
      // 再生中なら一時停止
      videoSliderEl.value?.videoPause();
    } else {
      // 一時停止中なら再生
      const errorMessage: string | undefined = await videoSliderEl.value?.videoPlay();
      if (typeof errorMessage === 'string') addLog(`🚨自動再生がブロックされました ${errorMessage}`);
    }
  }
};

const onActiveIndexChange = (index: number) => (activeIndex.value = index);

const onAutoplayChange = (playing: boolean) => {
  if (isAutoplaying.value !== playing) {
    isAutoplaying.value = playing;
    addLog(`🖼️${isAutoplaying.value ? '▶️オートスライドが再開されました' : '⏸️オートスライドが停止されました'}`);
  } else {
    isAutoplaying.value = playing;
  }
};

const onVideoEvent = (payload: { type: string; index: number; event: Event }) => {
  switch (payload.type) {
    case 'playing':
      addLog(`🎥▶️動画が再生されました`);
      isVideoPlaying.value = true;
      break;
    case 'pause':
      addLog(`🎥⏸️動画が一時停止されました`);
      isVideoPlaying.value = false;
      break;
    case 'ended':
      addLog(`🎥🛑動画の再生が終了しました`);
      videoSliderEl.value?.playAutoplay();
      isVideoPlaying.value = false;
      break;
    case 'abort':
      // addLog(`❌動画の再生が中止されました`);
      isVideoPlaying.value = false;
      break;
    default:
      // addLog(`🎬videoイベントが発生しました type: ${payload.type}`);
      break;
  }
};

let isFirstMuteChange = true;
const onVideoMuteChange = (muted: boolean) => {
  isMuted.value = muted;
  if (isFirstMuteChange) {
    isFirstMuteChange = false;
    return;
  }
  addLog(`${muted ? '🔇動画の音声をOFFにしました' : '🔊動画の音声をONにしました'}`);
};

const toggleAutoplay = () => {
  isAutoplaying.value = !isAutoplaying.value;
  if (isAutoplaying.value) {
    videoSliderEl.value?.playAutoplay();
    addLog('🖼️▶️オートスライドが再開されました');
  } else {
    videoSliderEl.value?.pauseAutoplay();
    addLog('🖼️⏸️オートスライドが停止されました');
  }
};

const videoSliderEl = useTemplateRef<InstanceType<typeof VideoSlider>>('videoSliderRef');

const video1Index = slides.findIndex((s) => s.imagePath === video1);
watch(activeIndex, async (newValue, oldValue) => {
  if (!videoSliderEl.value) return;
  if (newValue === video1Index) {
    await nextTick();
    videoSliderEl.value.pauseAutoplay();
    const errorMessage: string | undefined = await videoSliderEl.value?.videoPlay();
    if (typeof errorMessage === 'string') addLog(`🚨自動再生がブロックされました ${errorMessage}`);
  } else if (oldValue === video1Index) {
    videoSliderEl.value.videoReset();
    videoSliderEl.value.playAutoplay();
  }
});

const logs = ref<string[]>([]);
const addLog = (message: string) => {
  logs.value.unshift(message);
  if (logs.value.length > 15) logs.value.pop();
};

addLog('📢ここにログが表示されます');
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  .slider-panel {
    height: 300px;
    min-height: 300px;
    padding-top: 50px;
    background: linear-gradient(to bottom, #f0f8ff, #a0d8ef, #87ceeb, #00bfff, #1e90ff, #4682b4);
  }
  .control-panel {
    padding: 20px 30px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    gap: 20px;
    .status-panel {
      display: flex;
      gap: 12px;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 8px 12px;
      border-radius: 15px;
      align-items: center;
      justify-content: center;
    }

    .log-area {
      min-height: 220px;
      max-height: 220px;
      max-width: 500px;
      width: 100%;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      padding: 8px;
      color: #333;
      font-size: 12px;
      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        background: #ebd8b7;
        border-radius: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        border: 2px solid rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      .log-item {
        padding: 2px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
