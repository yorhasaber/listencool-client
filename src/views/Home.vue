<template>

  <div class="body-tg">
  <div class="banner">
    <Banner/>
  </div>


    <play-list class="play-list-container" title="推荐歌单" path="song-sheet-detail" :playList="recommendList"></play-list>

<!--<SingerList class="play-list-container" title="推荐艺人" path="singer-detail" :playList="recommendSingerList"></SingerList>-->

    <singer-list class="play-list-container" title="推荐艺人" path="singer-detail" :playList="recommendSingerList"></singer-list>

    <play-list class="play-list-container" title="新专速递" path="singer-detail" :playList="singerList"></play-list>
  </div>





</template>

<script lang="ts" setup>
import PlayList from "@/components/PlayList.vue";
import SingerList from "@/components/SingerList.vue";
import Banner from "@/components/Banner/index.vue";
import {  NavName } from "@/enums";
import { HttpManager } from "@/api";
import mixin from "@/mixins/mixin";
import { ref, onMounted } from "vue";

const recommendList =ref([]);//推荐歌单
const recommendSingerList =ref([]);//推荐歌手
const songList = ref([]); // 歌单列表
const singerList = ref([]); // 歌手列表
const swiperList = ref([]);// 轮播图 每次都在进行查询
const { changeIndex } = mixin();
try {

  HttpManager.getBannerList().then((res) => {
    swiperList.value = (res as ResponseBody).data.sort();
  });

  HttpManager.getRecommendList().then((res) => {
    recommendList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });

  HttpManager.getSongList().then((res) => {
    songList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });

  HttpManager.getAllSinger().then((res) => {
    singerList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });

  HttpManager.getRecommendSinger().then((res) => {
    recommendSingerList.value = (res as ResponseBody).data.sort().slice(0, 10);
  });


  onMounted(() => {
    changeIndex(NavName.Home);
  });
} catch (error) {
  console.error(error);
}



</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*轮播图*/
.swiper-container {
  width: 90%;
  margin: auto;
  padding-top: 20px;
  img {
    width: 100%;
  }
}

.swiper-container:deep(.el-carousel__indicators.el-carousel__indicators--outside) {
  display: inline-block;
  transform: translateX(30vw);
}

.el-slider__runway {
  background-color: $color-blue;
}

.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.playlists {
  display: flex;
  flex-wrap: wrap;
  margin: {
    right: -12px;
    left: -12px;
  }
  .index-playlist {
    margin: 12px 12px 24px 12px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}


.banner{

  margin-top: 30px;
  margin-bottom: 10px;
}

.body-tg{
  font-size: 16px;
  line-height: 0;
}

</style>
