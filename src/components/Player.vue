<template>
  <video ref="player"
         class="h-screen w-screen"
         :class="{ 'cursor-none': hideCursor }"
         @mousemove="showUi"
         @click="showUi();" />

  <div v-show="waiting"
       class="absolute h-20 left-[calc(50%-70px)] spinner top-[calc(50%-70px)] w-20" />

  <div class="absolute cursor-pointer left-[calc(50%-60px)] top-[calc(50%-60px)] transition-opacity"
       :style="{ opacity: `${uiOpacity}%` }">
    <ph-pause v-show="playing"
              :size="60"
              @click="showUi(); togglePlayback();" />

    <ph-play v-show="!playing"
             :size="60"
             @click="showUi(); togglePlayback();" />
  </div>

  <div class="absolute left-2 select-none top-1 transition-opacity"
       :style="{ opacity: `${uiOpacity}%` }">
    {{ src.src }}
  </div>

  <div class="absolute cursor-pointer h-[calc(100%-2rem)] right-2 text-xs top-2 transition-opacity"
       :style="{ opacity: `${uiOpacity}%` }"
       @click="showUi(); selectVolume($event);">
    <div class="bg-grey-600 h-full inline-block w-4"
         :style="{ height: `${((volume) * 100).toFixed(2)}%` }" />

    <span class="absolute font-bold right-2 select-none text-[10px] text-white top-1/2"
          :class="{
            'right-0': volume === 1,
            'right-[0.2rem]': volume < 1
          }">
      {{ (volume * 100).toFixed() }}
    </span>
  </div>

  <div class="absolute bg-white bottom-0 cursor-pointer h-4 left-0 text-xs transition-opacity w-full"
       :style="{ opacity: `${uiOpacity}%` }"
       @click="showUi(); seekToSelected($event);">
    <div class="bg-blue-400 h-full inline-block"
         :style="{ width: `${((currentTime / duration) * 100).toFixed(2)}%` }" />

    <span class="absolute bottom-0 font-bold right-1 select-none text-grey-900">
      {{ progress }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, watch } from '@vue/runtime-core';
import { useMediaControls, useMagicKeys } from '@vueuse/core';
import { ref } from 'vue';
import { PhPause, PhPlay } from 'phosphor-vue';
import { Source, Track } from '../@types/source';

export default defineComponent({
    name: 'Player',
    components: {
        PhPause,
        PhPlay
    },
    props: {
        sources: {
            type: Array as () => Source[],
            required: true
        }
    },
    setup(props) {
        const currentIndex = ref(0);
        const player = ref<HTMLVideoElement>();
        const muted = ref(false);
        const loop = ref(false);

        const uiOpacity = ref(0);
        const fadeInterval = ref(-1);
        const fadeTimeout = ref(-1);
        const hideCursor = ref(false);

        const src = computed<Source>(() => props.sources[currentIndex.value]);
        const tracks = computed<Track[]>(() => src.value.tracks);

        const progress = computed<string>(() => `${formatSeconds(currentTime.value)} / ${formatSeconds(duration.value)}`);

        const { currentTime, duration, ended, playing, volume, waiting } = useMediaControls(player, {
            muted,
            loop,
            src,
            tracks,
            poster: ''
        });

        const keys = useMagicKeys();

        function formatSeconds(time: number) {
            const remainder: number = (time % 60);

            return `${(time / 60).toFixed()} : ${remainder > 10 ? remainder.toFixed() : `0${remainder.toFixed()}`}`;
        }

        function togglePlayback(event?: Event) {
            event?.preventDefault();

            playing.value = !playing.value;
        }

        function toggleMute(event?: Event) {
            event?.preventDefault();

            muted.value = !muted.value;
        }

        function nextVideo(event?: Event) {
            event?.preventDefault();

            if (currentIndex.value < (props.sources.length - 1)) {
                currentIndex.value++;
            }
        }

        function previousVideo(event?: Event) {
            event?.preventDefault();

            if (currentIndex.value > 0) {
                currentIndex.value--;
            }
        }

        function showUi() {
            uiOpacity.value = 100;
        }

        function seekToSelected(event: Event) {
            const selectedPoint = (event as MouseEvent).pageX / window.innerWidth;

            currentTime.value = duration.value * selectedPoint;
        }

        function selectVolume(event: Event) {
            const position = (event as MouseEvent).pageY;

            let target = event.target as HTMLDivElement;
            let offsetTop = target.offsetTop;

            if (offsetTop === 0) {
                target = target.offsetParent as HTMLDivElement;
                offsetTop = target.offsetTop;
            }

            const offsetBottom = window.innerHeight - offsetTop - target.offsetHeight;

            let selectedPoint = 0;
            if (position / window.innerHeight < 0.2) {
                selectedPoint = (position - offsetTop) / window.innerHeight;
            }
            else if (position / window.innerHeight > 0.8) {
                selectedPoint = (position + offsetTop + offsetBottom) / window.innerHeight;
            }
            else {
                selectedPoint = position / window.innerHeight;
            }

            volume.value = (Math.round(Math.min(1, Math.max(0, selectedPoint)) * 100)) / 100;
        }

        watch(() => keys, () => {
            if (keys[' '].value) {
                togglePlayback();
            }

            if (keys['m'].value) {
                toggleMute();
            }

            if (keys['Ctrl+ArrowRight'].value) {
                nextVideo();
            }
            else if (keys['ArrowRight'].value) {
                currentTime.value += 5;
            }

            if (keys['Ctrl+ArrowLeft'].value) {
                previousVideo();
            }
            else if (keys['ArrowLeft'].value) {
                currentTime.value -= 5;
            }

            if (keys['ArrowUp'].value) {
                if (volume.value < 1) {
                    volume.value = Math.min((Math.round(volume.value * 100) / 100) + 0.05, 1);
                }
            }

            if (keys['ArrowDown'].value) {
                if (volume.value > 0) {
                    volume.value = Math.max((Math.round(volume.value * 100) / 100) - 0.05, 0);
                }
            }
        }, {
            deep: true
        });

        watch(() => currentIndex.value, (_newValue, oldValue) => {
            if (oldValue !== -1) {
                nextTick(() => player.value?.play());
            }
        });

        watch(() => ended.value, (newValue) => {
            if (newValue) {
                nextVideo();
            }
        });

        watch(() => uiOpacity.value, () => {
            if (uiOpacity.value <= 0 || uiOpacity.value === 100) {
                clearInterval(fadeInterval.value);

                fadeInterval.value = -1;
            }

            if (uiOpacity.value <= 0 ) {
                hideCursor.value = true;
            }
            else {
                hideCursor.value = false;
            }

            if (uiOpacity.value === 100) {
                clearTimeout(fadeTimeout.value);

                fadeTimeout.value = -1;

                fadeTimeout.value = setTimeout(() => {
                    fadeInterval.value = setInterval(() => {
                        uiOpacity.value -= 5;
                    }, 100);
                }, 2500);
            }
        });

        return {
            currentIndex,
            currentTime,
            duration,
            hideCursor,
            player,
            playing,
            progress,
            seekToSelected,
            selectVolume,
            showUi,
            src,
            togglePlayback,
            uiOpacity,
            volume,
            waiting
        };
    }
});
</script>
