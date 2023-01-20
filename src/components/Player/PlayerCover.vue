<template>
  <div class="cover">
    <div class="pic">
      <img
          class="album"
          :src="HttpManager.attachImageUrl(songPic)"
          alt="cover"
      />
    </div>
        <div class="control">
          <div class="data">
            <div class="desc">
              <span class="name text-hidden">
               {{ songTitle }}
              </span>
              <div  class="message">
               <span>
                 {{singerName}}
               </span>
                <span
                  class="ablum text-hidden"
                  @click=""
                >
                  {{ songTitle}}
                </span>
              </div>
            </div>
            <n-icon
              class="like"
              size="20"
              :component="FavoriteBorderRound"
              @click.stop=""
            />
          </div>
          <div class="time">
            <span>{{ startTime }}</span>
            <n-slider
              v-model:value="nowTime"
              class="progress"
              :step="0.01"
              @update:value="changeTime"

            />
            <span>{{ endTime }}</span>
          </div>
          <div class="buttons">
            <n-icon
              :style="null"
              size="16"
              class="mode"
              :component="PlayCycle"
              @click=""
            />
            <n-icon
              class="prev"
              size="30"
              :component="SkipPreviousRound"
              @click.stop=""
            />
            <div class="play-state">
              <n-icon
                size="50"
                :component="store.getters.isPlay ? PauseRound : PlayArrowRound"
                @click.stop="bigPlate"
              />
            </div>
            <n-icon
              class="next"
              size="30"
              :component="SkipNextRound"
              @click.stop=""
            />
            <n-icon
              class="comment"
              size="18"
              :component="MessageFilled"
              @click="routerJump( `${store.getters.songId}`)"
            />
          </div>
        </div>
  </div>
</template>

<script setup>
import {
  PlayArrowRound,
  PauseRound,
  SkipNextRound,
  SkipPreviousRound,
  MessageFilled,
  ThumbDownRound,
  FavoriteBorderRound,
  FavoriteRound,
} from "@vicons/material";

import { PlayCycle, PlayOnce, ShuffleOne } from "@icon-park/vue-next";

import {defineComponent, computed, onMounted, ref,watch} from "vue";
import { useRouter } from "vue-router";
import {useStore} from "vuex";
import mixin from "@/mixins/mixin";
import { HttpManager } from "@/api";

import {formatSeconds, parseLyric} from "@/utils";
//import {RouterName} from "@/enums/index.js";
//import {RouterName} from "@/enums/index.js";
 //import {RouterName} from "@/enums/index.js";
// import {RouterName} from "@/enums/index.js";

const store = useStore();
const router = useRouter();
const {routerManager, playMusic, checkStatus, downloadMusic} = mixin();





const lrcTop = ref("80px"); // 歌词滑动
const lyricArr = ref([]); // 当前歌曲的歌词
const songId = computed(() => store.getters.songId); // 歌曲ID
const lyric = computed(() => store.getters.lyric); // 歌词
const currentPlayList = computed(() => store.getters.currentPlayList); // 存放的音乐
const currentPlayIndex = computed(() => store.getters.currentPlayIndex); // 当前歌曲在歌曲列表的位置
const curTime = computed(() => store.getters.curTime);
const songTitle = computed(() => store.getters.songTitle); // 歌名
const singerName = computed(() => store.getters.singerName); // 歌手名
const songPic = computed(() => store.getters.songPic); // 歌曲图片

//
const startTime =computed(() =>formatSeconds(store.getters.curTime) );




//const startTime =formatSeconds(store.getters.curTime);
// const endTime = computed(() => store.getters.duration);

//歌曲进度条时间
const endTime = formatSeconds(store.getters.duration)
const nowTime=computed(() =>(store.getters.curTime /store.getters.duration)*100)

const bigPlate = () => {
  store.commit("setIsPlay", store.getters.isPlay ? false : true);
}

async function changeTime() {
 // store.commit("setChangeTime", store.getters.duration =nowTime);
 //  store.commit('setChangeTime', nowTime)
}

async function getRank() {
  routerManager(useRouterName.Lyric, {path: `${useRouterName.Lyric}/${this.songId}`});
}

//页面跳转
const routerJump = (url) => {
  console.log(url)
  store.commit("setshowbigPlayer", false)

  router.push(`/lyric/${url}`);

  // router.push({
  //   path: `lyric/${url}`,
  // });

};


</script>

<style lang="scss" scoped>
.cover {
  .pic {
    width: 50vh;
    height: 50vh;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 40px 14px rgb(0 0 0 / 20%);
    .album {
      width: 100%;
      height: 100%;
    }
  }
  .control {
    margin-top: 24px;
    .data {
      width: 50vh;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .desc {
        width: 100%;
        padding-right: 4px;
        .name {
          font-size: 3vh;
          font-weight: bold;
          -webkit-line-clamp: 2;
        }
        .message {
          cursor: pointer;
          display: flex;
          align-items: center;
          margin: 2px 0 6px;
          font-size: 2vh;
          width: 100%;
          color: #ffffffcc;
          .ablum {
            transition: all 0.3s;
            &:hover {
              color: #fff;
            }
            &::before {
              content: "·";
              margin: 0 4px;
            }
          }
          .artists {
            flex-wrap: nowrap;
            :deep(.artist) {
              display: inline-block;
              white-space: nowrap;
              .name {
                color: #ffffffcc;
                &:hover {
                  color: #fff;
                }
              }
            }
          }
        }
      }
      .like {
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          background-color: #ffffff26;
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
    .time {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        opacity: 0.8;
      }
      .progress {
        margin: 0 12px;
        --n-handle-size: 12px;
        --n-fill-color: #fff;
        --n-fill-color-hover: #fff;
        --n-rail-color: #ffffff20;
        --n-rail-color-hover: #ffffff30;
      }
    }
    .buttons {
      margin-top: 26px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .play-state {
        display: flex;
        align-items: center;
        justify-content: center;
        .n-icon {
          padding: 0;
        }
      }
      .mode,
      .comment {
        &.n-icon {
          opacity: 0.8;
          margin: 0 6px;
          padding: 8px;
        }
      }
      .dislike {
        padding: 10px !important;
      }
      .n-icon {
        margin: 0 4px;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: all 0.3s;
        &:hover {
          background-color: #ffffff4d;
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
}
</style>
