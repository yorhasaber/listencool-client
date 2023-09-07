<template>

  <n-card>
    <div class="comment">
      <h2 class="comment-title">
        <span>评论</span>
        <span class="comment-desc">共 {{ commentList.length }} 条评论</span>
      </h2>
      <el-input class="comment-input" type="textarea" placeholder="期待您的精彩评论..." :rows="2" v-model="textarea"/>
      <el-button class="" type="primary" @click="submitComment()">发表评论</el-button>
    </div>
  </n-card>

<!--  <ul class="popular">-->
<!--    <li v-for="(item, index) in commentList" :key="index">-->
<!--      <el-image class="popular-img" fit="contain" :src="attachImageUrl(item.avator)"/>-->
<!--      <div class="popular-msg">-->
<!--        <ul>-->
<!--          <li class="name">{{ item.username }}</li>-->
<!--          <li class="time">{{ formatDate(item.createTime) }}</li>-->
<!--          <li class="content">{{ item.content }}</li>-->
<!--        </ul>-->
<!--      </div>-->
<!--      &lt;!&ndash;这特么是直接拿到了评论的id&ndash;&gt;-->
<!--      <div ref="up" class="comment-ctr" @click="setSupport(item.id, item.up,userId)">-->
<!--        <div>-->
<!--          <li-icon :icon="iconList.Support"></li-icon>-->
<!--          {{ item.up }}-->
<!--        </div>-->
<!--        <el-icon v-if="item.userId === userId" @click="deleteComment(item.id, index)">-->
<!--          <delete/>-->
<!--        </el-icon>-->
<!--      </div>-->
<!--    </li>-->
<!--  </ul>-->
<!--  :src=" src ?  attachImageUrl(item.avator) :`https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg`"-->
  <ul class="popular">
    <li v-for="(item, index) in commentList" :key="index">
      <n-card class="comment" hoverable>
        <div class="user">
          <div class="avatar">
            <img class="avatarImg" :src="attachImageUrl(item.avator)" alt="avatar"/>
          </div>
        </div>
        <div class="review">
          <div class="content">
            <span class="name">{{ item.username }}：</span>
            <span class="text">{{ item.content }}</span>
          </div>
          <div class="num">
        <span class="time">
          <n-icon :component="AccessTimeFilled"/>
          {{ formatDate(item.createTime) }}
        </span>
            <span class="like" @click="setSupport(item.id, item.up,userId)">
          <n-icon size="20px" :component="ThumbUpAltOutlined"/>{{ item.up }}
<!--         <n-icon  size="20px" :component="item.up ? ThumbUpOffAltRound : ThumbUpAltOutlined"/>-->
         </span>
         <span class="delete">
         <n-icon size="20px" :component="DeleteFilled" v-if="item.userId === userId" @click="deleteComment(item.id,index)"/>
        </span>

          </div>
        </div>
      </n-card>
    </li>
  </ul>

</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, ref, toRefs, computed, watch, reactive, onMounted, watchEffect} from "vue";
import {useStore} from "vuex";
import {Delete} from "@element-plus/icons-vue";
import LiIcon from "@/components/layouts/LiIcon.vue";
import mixin from "@/mixins/mixin";
import {HttpManager} from "@/api";
import {Icon} from "@/enums";
import {formatDate} from "@/utils";
import {
  AccessTimeFilled,
  FmdGoodOutlined,
  ThumbUpAltOutlined,
  DeleteFilled,
  ThumbUpOffAltRound

} from "@vicons/material";
import {getBaseURL} from "@/api/request";

