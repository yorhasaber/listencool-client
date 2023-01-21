<template>

<!--  <div class="song-container">-->
<!--    <el-image class="song-pic" fit="contain" :src="attachImageUrl(songPic)" />-->
<!--    <ul class="song-info">-->
<!--      <li>歌手：{{ singerName }}</li>-->
<!--      <li>歌曲：{{ songTitle }}</li>-->
<!--    </ul>-->
<!--  </div>-->
<!--  <div class="container">-->
<!--    <div class="lyric-container">-->
<!--      <comment :playId="songId" :type="0"></comment>-->
<!--    </div>-->
<!--  </div>-->
<main>
  <div class="comment">
    <div class="title" >
      <span class="key">全部评论</span>
      <n-card class="song">

        <div class="smallSongData">
          <n-avatar
              class="pic"
              :size="59"
              :src="attachImageUrl(songPic)"
              fallback-src="/images/pic/default.png"/>

          <div class="text">
            <n-text class="text-hidden"
                    depth="2">{{ songTitle }}</n-text>
          </div>

          <div class="name">
            <n-text class="text-hidden"
                    depth="2">{{ singerName }}</n-text>
          </div>

          </div>

<!--        <el-image class="song-pic" fit="contain" :src="attachImageUrl(songPic)" />-->
<!--        <ul class="song-info">-->
<!--          <li>歌手：{{ singerName }}</li>-->
<!--          <li>歌曲：{{ songTitle }}</li>-->
<!--        </ul>-->
      </n-card>
    </div>
    <div class="commentData" >
      <div class="hotComments" >
        <n-h6 prefix="bar"> 热门评论 </n-h6>
        <div class="content">
          <comment :playId="songId" :type="0"></comment>
        </div>
      </div>
    </div>
  </div>
</main>



</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import Comment from "@/components/Comment.vue";
import { parseLyric } from "@/utils";
import { HttpManager } from "@/api";

export default defineComponent({
  components: {
    Comment,
  },
  setup() {
    const store = useStore();

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
    watch(songId, () => {
      lyricArr.value = parseLyric(currentPlayList.value[currentPlayIndex.value].lyric);
    });
    // 处理歌词位置及颜色
    watch(curTime, () => {
      if (lyricArr.value.length !== 0) {
        for (let i = 0; i < lyricArr.value.length; i++) {
          if (curTime.value >= lyricArr.value[i][0]) {
            for (let j = 0; j < lyricArr.value.length; j++) {
              (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[j].style.color = "#000";
              (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[j].style.fontSize = "14px";
            }
            if (i >= 0) {
              lrcTop.value = -i * 30 + 50 + "px";
              (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[i].style.color = "#95d2f6";
              (document.querySelectorAll(".has-lyric li") as NodeListOf<HTMLElement>)[i].style.fontSize = "18px";
            }
          }
        }
      }
    });

    lyricArr.value = lyric.value ? parseLyric(lyric.value) : [];

    return {
      songPic,
      singerName,
      songTitle,
      lrcTop,
      lyricArr,
      songId,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

//.smallSongData{
//
//  flex-direction: row;
//  align-items: center;
//}

.smallSongData {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.pic {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.text {
  font-weight: bold;
  font-size: 30px;
  text-align: center;
}

.name {
  font-weight: bold;
  color: black;
  text-align: center;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .smallSongData {
    flex-wrap: wrap;
  }
  .name, .text {
    width: 100%;
    text-align: center;
  }
}



.song-container {
  position: fixed;
  top: 120px;
  left: 50px;
  display: flex;
  flex-direction: column;

  .song-pic {
    height: 300px;
    width: 300px;
    border: 4px solid white;
    border-radius: 12px;
  }

  .song-info {
    width: 300px;
    li {
      width: 100%;
      line-height: 40px;
      font-size: 18px;
      padding-left: 10%;
    }
  }
}

.lyric-container {
  font-family: $font-family;
  .song-lyric {
    position: relative;
    min-height: 300px;
    padding: 30px 0;
    overflow: auto;
    border-radius: 12px;
    background-color: $color-light-grey;
    .has-lyric {
      position: absolute;
      transition: all 1s;
      li {
        width: 100%;
        height: 40px;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
      }
    }
    .no-lyric {
      position: absolute;
      margin: 100px 0;

      span {
        font-size: 18px;
        text-align: center;
      }
    }
  }
}

.lyric-fade-enter,
.lyric-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.lyric-fade-enter-active,
.lyric-fade-leave-active {
  transition: all 0.3s ease;
}

@media screen and (min-width: $sm) {
  .container {
    padding-top: 30px;
  }
  .lyric-container {
    margin: 0 150px 0px 400px;
  }
}

@media screen and (max-width: $sm) {
  .container {
    padding: 20px;
  }
  .song-container {
    display: none;
  }
}

.comment {
  .goback {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 2;
    :hover {
      background-color: var(--n-border-color);
    }
    :deep(.n-card__content) {
      transition: all 0.3s;
      font-size: 12px;
    }
  }
  .title {
    margin-top: 30px;
    margin-bottom: 20px;
    .key {
      font-size: 40px;
      font-weight: bold;
      margin-right: 8px;
    }
    .song {
      margin-top: 20px;
      border-radius: 8px;
    }
  }
  .hotComments,
  .allComments {
    margin-top: 40px;
    .count {
      font-size: 13px;
      margin-left: 4px;
      opacity: 0.6;
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
  padding: 24px 10vw 54px;
  //padding:2px 5vw 54px;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}




</style>
