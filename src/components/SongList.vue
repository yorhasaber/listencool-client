<template>
  <div class="content">
<!--    <el-table highlight-current-row :data="dataList" @row-click="handleClick">-->
<!--      <el-table-column prop="songName" label="歌曲"/>-->
<!--      <el-table-column prop="singerName" label="歌手"/>-->
<!--      <el-table-column prop="introduction" label="专辑"/>-->
<!--      <el-table-column label="编辑" width="80" align="center">-->

<!--        <template #default="scope">-->
<!--          <el-dropdown>-->
<!--            <el-icon @click="handleEdit(scope.row)">-->
<!--              <MoreFilled/>-->
<!--            </el-icon>-->
<!--            <template #dropdown>-->
<!--              <el-dropdown-menu>-->
<!--                <el-dropdown-item-->
<!--                    :icon="Download"-->
<!--                    @click="-->
<!--                    downloadMusic({-->
<!--                      songUrl: scope.row.url,-->
<!--                      songName: scope.row.name,-->
<!--                    })-->
<!--                  ">下载-->
<!--                </el-dropdown-item>-->
<!--                <el-dropdown-item :icon="Delete" v-if="show" @click="deleteCollection({ id: scope.row.id })">删除-->
<!--                </el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </template>-->
<!--          </el-dropdown>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

    <!--    <n-card v-for="item in dataList" :key="item" hoverable @click="handleClick" >-->
    <!--     &lt;!&ndash;<el-image class="card-img" fit="contain" :src="attachImageUrl(item.pic)" />&ndash;&gt;-->
    <!--      <n-avatar class="pic" :src="attachImageUrl(item.pic) " @click="handleClick"/>-->

    <!--      <div class="name">-->
    <!--        <div class="title">-->
    <!--          <n-text-->
    <!--              class="text-hidden"-->
    <!--              depth="2"-->
    <!--              v-html="item.singerName"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <span class="demonstration">{{ item.singerName }}+</span>-->

    <!--      <span class="demonstration">{{ item.songName }}+</span>-->

    <!--      <span class="demonstration">{{ item.introduction }}</span>-->

    <!--    </n-card>-->

    <div class="track"
         v-for="item in dataList" :key="item"  @click="operate1(item, $event)"
         @mouseleave="hover = false">
      <img :src="attachImageUrl(item.pic) " :class="{ hover: focus }" @click="handleClick"/>

      <div class="title-and-artist">
        <div class="container">
          <div class="title">
            {{ item.songName}}
            <span :title="item.singerName" class="album">
            ({{ item.singerName }})
          </span>
          </div>
        </div>
        <div></div>
      </div>
      <div class="album">
        {{ item.introduction }}
        <div></div>
      </div>
      <div class="album">{{ getBirth(item.createTime) }}</div>
      <div>
        <el-dropdown>
          <el-icon @click="handleEdit(scope.row)">
            <MoreFilled/>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  :icon="Download"
                  @click="
                    downloadMusic({
                      songUrl: scope.row.url,
                      songName: scope.row.name,
                    })
                  ">下载
              </el-dropdown-item>
              <el-dropdown-item :icon="Delete" v-if="show" @click="deleteCollection({ id: scope.row.id })">删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, toRefs, computed, reactive} from "vue";
import {useStore} from "vuex";
import mixin from "@/mixins/mixin";
import {MoreFilled, Delete, Download} from "@element-plus/icons-vue";
import {HttpManager} from "@/api";
import {Icon} from "@/enums";
import {getBirth} from "@/utils";

