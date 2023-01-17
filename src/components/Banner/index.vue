<template>


    <Transition>
      <n-carousel
          autoplay
          draggable
          keyboard
          class="banner"
          effect="card"
          :style="{ height: bannerHeight + 'px' }"
      >
        <n-carousel-item
            class="item"
            style="width:48%"
            v-for="item in bannerData"
            :key="item"
        >
          <img :src="HttpManager.attachImageUrl(item.pic)" alt="banner"/>
        </n-carousel-item>
      </n-carousel>
    </Transition>



<!--  <n-carousel v-if="swiperList.length"  type="card" height="20vw" :interval="4000" class="banner">-->
<!--    <n-carousel-item class="item"  v-for="(item, index) in swiperList" :key="index">-->
<!--      <img :src="HttpManager.attachImageUrl(item.pic)" />-->
<!--    </n-carousel-item>-->
<!--  </n-carousel>-->


</template>

<script setup>
import {useRouter} from "vue-router";
import {HttpManager} from "@/api";
import {onBeforeUnmount, onMounted, ref} from "vue";

const router = useRouter();

// 轮播图高度
let bannerHeight = ref(0);

// 轮播图数据
let bannerType = ref("card");
let bannerData = ref([]);

// 请求轮播图数据
const getBannerData = () => {
  console.log("6666666");
  HttpManager.getBannerList().then((res)=>{
    console.log("6666666");
    console.log(res);
    bannerData.value = res.data;
    console.log( bannerData.value);
  })
  // HttpManager.attachImageUrl(item.pic).then((res) => {
  //   console.log(@@@@@@@@);
  //   console.log(res);
  //   bannerData.value = res.banners;
  // });
};

// 轮播图点击事件

// 获取宽度计算轮播图高度
const getBannerHeight = () => {
  console.log(window.innerWidth);
  if (window.innerWidth > 680) {
    bannerType.value = "card";
    if (window.innerWidth >= 1200) {
      bannerHeight.value = window.innerWidth / 5.5;
    } else {
      bannerHeight.value = window.innerWidth / 5;
    }
  } else {
    bannerType.value = "slide";
    bannerHeight.value = window.innerWidth / 3;
  }
};

onMounted(() => {
  getBannerData();
  // 监听宽度
  getBannerHeight();
  window.addEventListener("resize", getBannerHeight);
});

onBeforeUnmount(() => {
  console.log("销毁");
  window.removeEventListener("resize", getBannerHeight);
});
</script>

<style lang="scss" scoped>


.banner {
  // max-width: 1200px;
  // margin: 0 auto;
  .item {
    border-radius: 8px;

    img {
      margin: 0 auto;
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.n-carousel.n-carousel--bottom .n-carousel__dots {
  transform: translateX(-50%);
  bottom: 12px;
  left: 50%;
}

body{
  display: block;
}
</style>
