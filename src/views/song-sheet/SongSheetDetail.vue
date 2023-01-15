<template>
<!--  <el-container>-->
<!--    <el-aside class="album-slide">-->
<!--      <el-image class="album-img" fit="contain" :src="attachImageUrl(songDetails.pic)" />-->
<!--      <h3 class="album-info">{{ songDetails.title }}</h3>-->
<!--    </el-aside>-->

<!--    <el-main class="album-main">-->
<!--      <h1>简介</h1>-->
<!--      <p>{{ songDetails.introduction }}</p>-->
<!--      &lt;!&ndash;评分&ndash;&gt;-->
<!--      <div class="album-score">-->
<!--        <div>-->
<!--          <h3>歌单评分</h3>-->
<!--          <el-rate v-model="rank" allow-half disabled></el-rate>-->
<!--        </div>-->
<!--        <span>{{ rank * 2 }}</span>-->
<!--        <div>-->
<!--          <h3>{{ assistText }} {{ score * 2 }}</h3>-->
<!--          <el-rate allow-half v-model="score" :disabled="disabledRank" @click="pushValue()"></el-rate>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash;歌曲&ndash;&gt;-->
<!--      <song-list class="album-body" :songList="currentSongList"></song-list>-->
<!--      <comment :playId="songListId" :type="1"></comment>-->
<!--    </el-main>-->

<!--  </el-container>-->
<main>
  <div class="playlist" >
    <div class="left">
      <div class="cover">
        <n-avatar class="coverImg" :src="attachImageUrl(songDetails.pic)" fallback-src="/images/pic/default.png"/>
        <img src="https://music.imsyy.top/images/pic/album.png" class="album" alt="album" />
      </div>
      <div class="intr">
        <span class="name">歌单简介</span>
        <span class="desc text-hidden">
          {{ songDetails.introduction }}
        </span>
        <n-button
            block
            strong
            secondary
            v-if="songDetails.introduction && songDetails.introduction.length > 70"
            @click="albumDescShow = true"
        >
          全部简介
        </n-button>
        <n-modal
            v-model:show="albumDescShow"
            preset="card"
            style="width: 60vw; min-width: min(24rem, 100vw)"
            title="歌单简介"
            :bordered="false"
        >
          <n-scrollbar style="max-height: 60vh">
            {{ songDetails.introduction }}
          </n-scrollbar>
        </n-modal>
      </div>

    </div>
    <div class="right">
      <div class="meta">
        <span class="name">{{ songDetails.title }}</span>
        <div class="album-score">
          <div>
            <h3>歌单评分</h3>
            <el-rate v-model="rank" allow-half disabled></el-rate>
            <span>{{ rank * 2 }} 分</span>
          </div>
          <div>
            <h3>{{ assistText }} {{ score * 2 }}</h3>
            <el-rate allow-half v-model="score" :disabled="disabledRank" @click="pushValue()"></el-rate>
          </div>
        </div>

        <span class="creator">Listen Cool 官方歌单</span>
        <div class="time">
          <div class="createTime">
            <span class="num">发行时间：</span>
            {{ 发行时间 }}
          </div>
          <div class="company">
            <span class="num">更新时间：</span>
            {{ 更新时间 }}
          </div>
        </div>


      </div>
      <song-list  :songList="currentSongList"></song-list>
    </div>
  </div>
</main>


</template>

