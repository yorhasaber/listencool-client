<template>
  <main>
    <div class="personal">
      <div class="personal-info">
        <el-image class="personal-img" fit="contain" :src="attachImageUrl(userPic)" @click="dialogTableVisible = true" />
        <div class="personal-msg">
          <div class="username">{{ personalInfo.username }}</div>
          <div class="introduction">{{ personalInfo.introduction }}</div>
        </div>
        <el-button class="edit-info" round :icon="Edit" @click="goPage()">修改个人信息</el-button>
      </div>
      <h3 class="h1">我的收藏</h3>
      <div class="personal-body">
        <song-list :songList="collectSongList" :show="true" @changeData="changeData"></song-list>
      </div>
      <el-dialog v-model="dialogTableVisible" title="修改头像">
        <upload></upload>
      </el-dialog>
    </div>
  </main>

</template>

<script lang="ts">
import { defineComponent, nextTick, ref, computed, watch, reactive } from "vue";
import { useStore } from "vuex";
import { Edit } from "@element-plus/icons-vue";
import SongList from "@/components/SongList.vue";
import Upload from "../setting/Upload.vue";
import mixin from "@/mixins/mixin";
import { HttpManager } from "@/api";
import { RouterName } from "@/enums";

export default defineComponent({
  components: {
    SongList,
    Upload,
  },
  setup() {
    const store = useStore();

    const { routerManager } = mixin();

    const dialogTableVisible = ref(false);
    const collectSongList = ref([]); // 收藏的歌曲
    const personalInfo = reactive({
      username: "",
      userSex: "",
      birth: "",
      location: "",
      introduction: "",
    });
    const userId = computed(() => store.getters.userId);
    const userPic = computed(() => store.getters.userPic);
    watch(userPic, () => {
      dialogTableVisible.value = false;
    });

    function goPage() {
      routerManager(RouterName.Setting, { path: RouterName.Setting });
    }
    async function getUserInfo(id) {
      const result = (await HttpManager.getUserOfId(id)) as ResponseBody;
      personalInfo.username = result.data[0].username;
      personalInfo.userSex = result.data[0].sex;
      personalInfo.birth = result.data[0].birth;
      personalInfo.introduction = result.data[0].introduction;
      personalInfo.location = result.data[0].location;
    }
    // 获取收藏的歌曲
    async function getCollection(userId) {
      collectSongList.value = []
      const result = (await HttpManager.getCollectionOfUser(userId)) as ResponseBody;
      const collectIDList = result.data || []; // 存放收藏的歌曲ID
      // 通过歌曲ID获取歌曲信息
      for (const item of collectIDList) {
        const result = (await HttpManager.getSongOfId(item.songId)) as ResponseBody;
        collectSongList.value.push(result.data[0]);
      }
    }

    function changeData() {
      getCollection(userId.value);
    }

    nextTick(() => {
      getUserInfo(userId.value);
      getCollection(userId.value);
    });

    return {
      Edit,
      userPic,
      dialogTableVisible,
      collectSongList,
      personalInfo,
      attachImageUrl: HttpManager.attachImageUrl,
      goPage,
      changeData,
    };
  },
});
</script>

<style lang="scss" scoped>
//@import "@/assets/css/var.scss";

$primary-color: #007AFF; // Change to your desired primary color
$secondary-color: #FFFFFF; // Change to your desired secondary color
$frosted-color: mix(#0000FF, #FF0000);




body {
  background: linear-gradient(to bottom, $primary-color, $secondary-color);

}

.personal {
  display: flex;
  flex-direction: column;
  align-items: center;


  .personal-info {
    display: flex;
    align-items: center;
    margin: 30px 0;

    .personal-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    }

    .personal-msg {
      margin-left: 20px;

      .username {
        font-size: 20px;
        font-weight: bold;
        color: $primary-color;
      }

      .introduction {
        margin-top: 10px;
        font-size: 14px;
        color: gray;
      }
    }

    .edit-info {
      margin-left: auto;
      background-color: $primary-color;
      color: $secondary-color;
    }
  }
  .personal-body {
    width: 100%;
    margin-top: 20px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  }
  }
.el-dialog {
  width: 400px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
@media (max-width: 768px) {
  .personal {
    .personal-info {
      flex-wrap: wrap;
      align-items: flex-start;

      Copy code
      .personal-img {
        width: 80px;
        height: 80px;
        margin-right: 10px;
      }

      .personal-msg {
        width: 100%;
        text-align: center;
        margin: 10px 0;
      }

      .edit-info {
        margin-top: 10px;
        width: 100%;
        text-align: center;
      }
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

.h1{
  color: var(--color-text);
  font-size: 30px;
  margin-left: 25px;
  margin-top: 30px;
  margin-bottom: 30px;
}


</style>
