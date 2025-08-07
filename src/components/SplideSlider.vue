<template>
  <Splide
    ref="sliderRef"
    :key="splideKey"
    :hasTrack="false"
    :options="_options"
    @splide:click="click"
    @splide:drag="drag"
    @splide:move="onMove"
    @splide:moved="onMoved"
  >
    <div class="track-wrapper">
      <div class="splide__arrows arrows">
        <button
          class="splide__arrow splide__arrow--prev arrow prev"
          @click="clickNavigation"
        >
          <
        </button>
        <button
          class="splide__arrow splide__arrow--next arrow next"
          @click="clickNavigation"
        >
          >
        </button>
      </div>

      <SplideTrack>
        <SplideSlide
          v-for="n in length"
          :key="n"
          :class="{ 'show-clones': showClones, 'show-inspect': showInspect }"
          v-slot="{ isActive }"
        >
          <div class="slide-content-wrapper">
            <slot :name="`${slideSlotName}${n - 1}`"></slot>
            <div
              class="slide-overlay"
              :class="{
                'is-active': isActive,
                'is-next-active': nextActiveIndex === n - 1,
                'is-prev-active': prevActiveIndex === n - 1
              }"
            ></div>
          </div>
        </SplideSlide>
      </SplideTrack>
    </div>
    <ul class="splide__pagination pagination"></ul>
  </Splide>
</template>

<script lang="ts" setup>
import type { Splide as SplideType, Options, SlideComponent } from '@splidejs/splide';
//@ts-ignore
import { Splide, SplideTrack, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css/core';

const { options = { interval: 1000 }, showClones = false, showInspect = false, showControls = false } = defineProps<{ options?: Options; showClones?: boolean; showInspect?: boolean; showControls?: boolean }>();
const _options: Ref<Options> = ref({ ...options, classes: { page: 'bullet' } });

const emits = defineEmits<{
  'click-slide': [index: number, cloneIndex?: number];
  'active-index-change': [index: number];
}>();

// オートプレイ中にこの2つのフラグを変えるとスライドがフリーズするのでインスタンスを作り直す
const splideKey = ref(0);
const reloadSlides = () => splideKey.value++;
watch([() => showClones, () => showInspect, () => showControls], reloadSlides);

//splideのインスタンス
const sliderEl = useTemplateRef<{ splide: SplideType } | undefined>('sliderRef');

const nextActiveIndex = ref<number | null>(null);
const prevActiveIndex = ref<number | null>(null);

const slideSlotName: string = 'slide-';
const length: ComputedRef<number> = computed(() => Object.keys(useSlots()).filter((key) => key.startsWith(slideSlotName)).length);

const isPaused: Ref<boolean> = ref(false);

const pause = () => {
  if (isPaused.value) return;
  sliderEl!.value!.splide.Components.Autoplay.pause();
  isPaused.value = true;
};
const play = () => {
  if (!isPaused.value) return;
  sliderEl!.value!.splide.Components.Autoplay.play();
  isPaused.value = false;
};

const click = (_: SplideType, slide: SlideComponent) => {
  emits('click-slide', !slide.isClone ? slide.index : slide.slideIndex, slide.slideIndex);
  // pause();
};

// スライドが切り替わる直前のイベントリスナー
// 📌 activeとinactiveはなぜか一度に5回発生して且つタイミングがアニメーション終了後で遅いのでmoveでactiveIndexの変化を通知している
const onMove = (splide: SplideType, newIndex: number, prevIndex: number, destIndex: number) => {
  // 直前に次のスライドのオーバーレイを消すためのインデックスをセット
  nextActiveIndex.value = newIndex;
  prevActiveIndex.value = prevIndex;
  emits('active-index-change', newIndex);
};

// スライドが切り替わった直後のイベントリスナー
const onMoved = (splide: SplideType, newIndex: number, prevIndex: number, destIndex: number) => {
  // スライド切り替え後にリセット
  nextActiveIndex.value = null;
  prevActiveIndex.value = null;
};

const clickNavigation = () => pause();
const drag = () => pause();

defineExpose({
  playAutoplay: play,
  pauseAutoplay: pause
});
</script>

<style lang="scss">
.track-wrapper {
  position: relative;
  .arrows {
    position: absolute;
    bottom: -15px;
    z-index: 1;
    width: 100%;
    pointer-events: none;
    transform: translateY(-50%);

    .arrow {
      position: absolute;
      pointer-events: auto;
    }

    .prev {
      right: calc(50% + 112px);
    }
    .next {
      left: calc(50% + 112px);
    }
    .prev,
    .next {
      width: 30px;
      height: 30px;
      background: #00379e;
      border-radius: 35%;
      color: #fff0d1;
      font-weight: bold;
    }
  }
}

.pagination {
  display: flex;
  gap: 24px;
  list-style: none;
  height: max-content;
  font-size: 0;
  padding-top: 20px;
  .bullet {
    width: 20px;
    height: 20px;
    background: #00379e;
    border-radius: 35%;
    &.is-active {
      background: #fff0d1;
    }
  }
}
.splide {
  opacity: 0;
  transition: opacity 0.2s ease;
  &:not(.is-overflow) {
    .pagination {
      display: flex;
    }
  }
  &.is-initialized {
    opacity: 1;
  }
}
.slide-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  background: linear-gradient(
    to bottom,
    //
    rgba(37, 16, 0, 0.8) 0%,
    rgba(37, 16, 0, 0.75) 30%,
    rgba(37, 16, 0, 0.7) 70%,
    rgba(37, 16, 0, 0.65) 100%
  );
  opacity: 1;
}
.splide__slide {
  cursor: pointer;
  // アクティブなスライドのオーバーレイを消す クローンにもis-activeは付くので、クローンクラスを持っている場合は除外する
  &:not(.splide__slide--clone) {
    &.is-active {
      .slide-overlay {
        opacity: 0;
      }
    }
    .slide-overlay {
      &.is-active,
      &.is-next-active {
        opacity: 0;
      }
      &.is-prev-active {
        opacity: 1;
      }
    }
  }
}

.show-clones.splide__slide--clone {
  &::after {
    content: '🧬clone';
    font-size: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-weight: bold;
    color: #fff;
    background: rgba(147, 75, 195, 0.3);
    z-index: 10;
    text-shadow: 0px 0px 10px rgba(147, 75, 195, 1);
    letter-spacing: 0.08em;
    pointer-events: none;
  }
}
.show-inspect.splide__slide {
  &.is-prev {
    &::before {
      content: '🍂prev';
      white-space: nowrap;
      font-size: 2rem;
      position: absolute;
      top: -6px;
      left: -4px;
      font-weight: bold;
      color: #fff;
      z-index: 10;
      text-shadow: 0px 0px 10px rgb(195, 93, 75);
      letter-spacing: 0.08em;
    }
  }

  &.is-active {
    &::before {
      content: '🌸active';
      font-size: 2rem;
      white-space: nowrap;
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: bold;
      color: #fff;
      z-index: 10;
      text-shadow: 0px 0px 10px rgb(195, 183, 75);
      letter-spacing: 0.08em;
    }
  }

  &.is-next {
    &::before {
      content: '🍃next';
      white-space: nowrap;
      font-size: 2rem;
      position: absolute;
      top: -6px;
      right: 2px;
      font-weight: bold;
      color: #fff;
      z-index: 10;
      text-shadow: 0px 0px 10px rgb(75, 195, 147);
      letter-spacing: 0.08em;
    }
  }
}
.splide__track {
  overflow: visible;
}
</style>
