<template>
  <div class="record">
    <img
      :class="store.getters.isPlay ? 'pointer play' : 'pointer'"
      src="/images/ico/pointer.png"
      alt="pointer"
    />
    <div
      class="pic"
      :style="{animationPlayState: store.getters.isPlay ? 'running' : 'paused'}"
    >
      <img
        class="album"
        :src="HttpManager.attachImageUrl(songPic)"
        alt="cover"
      />
    </div>
    <div class="control">
      <n-icon
        class="prev"
        size="36"
        :component="SkipPreviousRound"
      />
      <div class="play-state">
        <n-icon
            v-show="!store.getters.isPlay"
            size="58"
            :component="PlayCircleFilled"
            @click.stop="bigPlate"
        />
        <n-icon
            v-show="store.getters.isPlay"
            size="58"
            :component="PauseCircleFilled"
            @click.stop="bigPlate"
        />
      </div>
      <n-icon
        class="next"
        size="36"
        :component="SkipNextRound"
      />
    </div>
  </div>
</template>

<script setup>
import {
  PlayCircleFilled,
  PauseCircleFilled,
  SkipNextRound,
  SkipPreviousRound,
} from "@vicons/material";

import {useStore} from "vuex";
const songPic = computed(() => store.getters.songPic);
import { HttpManager } from "@/api";
import {computed} from "vue";
const store = useStore();


const bigPlate = () => {
  store.commit("setIsPlay", !store.getters.isPlay);
}



</script>

<style lang="scss" scoped>
.record {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    .control {
      opacity: 1;
    }
  }
  .pointer {
    position: absolute;
    width: 14vh;
    left: calc(50% - 1.8vh);
    top: -14vh;
    transform: rotate(-20deg);
    transform-origin: 1.8vh 1.8vh;
    z-index: 1;
    transition: all 0.3s;
    &.play {
      transform: rotate(0);
    }
  }
  .pic {
    animation: rotate 18s linear infinite;
    border-radius: 50%;
    border: 1vh solid #ffffff30;
    background: linear-gradient(black 0%, transparent, black 98%),
      radial-gradient(
        #000 52%,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555,
        #000,
        #555
      );
    background-clip: content-box;
    width: 40vh;
    height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .album {
      border: 1vh solid #ffffff40;
      border-radius: 50%;
      width: 70%;
      height: 70%;
      object-fit: cover;
    }
  }
  .control {
    opacity: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 68%;
    height: 68%;
    border-radius: 50%;
    background-color: #00000050;
    backdrop-filter: blur(20px);
    transition: all 0.5s;
    .play-state {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .n-icon {
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
      }
      &:active {
        transform: scale(1);
      }
    }
  }
}

// 旋转动画
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
