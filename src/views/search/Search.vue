<template>

  <div class="search">
    <h1 class="h1">搜索</h1>
    <li-nav :styleList="searchNavList" :activeName="activeName" @click="handleChangeView"></li-nav>
    <component class="search-list" :is="currentView"></component>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import LiNav from "@/components/layouts/LiNav.vue";
import SearchSong from "./SearchSong.vue";
import SearchSongList from "./SearchSongList.vue";

export default defineComponent({
  components: {
    LiNav,
    SearchSong,
    SearchSongList,
  },
  data() {
    return {
      searchNavList: [
        {
          name: "歌曲",
          value: "SearchSong",
        },
        {
          name: "歌单",
          value: "SearchSongList",
        },
        {
          name:"歌手",
          value:"SearchSongList",
        },
      ],
      activeName: "歌曲",
      currentView: "SearchSong",
    };
  },
  methods: {
    handleChangeView(item) {
      this.activeName = item.name;
      this.currentView = item.value;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.search {
  margin: auto;
  width: 900px;

  .search-list {
    min-height: 480px;
  }
}

.h1{
  color: var(--color-text);
  font-size: 56px;
  margin-left: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