export default defineComponent({
  components: {
    LiIcon,
    Delete,
  },
  props: {
    playId: Number || String, // 歌曲ID或歌单ID
    type: Number, // 歌单（1）/歌曲（0）
  },
  setup(props) {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const {checkStatus} = mixin();

    const {playId, type} = toRefs(props);
    const commentList = ref([]); // 存放评论内容
    const textarea = ref(""); // 存放输入内容
    const iconList = reactive({
      Support: Icon.Support,
    });
    const userIdVO = computed(() => store.getters.userId);
    const songIdVO = computed(() => store.getters.songId);



    const liked = ref(false)

    const icon = ref(ThumbUpOffAltRound)
    function toggleLike() {
      liked.value = !liked.value
    }

    watchEffect(() => {
      if (liked.value) {
        icon.value = ThumbUpAltOutlined
      } else {
        icon.value = ThumbUpOffAltRound
      }
    })

    watch(songIdVO, () => {
      getComment();
    });

    // 获取所有评论
    async function getComment() {
      try {
        const result = (await HttpManager.getAllComment(type.value, songIdVO.value)) as ResponseBody;
        commentList.value = result.data;
        for (let index = 0; index < commentList.value.length; index++) {
          // 获取评论用户的昵称和头像
          const resultUser = (await HttpManager.getUserOfId(commentList.value[index].userId)) as ResponseBody;
          commentList.value[index].avator = resultUser.data[0].avator;
          commentList.value[index].username = resultUser.data[0].username;
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 提交评论
    async function submitComment() {
      if (!checkStatus()) return;

      // 0 代表歌曲， 1 代表歌单
      let songListId = null;
      let songId = null;
      let nowType = null;
      if (type.value === 1) {
        nowType = 1;
        songListId = `${playId.value}`;
      } else if (type.value === 0) {
        nowType = 0;
        songId = `${playId.value}`;
      }
      const userId = userIdVO.value;
      const content = textarea.value;
      const result = (await HttpManager.setComment({userId, content, songId, songListId, nowType})) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.success) {
        textarea.value = "";
        await getComment();
      }
    }

    // 删除评论
    async function deleteComment(id, index) {
      const result = (await HttpManager.deleteComment(id)) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result.success) commentList.value.splice(index, 1);
    }

    // 点赞  还得再查一下
    async function setSupport(id, up, userId) {
      if (!checkStatus()) return;
      let result = null;
      let operatorR = null;
      const commentId = id;
      //当然可以这么左 直接在判断的时候 进行点赞或者取消
      const r = (await HttpManager.testAlreadySupport({commentId, userId})) as ResponseBody;
      (proxy as any).$message({
        message: r.message,
        type: r.type,
        date: r.data
      });

      if (r.data) {
        up = up - 1;
        operatorR = (await HttpManager.deleteUserSupport({commentId, userId})) as ResponseBody;
        result = (await HttpManager.setSupport({id, up})) as ResponseBody;
      } else {
        up = up + 1;
        operatorR = (await HttpManager.insertUserSupport({commentId, userId})) as ResponseBody;
        result = (await HttpManager.setSupport({id, up})) as ResponseBody;
      }
      if (result.success && operatorR.success) {
        // proxy.$refs.up[index].children[0].style.color = "#2796dd";
        await getComment();
      }
    }

    onMounted(() => {
      getComment();
    });

    return {
      userId: userIdVO,
      commentList,
      textarea,
      iconList,
      attachImageUrl: HttpManager.attachImageUrl,
      submitComment,
      setSupport,
      formatDate,
      deleteComment,
      AccessTimeFilled,
      FmdGoodOutlined,
      ThumbUpAltOutlined,
      ThumbUpOffAltRound,
      DeleteFilled,
      icon,
      toggleLike,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

/*评论*/
.comment {
  position: relative;
  margin-bottom: 60px;

  .comment-title {
    height: 50px;
    line-height: 50px;

    .comment-desc {
      font-size: 14px;
      font-weight: 400;
      color: $color-grey;
      margin-left: 10px;
    }
  }

  .comment-input {
    display: flex;
    margin-bottom: 20px;
  }

  .sub-btn {
    position: absolute;
    right: 0;
  }
}

/*热门评论*/
.popular {
  width: 100%;

  > li {
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    display: flex;

    .popular-img {
      width: 50px;
    }

    .popular-msg {
      padding: 0 20px;
      flex: 1;

      li {
        width: 100%;
      }

      .time {
        font-size: 0.6rem;
        color: rgba(0, 0, 0, 0.5);
      }

      .name {
        color: rgba(0, 0, 0, 0.5);
      }

      .content {
        font-size: 1rem;
      }
    }

    .comment-ctr {
      display: flex;
      align-items: center;
      width: 80px;
      font-size: 1rem;
      cursor: pointer;

      .el-icon {
        margin: 0 10px;
      }

      &:hover,
      :deep(.icon):hover {
        color: $color-grey;
      }
    }
  }
}

.icon {
  @include icon(1em);
}

.comment {
  margin-bottom: 12px;
  border-radius: 8px;

  :deep(.n-card__content) {
    display: flex;
    flex-direction: row;

    .user {
      min-width: 60px;
      width: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;

      .avatar {
        position: relative;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        box-shadow: 0 6px 8px -2px rgb(0 0 0 / 16%);

        .avatarImg {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }

        .musicPackage {
          height: 16px;
          position: absolute;
          right: 0;
          bottom: 0;
          background-color: #fff;
          border-radius: 50%;
        }
      }

      .associator {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        justify-content: space-evenly;
        align-items: center;

        img {
          height: 16px;

          &:nth-of-type(1) {
            margin-bottom: 6px;
          }
        }
      }
    }

    .review {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .content {
        .name {
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {

          }
        }
      }

      .beReplied {
        width: 100%;
        padding: 4px 8px;
        border-radius: 8px;
        background-color: var(--n-border-color);
        font-size: 13px;
        margin-top: 6px;
        box-sizing: border-box;

        .name {
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {

          }
        }
      }

      .num {
        margin-top: 12px;
        display: flex;
        align-items: center;
        opacity: 0.6;

        .time {
          margin-right: 12px;
        }

        .like {
          margin-left: auto;
          cursor:pointer;
        }

        .n-icon {
          font-size: 16px;
          transform: translateY(3px);
        }
      }
    }
  }
}

.delete{
  cursor:pointer;
}
</style>
