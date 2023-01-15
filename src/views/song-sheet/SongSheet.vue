<template>
  <main>
    <div class="play-list-container">
      <h1 class="h1">发现</h1>
      <li-nav :styleList="songStyle" :activeName="activeName" @click="handleChangeView"></li-nav>

      <play-list :playList="data" path="song-sheet-detail"></play-list>

      <el-pagination
          class="pagination"
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="allPlayList.length"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </main>

</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import LiNav from "@/components/layouts/LiNav.vue";
import PlayList from "@/components/PlayList.vue";
import { SONGSTYLE } from "@/enums";
import { HttpManager } from "@/api";

export default defineComponent({
  components: {
    LiNav,
    PlayList,
  },
  setup() {
    const activeName = ref("全部歌单");
    const pageSize = ref(15); // 页数
    const currentPage = ref(1); // 当前页
    const songStyle = ref(SONGSTYLE); // 歌单导航栏类别
    const allPlayList = ref([]); // 歌单
    const data = computed(() => allPlayList.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value));

    // 获取全部歌单
    async function getSongList() {
      allPlayList.value = ((await HttpManager.getSongList()) as ResponseBody).data;
      currentPage.value = 1;
    }
    // 通过类别获取歌单
    async function getSongListOfStyle(style) {
      allPlayList.value = ((await HttpManager.getSongListOfStyle(style)) as ResponseBody).data;
      currentPage.value = 1;
    }

    try {
      getSongList();
    } catch (error) {
      console.error(error);
    }

    // 获取歌单
    async function handleChangeView(item) {
      activeName.value = item.name;
      allPlayList.value = [];
      try {
        if (item.name === "全部歌单") {
          await getSongList();
        } else {
          await getSongListOfStyle(item.name);
        }
      } catch (error) {
        console.error(error);
      }
    }
    // 获取当前页
    function handleCurrentChange(val) {
      currentPage.value = val;
    }
    return {
      activeName,
      songStyle,
      pageSize,
      currentPage,
      allPlayList,
      data,
      handleChangeView,
      handleCurrentChange,
    };
  },
});

</script>

<style>
.h1{
  color: var(--color-text);
  font-size: 56px;
  margin-left: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
}

main{

}
</style>
