<template>
  <div class="search-song">
    <singer-list :playList="singerList" path="singer-detail" ></singer-list>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onMounted, ref, watch} from 'vue'
import SingerList from "@/components/SingerList.vue";
import {useStore} from "vuex";
import {HttpManager} from "@/api";

export default defineComponent({
  components: {SingerList},
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const singerList = ref([]); // 存放的歌手
    const searchWord = computed(() => store.getters.searchWord);
    watch(searchWord, (value) => {
      getSearchList(value);
    });

    // 搜索歌手
    async function getSearchList(value) {
      if (!value) return;
      const result = (await HttpManager.getSingerListOfLikeName(value)) as ResponseBody;
      if (!result.data.length) {
        (proxy as any).$message({
          message: "暂无该歌手",
          type: "warning",
        });
      } else {
        singerList.value = result.data;
      }
    }

    onMounted(() => {
      getSearchList(proxy.$route.query.keywords);
    });

    return {
      singerList,
    };
  },
})
</script>

<style scoped></style>
