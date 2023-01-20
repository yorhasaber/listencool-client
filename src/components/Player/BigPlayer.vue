<template>
  <transition name="up">
    <div v-if="showbigPlayer" class="bplayer"
         :style="'background-image: url('+HttpManager.attachImageUrl(songPic)+'?param=50y50)'">
      <div class="gray"/>
      <n-icon
          class="close"
          size="40"
          :component="KeyboardArrowDownFilled"
          @click="bigPlate"
      />
      <div class="all">
        <div class="left">
          <PlayerCover/>
        </div>

        <div
            class="right"
            @mouseenter="menuShow = true"
            @mouseleave="menuShow = false"
        >
          <transition name="lrc">
            <div class="lrcShow">
              <!--            <div class="data">-->

              <!--                            <div class="name text-hidden">-->
              <!--                              <span>{{ "暂无歌曲" }}</span>-->
              <!--                              <span>{{ 6666666666 }}</span>-->
              <!--                            </div>-->

              <!--              <div class="artists text-hidden">-->
              <!--                  <span class="artist">-->
              <!--                    <span> 艺术家名字 </span>-->
              <!--                  </span>-->

              <!--               </div>-->
              <!--            </div>-->

              <div class="lrc-all cover" style="">


                <div class="placeholder"></div>

                <!--                <div :class="lrcOnPlayIndex == index ? 'lrc on' : 'lrc'"-->
                <!--                     v-for="(item, index) in store.getters.lyric"-->
                <!--                     :key="item"-->
                <!--                     :id="'lrc' + index"-->
                <!--                >-->
                <!--                  <span class="lyric"> {{item.lyric}} </span>-->
                <!--                </div>-->

                <!--                <div :class="lrcOnPlayIndex == index ? 'lrc on' : 'lrc'"-->
                <!--                     v-for="(item, index) in lyricArr"-->
                <!--                     :key="item"-->
                <!--                     :id="'lrc' + index"-->
                <!--                >-->
                <!--                  <span class="lyric"> {{item[1]}} </span>-->
                <!--                </div>-->
                <div :class="lrcOnPlayIndex == index ? 'lrc on' : 'lrc'"
                     v-for="(item, index) in lyricArr"
                     :key="item"
                     :id="'lrc' + index"
                     @click="jumpTime(item.time)"
                >
                  <span class="lyric"> {{item.lyric}} </span>
                </div>

                <!--              <div :class="lrcOnPlayIndex == index ? 'lrc on' : 'lrc'"-->
                <!--                   v-for="(item, index) in store.getters.lyric"-->
                <!--                   :key="item"-->
                <!--                   :id="'lrc' + index"-->
                <!--                >-->
                <!--                <span class="lyric"> 66666666 </span>-->
                <!--              </div>-->

                <!--                <div class="lrc" id="lrc0" data-v-9fe64927="">-->
                <!--                  <span class="lyric" data-v-9fe64927=""> 作词 : 郑国江</span>-->
                <!--                </div>-->

                <!--                <div class="lrc" id="lrc1" data-v-9fe64927=""><span class="lyric" data-v-9fe64927=""> 作曲 : 齐秦</span>-->
                <!--                </div>-->

                <!--                <div class="lrc 0" id="lrc1" data-v-9fe64927=""><span class="lyric"-->
                <!--                                                                      data-v-9fe64927=""> 作曲 : 齐秦</span>-->
                <!--                </div>-->

                <!--                <div class="lrc on" id="lrc7" data-v-9fe64927=""><span class="lyric"-->
                <!--                                                                       data-v-9fe64927="">说再见 回头梦已远</span>-->
                <!--                </div>-->

                <!--                <div class="lrc" id="lrc1" data-v-9fe64927=""><span class="lyric" data-v-9fe64927=""> 作曲 : 齐秦</span>-->
                <!--                </div>-->

                <!--                <div class="lrc" id="lrc1" data-v-9fe64927=""><span class="lyric" data-v-9fe64927=""> 作曲 : 齐秦</span>-->
                <!--                </div>-->

                <div class="placeholder"></div>
              </div>
            </div>
          </transition>
        </div>


      </div>


    </div>


  </transition>
</template>