export default defineComponent({
  methods: {getBirth},
  components: {
    MoreFilled,
  },
  props: {
    songList: Array,
    show: {
      default: false
    }
  },
  emits: ["changeData"],
  setup(props) {
    const {getSongTitle, getSingerName, playMusic, checkStatus, downloadMusic} = mixin();
    const {proxy} = getCurrentInstance();
    const store = useStore();

    const {songList} = toRefs(props);

    const iconList = reactive({
      dislike: Icon.Dislike,
      like: Icon.Like,
    });

    const songUrl = computed(() => store.getters.songUrl);
    const singerName = computed(() => store.getters.singerName);
    const songTitle = computed(() => store.getters.songTitle);
    const songPic = computed(() => store.getters.songPic);
    const createTime = computed(() => store.getters.createTime);

    //拼接输出歌单list
    const dataList = computed(() => {
      const list = [];
      songList.value.forEach((item: any, index) => {
        item["songName"] = getSongTitle(item.name);
        item["singerName"] = getSingerName(item.name);
        item["index"] = index;
        list.push(item);
      });
      console.log("list", list);
      return list;
    });

    function handleClick(row) {
      console.log("hhh", row);
      playMusic({
        id: row.id,
        url: row.url,
        pic: row.pic,
        index: row.index,
        name: row.name,
        lyric: row.lyric,
        currentSongList: songList.value,

      });
    }



   function operate1(item, event) {
     playMusic({
       id: item.id,
       url: item.url,
       pic: item.pic,
       index: item.index,
       name: item.name,
       lyric: item.lyric,
       currentSongList: songList.value,

     });
      console.log(item);

      console.log(event);

    }

    function handleEdit(row) {
      console.log("row", row);
    }

    const userId = computed(() => store.getters.userId);

    async function deleteCollection({id}) {
      if (!checkStatus()) return;

      const result = (await HttpManager.deleteCollection(userId.value, id)) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.data === false) proxy.$emit("changeData", result.data);
    }

    return {
      dataList,
      iconList,
      Delete,
      Download,
      songUrl,
      singerName,
      songTitle,
      songPic,
      createTime,
      handleClick,
      handleEdit,
      downloadMusic,
      deleteCollection,
      attachImageUrl: HttpManager.attachImageUrl,
      operate1,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.content {
  background-color: $color-white;
  border-radius: $border-radius-songlist;
  padding: 10px;
}

.content:deep(.el-table__row.current-row) {
  color: $color-black;
  font-weight: bold;
}

.content:deep(.el-table__row) {
  cursor: pointer;
}

.icon {
  @include icon(1.2em, $color-black);
}

//.pic {
//  width: 50px;
//  height: 50px;
//  min-width: 50px;
//  border-radius: 8px;
//  margin-right: 16px;
//}


.track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  user-select: none;

  .no {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: 0 20px 0 10px;
    width: 12px;
    color: var(--color-text);
    cursor: default;

    span {
      opacity: 0.58;
    }
  }

  .explicit-symbol {
    opacity: 0.28;
    color: var(--color-text);

    .svg-icon {
      margin-bottom: -3px;
    }
  }

  .explicit-symbol.before-artist {
    .svg-icon {
      margin-bottom: -3px;
    }
  }

  img {
    border-radius: 8px;
    height: 46px;
    width: 46px;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }


  .title-and-artist {
    flex: 1;
    display: flex;

    .container {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text);
      cursor: default;
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;

      .featured {
        margin-right: 2px;
        font-weight: 500;
        font-size: 14px;
        opacity: 0.72;
      }

      .sub-title {
        color: #7a7a7a;
        opacity: 0.7;
        margin-left: 4px;
      }
    }

    .artist {
      margin-top: 2px;
      font-size: 13px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;

      a {
        span {
          margin-right: 3px;
          opacity: 0.8;
        }

        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  .album {
    flex: 1;
    display: flex;
    font-size: 16px;
    opacity: 0.88;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .time,
  .count {
    font-size: 16px;
    width: 50px;
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-variant-numeric: tabular-nums;
    opacity: 0.88;
    color: var(--color-text);
  }

  .count {
    font-weight: bold;
    font-size: 22px;
    line-height: 22px;
  }

  &:hover {
    background: var(--color-secondary-bg-for-transparent);
  }
}

.track.focus {
  transition: all 0.3s;
  background: var(--color-secondary-bg);
}

.track.disable {
  img {
    filter: grayscale(1) opacity(0.6);
  }

  .title,
  .artist,
  .album,
  .time,
  .no,
  .featured {
    opacity: 0.28 !important;
  }

  &:hover {
    background: none;
  }
}

.track.tracklist {
  img {
    height: 36px;
    width: 36px;
    border-radius: 6px;
    margin-right: 14px;
    cursor: pointer;
  }

  .title {
    font-size: 16px;
  }

  .artist {
    font-size: 12px;
  }
}

.track.album {
  height: 32px;
}

.actions {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.track.playing {
  background: var(--color-primary-bg);
  color: var(--color-primary);

  .title,
  .album,
  .time,
  .title-and-artist .sub-title {
    color: var(--color-primary);
  }

  .title .featured,
  .artist,
  .explicit-symbol,
  .count {
    color: var(--color-primary);
    opacity: 0.88;
  }

  .no span {
    color: var(--color-primary);
    opacity: 0.78;
  }
}

</style>