<script lang="ts">
import { defineComponent, ref, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import mixin from "@/mixins/mixin";
import SongList from "@/components/SongList.vue";
import Comment from "@/components/Comment.vue";
import { HttpManager } from "@/api";
import tag from "@icon-park/vue-next/lib/icons/Tag";
import router from "@/router";

export default defineComponent({
  methods: {
    router() {
      return router
    }
  },
  computed: {
    tag() {
      return tag
    }
  },
  components: {
    SongList,
    Comment,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const { checkStatus } = mixin();

    const currentSongList = ref([]); // 存放的音乐
    const nowSongListId = ref(""); // 歌单 ID
    const nowScore = ref(0);
    const nowRank = ref(0);
    const disabledRank = ref(false);
    const assistText = ref("评价");
    // const evaluateList = ref(["很差", "较差", "还行", "推荐", "力推"]);
    const songDetails = computed(() => store.getters.songDetails); // 单个歌单信息
    const nowUserId = computed(() => store.getters.userId);

    let albumDescShow = ref(false);

    nowSongListId.value = songDetails.value.id; // 给歌单ID赋值

    // 收集歌单里面的歌曲
    async function getSongId(id) {
      const result = (await HttpManager.getListSongOfSongId(id)) as ResponseBody;
      // 获取歌单里的歌曲信息
      for (const item of result.data) {
        // 获取单里的歌曲
        const resultSong = (await HttpManager.getSongOfId(item.songId)) as ResponseBody;
        currentSongList.value.push(resultSong.data[0]);
      }
    }
    // 获取评分
    async function getRank(id) {
      const result = (await HttpManager.getRankOfSongListId(id)) as ResponseBody;
      nowRank.value = result.data / 2;
    }
    async function getUserRank(userId, songListId) {
      const result = (await HttpManager.getUserRank(userId, songListId)) as ResponseBody;
      nowScore.value = result.data / 2;
      disabledRank.value = true;
      assistText.value = "已评价";
    }
    // 提交评分
    async function pushValue() {
      if (disabledRank.value || !checkStatus()) return;

      const songListId = nowSongListId.value;
      const consumerId = nowUserId.value;
      const score = nowScore.value*2;

      try {
        const result = (await HttpManager.setRank({songListId,consumerId,score})) as ResponseBody;
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });

        if (result.success) {
          getRank(nowSongListId.value);
          disabledRank.value = true;
          assistText.value = "已评价";
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUserRank(nowUserId.value, nowSongListId.value);
    getRank(nowSongListId.value); // 获取评分
    getSongId(nowSongListId.value); // 获取歌单里面的歌曲ID

    return {
      songDetails,
      rank: nowRank,
      score: nowScore,
      disabledRank,
      assistText,
      currentSongList,
      songListId: nowSongListId,
      attachImageUrl: HttpManager.attachImageUrl,
      pushValue,
      albumDescShow,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.album-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;

  .album-img {
    height: 200px;
    width: 250px;
    border-radius: 10%;
  }

  .album-info {
    width: 70%;
    padding-top: 2rem;
  }
}

.album-main {
  h1 {
    font-size: 22px;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
    margin: 10px 0 20px 0px;
  }
  /*歌单打分*/
  .album-score {
    display: flex;
    flex-wrap: nowrap;
    margin: 1vw;

    h3 {
      margin: 10px 0;
    }
    span {
      font-size: 60px;
    }
    & > div:last-child {
      margin-left: 10%;
    }
  }
  .album-score {
    overflow: hidden;
    /* other styles */
  }
  .album-score > div {
    float: left;
    /* other styles */
  }

  .album-body {
    margin: 20px 0 20px 0px;
  }
}


.album-score {
  display: flex;

  & > div:last-child {
    margin-left: 10%;
  }
}


@media screen and (min-width: $sm) {
  .album-slide {
    position: fixed;
    width: 400px;
  }
  .album-main {
    min-width: 600px;
    padding-right: 10vw;
    margin-left: 400px;
  }
}

@media screen and (max-width: $sm) {
  .album-slide {
    display: none;
  }
}

//@@@@@@


.playlist,
.loading {
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    .left {
      margin-bottom: 12px;
      position: static !important;
      width: 60vw !important;
      max-width: none !important;
      .intr,
      .tag {
        display: none !important;
      }
    }
    .right {
      .meta {
        .name {
          font-size: 26px !important;
        }
      }
    }
  }
  .left {
    width: 40vw;
    height: 100%;
    max-width: 320px;
    min-width: 200px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: sticky;
    top: 24px;
    .cover {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // box-shadow: 0 0 16px 0px rgb(0 0 0 / 20%);
      .n-avatar {
        border-radius: 8px;
        width: 80%;
        height: 80%;
      }
      .album {
        height: 100%;
        position: absolute;
        top: 0;
        right: 4%;
      }
    }
    .intr {
      margin-top: 24px;
      width: 80%;
      padding-left: 4px;
      .name {
        display: block;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .desc {
        -webkit-line-clamp: 4;
        line-height: 26px;
        margin-bottom: 16px;
      }
    }
    .tag {
      margin-top: 20px;
      .tags {
        cursor: pointer;
        transition: all 0.3s;
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
  .right {
    flex: 1;
    .meta {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      margin-bottom: 20px;
      .name {
        font-size: 30px;
        font-weight: bold;
      }
      .creator {
        margin-top: 6px;
        font-size: 16px;
        opacity: 0.8;
      }
      .time {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        @media (max-width: 370px) {
          flex-direction: column;
          align-items: flex-start;
        }
        .num {
          color: #999;
        }
        div {
          margin-right: 12px;
        }
      }
    }
    .datalists {
      :deep(.songs) {
        @media (max-width: 990px) {
          .album,
          .time {
            display: none;
          }
        }
      }
    }
  }
}
.title {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 24px;
  .key {
    font-size: 40px;
    font-weight: bold;
    margin-right: 8px;
  }
}
.loading {
  .left {
    display: block;
    .pic {
      padding-bottom: 100%;
      width: 100%;
      height: 0;
      border-radius: 8px !important;
      margin-bottom: 20px;
    }
  }
  .right {
    .n-skeleton {
      margin-bottom: 20px;
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

.text-hidden {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}
</style>