<script setup>
import {
  KeyboardArrowDownFilled,
  GTranslateFilled,
  MessageFilled,
} from "@vicons/material";
import {defineComponent, computed, onMounted, ref, onBeforeUnmount, watch} from "vue";
import {useStore} from "vuex";
import mixin from "@/mixins/mixin";
import PlayerCover from "@/components/Player/PlayerCover.vue";
import {HttpManager} from "@/api";
import { parseLyric } from "@/utils";

const store = useStore();

const {getSongTitle, playMusic} = mixin();

const showbigPlayer = computed(() => store.getters.showbigPlayer); // 是否显示侧边栏
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
const musicDuration = computed(() => store.getters.duration)
const bigPlate = () => {
  store.commit('setshowbigPlayer', false)
}

// const bigPlate = () => {
//   this.$store.commit("setshowbigPlayer", this.showbigPlayer(false));
// }

// lyricArr.value = parseLyric(currentPlayList.value[currentPlayIndex.value].lyric);

// 歌词数据
let lrcOnPlayIndex = ref(0);
let lrcInterval = ref(null);

// 歌词滚动
const lyricsScroll = () => {
  //对于歌词数据进行处理
  lyricArr.value = parseLyric(lyric.value);
  lrcInterval.value = setInterval(() => {
    // console.log(11);
    let oldIndex = lrcOnPlayIndex.value;
    //console.log(lyricArr.value)
    let index = lyricArr.value.findIndex(
        (v) => v.time > (store.getters.curTime)
    );
    if (index === -1) {
      // 如果没有找到合适的歌词，则返回最后一句歌词
      lrcOnPlayIndex.value = lyricArr.value.length - 1;
      store.lrcOnPlayIndex = lyricArr.value.length - 1;
    } else {
      lrcOnPlayIndex.value = index - 1;
      store.lrcOnPlayIndex = index - 1;
    }
    if (oldIndex !== lrcOnPlayIndex.value) {
      const el = document.getElementById(`lrc${lrcOnPlayIndex.value}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, 100);
};

//歌词的跳转
const jumpTime = (time) => {
  store.commit('setChangeTime', time)
};

onBeforeUnmount(() => {
  clearInterval(lrcInterval.value);
  lyricsScroll();
});

onMounted(()=>{
  // lyricsScroll();
})

// 监听页面是否打开
watch(
    () => store.getters.showbigPlayer,
    (val) => {
      if (val) {
        clearInterval(lrcInterval.value);
        lyricsScroll();
      } else {
        clearInterval(lrcInterval.value);
      }
    }
);
</script>

<style lang="scss" scoped>
.up-enter-active,
.up-leave-active {
  transform: translateY(0);
  transition: all 0.5s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.up-enter-from,
.up-leave-to {
  transform: translateY(100%);
}

.lrc-enter-active,
.lrc-leave-active {
  transition: opacity 0.3s ease;
}

.lrc-enter-active {
  transition-delay: 0.3s;
}

.lrc-enter-from,
.lrc-leave-to {
  opacity: 0;
}

.bplayer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: hidden;
  color: #ffffff;
  background-repeat: no-repeat;
  background-size: 150% 150%;
  background-position: center;
  display: flex;
  justify-content: center;

  &::after {
    // content: "";
    position: absolute;
    top: 0;
    left: calc(50% - 2px);
    height: 100%;
    width: 4px;
    background-color: red;
  }

  .gray {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000060;
    backdrop-filter: blur(80px);
    z-index: -1;
  }

  .close {
    position: absolute;
    top: 24px;
    right: 24px;
    opacity: 0.3;
    color: #fff;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      background-color: #ffffff20;
      transform: scale(1.05);
      opacity: 1;
    }

    &:active {
      transform: scale(1);
    }
  }

  .all {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.3s ease-in-out;

    &.noLrc {
      .left {
        transform: translateX(25vh);
      }

      @media (max-width: 768px) {
        .left {
          display: flex !important;
          transform: none;
          align-items: center;
        }
        .right {
          display: none !important;
        }
      }
    }

    @media (max-width: 768px) {
      .left {
        display: none !important;
      }
      .right {
        padding: 0 5vw;

        .lrcShow {
          .lrc-all {
            height: 70vh !important;
            padding-right: 0 !important;
          }

          .data,
          .menu {
            display: block !important;
            opacity: 1 !important;
          }
        }
      }
    }

    .left {
      flex: 1;
      padding: 0 4vw;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      transition: all 0.3s ease-in-out;
    }

    .right {
      flex: 1;
      height: 100%;
      // padding: 0 4vw;
      .lrcShow {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .data {
          padding: 0 20px;
          margin-bottom: 8px;

          .name {
            font-size: 3vh;
            -webkit-line-clamp: 2;
            padding-right: 26px;

            span {
              &:nth-of-type(2) {
                margin-left: 12px;
                font-size: 2.3vh;
                opacity: 0.6;
              }
            }
          }

          .artists {
            margin-top: 4px;
            opacity: 0.6;
            font-size: 1.8vh;

            .artist {
              span {
                &:nth-of-type(2) {
                  margin: 0 2px;
                }
              }
            }
          }
        }

        .lrc-all {
          padding-right: 14%;
          scrollbar-width: none;
          max-width: 460px;
          overflow: auto;
          mask: linear-gradient(
                  180deg,
                  hsla(0, 0%, 100%, 0) 0,
                  hsla(0, 0%, 100%, 0.6) 15%,
                  #fff 25%,
                  #fff 75%,
                  hsla(0, 0%, 100%, 0.6) 85%,
                  hsla(0, 0%, 100%, 0)
          );
          -webkit-mask: linear-gradient(
                  180deg,
                  hsla(0, 0%, 100%, 0) 0,
                  hsla(0, 0%, 100%, 0.6) 15%,
                  #fff 25%,
                  #fff 75%,
                  hsla(0, 0%, 100%, 0.6) 85%,
                  hsla(0, 0%, 100%, 0)
          );

          &::-webkit-scrollbar {
            display: none;
          }

          &.cover {
            height: 80vh;
          }

          &.record {
            height: 60vh;
          }

          .placeholder {
            width: 100%;
            height: 50%;
          }

          .lrc {
            opacity: 0.6;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            // margin-bottom: 4px;
            // padding: 12px 20px;
            margin-bottom: 0.8vh;
            padding: 1.8vh 3vh;
            border-radius: 8px;
            transition: all 0.3s;
            cursor: pointer;

            .lyric {
              transition: all 0.3s;
              font-size: 2.3vh;
            }

            .lyric-fy {
              margin-top: 2px;
              transition: all 0.3s;
              opacity: 0.8;
              font-size: 2vh;
            }

            &.on {
              opacity: 1;

              .lyric {
                font-weight: bold;
                font-size: 3vh;
              }

              .lyric-fy {
                font-weight: normal;
                font-size: 2.3vh;
              }
            }

            &:hover {
              @media (min-width: 768px) {
                background-color: #ffffff20;
              }
            }

            &:active {
              transform: scale(0.95);
            }
          }
        }

        .menu {
          opacity: 0;
          padding: 0 20px;
          margin-top: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          transition: all 0.3s;

          &.show {
            opacity: 1;
          }

          .n-icon {
            margin-right: 8px;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            opacity: 0.4;
            transition: all 0.3s;

            &:hover {
              background-color: #ffffff30;
            }

            &:active {
              transform: scale(0.95);
            }

            &.open {
              opacity: 1;
            }
          }
        }
      }
    }
  }

  .avBars {
    z-index: -1;
    position: absolute;
    bottom: 0;
    opacity: 0.6;
    -webkit-mask: linear-gradient(
            to right,
            hsla(0deg, 0%, 100%, 0) 0,
            hsla(0deg, 0%, 100%, 0.6) 15%,
            #fff 30%,
            #fff 70%,
            hsla(0deg, 0%, 100%, 0.6) 85%,
            hsla(0deg, 0%, 100%, 0)
    );
    mask: linear-gradient(
            to right,
            hsla(0deg, 0%, 100%, 0) 0,
            hsla(0deg, 0%, 100%, 0.6) 15%,
            #fff 30%,
            #fff 70%,
            hsla(0deg, 0%, 100%, 0.6) 85%,
            hsla(0deg, 0%, 100%, 0)
    );
  }
}
</style>
