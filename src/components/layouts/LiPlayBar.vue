<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div class="fold" :class="{ turn: toggle }">
      <li-icon :icon="iconList.ZHEDIE" @click="toggle = !toggle"></li-icon>
    </div>
    <!--播放进度-->
    <!--    <el-slider class="progress" v-model="nowTime" @change="changeTime" size="small"></el-slider>-->
    <n-slider class="progress" :step="0.01" v-model:value="nowTime" @update:value="changeTime" @change="changeTime"
              size="small"></n-slider>
    <div class="control-box">
      <div class="info-box">
        <!--歌曲图片-->
        <div class="pic" @click.stop="bigPlate">
          <img
              :src="attachImageUrl(songPic)"
              alt="pic"
          />
          <n-icon class="open" size="30" :component="KeyboardArrowUpFilled"/>
        </div>
        <!--歌曲图片-->
        <!--        <el-image class="song-bar-img" fit="contain" :src="attachImageUrl(songPic)" @click="goPlayerPage"/>-->
        <!--播放开始结束时间-->
        <div v-if="songId">
          <div class="song-info">{{ this.songTitle }} - {{ this.singerName }}</div>
          <div class="time-info">{{ startTime }} / {{ endTime }}</div>
        </div>
      </div>
      <div class="song-ctr">
        <li-icon class="li-play-show" :icon="playStateList[playStateIndex]" @click="changePlayState"></li-icon>
        <!--上一首-->
        <n-icon title="上一曲" class="pointer" size="30" :component="SkipPreviousRound" @click="prev"/>

        <!--播放-->
        <li-icon :icon="playBtnIcon" @click="togglePlay"></li-icon>

        <n-icon title="下一曲" class="pointer" size="30" :component="SkipNextRound" @click="next"/>
        <!--收藏-->
        <li-icon
            class="li-play-show"
            :class="{ active: isCollection }"
            :icon="isCollection ? iconList.like : iconList.dislike"
            @click="changeCollection"
        ></li-icon>
      </div>
      <div class="song-ctr song-edit">
        <!--下载-->

        <li-icon
            class="li-play-show"
            :icon="iconList.download"
            @click="
            downloadMusic({
              songUrl,
              songName: singerName + '-' + songTitle,
            })
          "
        ></li-icon>


        <!--歌曲列表-->
        <li-icon :icon="iconList.LIEBIAO" @click="changeAside"></li-icon>

        <!--<li-icon :icon="iconList.LIEBIAO" @click="bigPlate"></li-icon>-->

        <!--音量-->
        <li-icon v-if="volume !== 0" :icon="iconList.YINLIANG"></li-icon>

        <li-icon v-else :icon="iconList.JINGYIN"></li-icon>


        <n-slider class="li-slider" v-model:value="volume"/>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onMounted, ref, watch} from "vue";
import {mapGetters, useStore} from "vuex";
import mixin from "@/mixins/mixin";
import LiIcon from "./LiIcon.vue";
import {HttpManager} from "@/api";
import {formatSeconds} from "@/utils";
import {Icon, RouterName} from "@/enums";
import {
  KeyboardArrowUpFilled,
  MusicNoteFilled,
  PlayCircleFilled,
  PauseCircleFilled,
  SkipNextRound,
  SkipPreviousRound,
  PlaylistPlayRound,
  VolumeOffRound,
  VolumeMuteRound,
  VolumeDownRound,
  VolumeUpRound,
  RepeatRound,
  RepeatOneRound,
  ThumbDownRound,
  FavoriteBorderRound,
  FavoriteRound,
} from "@vicons/material";

