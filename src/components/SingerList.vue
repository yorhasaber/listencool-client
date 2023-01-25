<template>
  <div class="play-list">
    <div class="play-title" v-if="title">{{ title }}</div>
    <ul class="play-body">
      <li class="card-frame" v-for="(item, index) in playList" :key="index">
        <div class="card" @click="goAblum(item)">
          <el-image class="card-img" fit="contain" :src="attachImageUrl(item.pic)" />
          <div class="mask" @click="goAblum(item)">
<!--            <li-icon class="mask-icon" :icon="BOFANG"></li-icon>-->
            <n-icon  :component="PersonSearchFilled" />
          </div>
        </div>
        <p class="card-name">{{ item.name || item.title }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, toRefs } from "vue";

import mixin from "@/mixins/mixin";
import { Icon } from "@/enums";
import { HttpManager } from "@/api";
import { PersonSearchFilled } from "@vicons/material";

export default defineComponent({
  components: {

  },
  props: {
    title: String,
    playList: Array,
    path: String,
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const { routerManager } = mixin();

    const { path } = toRefs(props);

    function goAblum(item) {
      proxy.$store.commit("setSongDetails", item);
      routerManager(path.value, { path: `/${path.value}/${item.id}` });
    }

    return {
      BOFANG: Icon.BOFANG,
      goAblum,
      attachImageUrl: HttpManager.attachImageUrl,
      PersonSearchFilled
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.play-list {
  padding: 0 1rem;

  .play-title {
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

  .play-body {
    @include layout(flex-start, stretch, row, wrap);
  }

}

.card-frame {
  .card {
    position: relative;
    width: 12vw;
    height: 12vw;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
    box-shadow: 0 0 16px #0003;
  }

  .card-img {
    width: 100%;
    transition: all 0.4s ease;
  }

  @media (max-width: 768px) {
    .card {
      width: 150px;
      height: 150px;
    }
  }
  @media (max-width: 768px) {
    .card {
      width: 150px;
      height: 150px;
    }
  }

  @media (max-width: 640px) {
    .card {
      width: 120px;
      height: 120px;
    }
  }

  @media (max-width: 480px) {
    .card {
      width: 100px;
      height: 100px;
    }
  }

  .card-name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin: 0.5rem 0;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
  }

  &:hover .card-img {
    transform: scale(1.2);
  }
}

.mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  background-color: rgba(52, 47, 41, 0.4);
  @include layout(center, center);
  transition: all 0.3s ease-in-out;
  opacity: 0;

    .n-icon {
      transform: scale(0.8);
      color: #fff;
      font-size: 7vh;
      transition: all 0.3s;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

@media screen and (min-width: $sm) {
  .card-frame {
    width: 18%;
    margin: 0.5rem 1%;
  }
}

@media screen and (max-width: $sm) {
  .card-frame {
    width: 46%;
    margin: 0.5rem 2%;
  }
}
</style>
