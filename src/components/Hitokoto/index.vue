<template>
  <div class="padailysongs" >
    <div class="text"  @click="updateHitokoto">
      <span class="title">{{hitokotoData.text}}</span>
      <span class="from">-「&nbsp;{{ hitokotoData.from }} 🤗-{{hitokotoData.creator}}&nbsp;」</span>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from "vue-router";
import {h, onMounted, onUnmounted, reactive} from "vue";
import {getHitokoto} from "@/api/thirdParty.ts";

const router = useRouter();

// 定义定时器
let intervalId;
let hitokotoData = reactive({
  text: "这里应该显示一句话",
  from: "無名",
  creator:"作者"
});

// 获取一言数据
const getHitokotoData = () => {
  getHitokoto()
      .then((res) => {
        hitokotoData.text = res.hitokoto;
        hitokotoData.from = res.from;
        hitokotoData.creator=res.creator;
      })
      .catch(() => {
        ElMessage({
          message: "一言获取失败",
          icon: h(Error, {
            theme: "filled",
            fill: "#efefef",
          }),
        });
      });
};

// 在组件加载时立即获取数据
getHitokotoData();

// 更新一言数据
const updateHitokoto = () => {
  getHitokotoData();
};

onMounted(() => {
  intervalId = setInterval(getHitokotoData, 7000);
});

// 在组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(intervalId);
});

</script>

<style lang="scss" scoped>
.padailysongs {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 20px;
  height: 150px;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 0;
  transition: all 0.3s;
  cursor: pointer;
  &:active {
    transform: scale(0.98);
  }
  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgb(0, 0, 1);
    text-shadow: 0px 0px 8px #ffffff;
    .title {
      font-size: 34px;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    @media (min-width: 750px) and (max-width: 1056px) {
      .tip {
        display: none;
      }
      .from {
        display: none;
      }
      .title {
        font-size: 20px;
      }
    }
    .from {
      margin-top: 40px;
      font-weight: bold;
      //align-self: flex-end;
      font-size: 1.1rem;
      padding-left: 1000px;
    }
  }

}






</style>