export default defineComponent({
  components: {
    LiIcon,
    KeyboardArrowUpFilled,
    MusicNoteFilled,
    PlayCircleFilled,
    PauseCircleFilled,
    SkipNextRound,
    SkipPreviousRound,
    PlaylistPlayRound,
    VolumeOffRound,
    VolumeMuteRound,
    VolumeDownRound,
    VolumeUpRound,
    RepeatRound,
    RepeatOneRound,
    ThumbDownRound,
    FavoriteBorderRound,
    FavoriteRound,
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const {routerManager, playMusic, checkStatus, downloadMusic} = mixin();

    const isCollection = ref(false); // 是否收藏

    const userIdVO = computed(() => store.getters.userId);
    const songIdVO = computed(() => store.getters.songId);
    const token = computed(() => store.getters.token);

    watch(songIdVO, () => {
      initCollection();
    });
    watch(token, (value) => {
      if (!value) isCollection.value = false;
    });

    async function initCollection() {
      if (!checkStatus(false)) return;

      const userId = userIdVO.value;
      const type = '0';
      const songId = songIdVO.value;
      isCollection.value = ((await HttpManager.isCollection({userId, type, songId})) as ResponseBody).data;
    }

    async function changeCollection() {
      // 检查当前用户是否已登录
      if (!checkStatus()) return;
      // 获取用户ID和歌曲ID
      const userId = userIdVO.value;
      const type = '0'; //这里要看看 不能直接写死
      const songId = songIdVO.value;
      // 根据"isCollection"变量的值，执行添加或删除歌曲的操作
      const result = isCollection.value
          ? ((await HttpManager.deleteCollection(userIdVO.value, songIdVO.value)) as ResponseBody)
          : ((await HttpManager.setCollection({userId, type, songId})) as ResponseBody);
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.data == true || result.data == false) isCollection.value = result.data;
    }

    onMounted(() => {
      if (songIdVO.value) initCollection();
    });

    // const bigPlate = () => {
    //   this.$store.commit('setshowbigPlayer', false)
    // }

    return {
      isCollection,
      playMusic,
      routerManager,
      checkStatus,
      attachImageUrl: HttpManager.attachImageUrl,
      changeCollection,
      downloadMusic,
      KeyboardArrowUpFilled,
      MusicNoteFilled,
      PlayCircleFilled,
      PauseCircleFilled,
      SkipNextRound,
      SkipPreviousRound,
      PlaylistPlayRound,
      VolumeOffRound,
      VolumeMuteRound,
      VolumeDownRound,
      VolumeUpRound,
      RepeatRound,
      RepeatOneRound,
      ThumbDownRound,
      FavoriteBorderRound,
      FavoriteRound,
    };
  },
  data() {
    return {
      startTime: "00:00",
      endTime: "00:00",
      nowTimenowTime: 0, // 进度条的位置
      toggle: true,
      volume: 50,
      playState: Icon.XUNHUAN,
      playStateList: [Icon.XUNHUAN, Icon.LUANXU],
      playStateIndex: 0,
      iconList: {
        download: Icon.XIAZAI,
        ZHEDIE: Icon.ZHEDIE,
        SHANGYISHOU: Icon.SHANGYISHOU,
        XIAYISHOU: Icon.XIAYISHOU,
        YINLIANG: Icon.YINLIANG1,
        JINGYIN: Icon.JINGYIN,
        LIEBIAO: Icon.LIEBIAO,
        dislike: Icon.Dislike,
        like: Icon.Like,
      },
    };
  },
  computed: {
    ...mapGetters([
      "userId",
      "isPlay", // 播放状态
      "playBtnIcon", // 播放状态的图标
      "songId", // 音乐id
      "songUrl", // 音乐地址
      "songTitle", // 歌名
      "singerName", // 歌手名
      "songPic", // 歌曲图片
      "curTime", // 当前音乐的播放位置
      "duration", // 音乐时长
      "currentPlayList",
      "currentPlayIndex", // 当前歌曲在歌曲列表的位置
      "showAside", // 是否显示侧边栏
      "showbigPlayer", //是否显示大播放页面
      "autoNext", // 用于触发自动播放下一首
    ]),
  },
  watch: {
    // 切换播放状态的图标
    isPlay(value) {
      this.$store.commit("setPlayBtnIcon", value ? Icon.ZANTING : Icon.BOFANG);
    },
    volume() {
      this.$store.commit("setVolume", this.volume / 100);
    },
    // 播放时间的开始和结束
    curTime() {
      this.startTime = formatSeconds(this.curTime);
      this.endTime = formatSeconds(this.duration);
      // 移动进度条
      this.nowTime = (this.curTime / this.duration) * 100;
    },
    // 自动播放下一首
    autoNext() {
      this.next();
    },
  },
  methods: {
    changeAside() {
      this.$store.commit("setShowAside", !this.showAside);
    },
    bigPlate() {
      this.$store.commit("setshowbigPlayer", true);
    },
    // 控制音乐播放 / 暂停
    togglePlay() {
      this.$store.commit("setIsPlay", this.isPlay ? false : true);
    },
    changeTime() {
      this.$store.commit("setChangeTime", this.duration * (this.nowTime * 0.01));
    },
    changePlayState() {
      this.playStateIndex = this.playStateIndex >= this.playStateList.length - 1 ? 0 : ++this.playStateIndex;
      this.playState = this.playStateList[this.playStateIndex];
    },
    // 上一首
    prev() {
      if (this.playState === Icon.LUANXU) {
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        if (this.currentPlayIndex > 0) {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          this.$store.commit("setCurrentPlayIndex", this.currentPlayList.length - 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        }
      }
    },
    // 下一首
    next() {
      if (this.playState === Icon.LUANXU) {
        // 随机生成一个播放索引
        let playIndex = Math.floor(Math.random() * this.currentPlayList.length);
        // 确保新的播放索引不等于当前的播放索引
        playIndex = playIndex === this.currentPlayIndex ? playIndex + 1 : playIndex;
        this.$store.commit("setCurrentPlayIndex", playIndex);
        this.toPlay(this.currentPlayList[playIndex].url);
      } else if (this.currentPlayIndex !== -1 && this.currentPlayList.length > 1) {
        // 检查当前播放索引是否小于播放列表长度减一
        if (this.currentPlayIndex < this.currentPlayList.length - 1) {
          // 如果是，则将当前播放索引加一，使用"setCurrentPlayIndex"方法设置新的播放索引，并调用"toPlay"方法来播放相应的歌曲
          this.$store.commit("setCurrentPlayIndex", this.currentPlayIndex + 1);
          this.toPlay(this.currentPlayList[this.currentPlayIndex].url);
        } else {
          //将播放索引设置为0，并调用"toPlay"方法来播放播放列表中的第一首歌曲
          this.$store.commit("setCurrentPlayIndex", 0);
          this.toPlay(this.currentPlayList[0].url);
        }
      }
    },
    // 选中播放
    toPlay(url) {
      if (url && url !== this.songUrl) {
        const song = this.currentPlayList[this.currentPlayIndex];
        this.playMusic({
          id: song.id,
          url,
          pic: song.pic,
          index: this.currentPlayIndex,
          name: song.name,
          lyric: song.lyric,
          currentSongList: this.currentPlayList,
        });
      }
    },
    goPlayerPage() {
      this.routerManager(RouterName.Lyric, {path: `${RouterName.Lyric}/${this.songId}`});
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/li-play-bar.scss";


.pointer {
  cursor: pointer
}

.pic {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 12px;
  position: relative;
  box-shadow: 0 6px 8px -2px rgb(0 0 0 / 16%);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    transform: scale(1);
    filter: blur(0) brightness(1);
    transition: all 0.3s;
  }

  .open {
    position: absolute;
    top: calc(50% - 15px);
    left: calc(50% - 15px);
    width: 30px;
    height: 30px;
    color: #fff;
    opacity: 0;
    transform: scale(0.6);
    transition: all 0.3s;
  }

  &:hover {
    img {
      transform: scale(1.1);
      filter: blur(6px) brightness(0.8);
    }

    .open {
      opacity: 1;
      transform: scale(1);
    }
  }
}


</style>
