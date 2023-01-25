<template>
  <div class="play-list">
    <div class="play-title" v-if="title">{{ title }}
      <div class="title">
        <router-link to="/song-sheet">更多></router-link>
      </div>
    </div>

    <ul class="play-body">
      <li class="card-frame" v-for="(item, index) in playList" :key="index">
        <div class="card" @click="goAblum(item)">
          <el-image class="card-img" fit="contain" :src="attachImageUrl(item.pic)" />
          <div class="mask" @click="goAblum(item)">
            <li-icon class="mask-icon" :icon="BOFANG"></li-icon>
<!--            <n-icon class="mask-icon" :component="PlayArrowRound" />-->
          </div>
        </div>
        <p class="card-name">{{ item.name || item.title }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, toRefs } from "vue";
import { PlayArrowRound } from "@vicons/material";

import mixin from "@/mixins/mixin";
import { Icon } from "@/enums";
import { HttpManager } from "@/api";

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
      PlayArrowRound,
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
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 5px;
    .card-img {
      width: 100%;
      transition: all 0.4s ease;
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
  background-color: rgba(52, 47, 41, 0.38);
  @include layout(center, center);
  transition: all 0.3s ease-in-out;
  opacity: 0;

  .mask-icon {
    @include icon(2em, rgba(240, 240, 240, 1));
    //backdrop-filter: blur(10px);
    //opacity: 0;
    //position: absolute;
    //font-size: 2.5vh;
    //color: #fff;
    //padding: 0.5vw;
    //background-color: #00000010;
    //border-radius: 50%;
    //transform: scale(0.8);
    //transition: all 0.3s;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
    .mask-icon {
      //transform: scale(1);
      //opacity: 1;
    }
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
</style>
