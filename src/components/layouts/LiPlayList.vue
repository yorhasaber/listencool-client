<template>
  <main>
    <transition name="aside-fade">
      <n-card
          title="播放列表"
          closable
          class="playlistModel"
          v-show="showAside"
          :header-style="{
        padding: '12px 16px',
        fontSize: '16px',
        backgroundColor: 'rgb(131,151,224)',
        borderRadius: '8px',
      }"
          :content-style="{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
      }"
          @close=""
          @click.stop
      >
        <n-scrollbar>
          <n-card
              hoverable
              class="songs"
              :id="'playlist' + index"
              :content-style="{
            padding: '8px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }"
              v-for="(item, index) in currentPlayList"
              :key="item"
              @click.stop="playMusic({
            id: item.id,
            url: item.url,
            pic: item.pic,
            index: index,
            name: item.name,
            lyric: item.lyric,
            currentSongList: currentPlayList,
          })"
          >
            <div class="left">
              <div class="num">{{ index + 1 }}</div>
            </div>
            <div class="right">
              <div class="name text-hidden">{{ getSongTitle(item.name) }}</div>
              <AllArtists class="text-hidden" :artistsData="item.artist" />
              <n-icon
                  class="remove"
                  @click.stop=""
              />
            </div>
          </n-card>
        </n-scrollbar>
      </n-card>
    </transition>
  </main>


</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, computed, onMounted } from "vue";
import { useStore } from "vuex";
import mixin from "@/mixins/mixin";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { getSongTitle, playMusic } = mixin();

    const songId = computed(() => store.getters.songId); // 音乐 ID
    const currentPlayList = computed(() => store.getters.currentPlayList); // 当前播放
    const showAside = computed(() => store.getters.showAside); // 是否显示侧边栏

    onMounted(() => {
      document.addEventListener('click', () => {
        proxy.$store.commit('setShowAside', false)
      }, true)
    })




    return {
      songId,
      currentPlayList,
      showAside,
      getSongTitle,
      playMusic,
    };
  },
});
</script>

<style lang="scss" scoped>


.playlistModel {
  position: absolute;
  bottom: 76px;
  min-width: 300px;
  right: 0;
  border-radius: 8px;
  border-top: none;
  box-shadow: var(--n-box-shadow);
  :deep(.n-card__content) {
    .n-scrollbar {
      max-height: 70vh;
      .n-scrollbar-content {
        padding: 12px;
        .songs {
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.3s;
          &:nth-last-of-type(1) {
            margin-bottom: 0;
          }
          &:active {
            transform: scale(0.98);
          }
          &:hover {
            .n-card__content {
              .right {
                .remove {
                  opacity: 1;
                }
              }
            }
          }
          &.play {
            color: rgb(51,93,233);
            background-color: rgb(50, 87, 208);
            border-color: rgb(51,93,233);
          }

          .left {
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
          }
          .right {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding-right: 42px;
            .name {
              pointer-events: none;
            }
            .artists {
              opacity: 0.8;
              font-size: 13px;
              pointer-events: none;
            }
            .remove {
              position: absolute;
              border-radius: 8px;
              right: 0;
              font-size: 22px;
              opacity: 0;
              transition: all 0.3s;
              color: #999;
              padding: 6px;
              &:hover {
                color: rgb(51,93,233);
                background-color: var(--n-border-color);
              }
            }
          }
        }
      }
    }
    .n-scrollbar-rail {
      width: 0;
    }
  }
}

main {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  //padding: 24px 10vw 96px 10vw;
  padding:2px 5vw 54px;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}
</style>
