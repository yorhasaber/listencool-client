<template>
  <el-container >
    <el-header>
      <li-header></li-header>
    </el-header>
    <main>
      <router-view/>
      <li-current-play></li-current-play>
      <li-play-bar></li-play-bar>
      <li-scroll-top></li-scroll-top>
      <li-audio></li-audio>
    </main>
    <el-footer>
      <li-footer></li-footer>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue";
import LiHeader from "@/components/layouts/LiHeader.vue";
import LiCurrentPlay from "@/components/layouts/LiCurrentPlay.vue";
import LiPlayBar from "@/components/layouts/LiPlayBar.vue";
import LiScrollTop from "@/components/layouts/LiScrollTop.vue";
import LiFooter from "@/components/layouts/LiFooter.vue";
import LiAudio from "@/components/layouts/LiAudio.vue";

const { proxy } = getCurrentInstance();

if (sessionStorage.getItem("dataStore")) {
  proxy.$store.replaceState(Object.assign({}, proxy.$store.state, JSON.parse(sessionStorage.getItem("dataStore"))));
}

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("dataStore", JSON.stringify(proxy.$store.state));
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

.el-container {
  min-height: calc(100% - 60px);
}
.el-header {
  padding: 0;
}
.el-main {
  padding-left: 0;
  padding-right: 0;
  //padding: 64px 5vw 96px 5vw;;
}

@mixin changeWidth($padding:10vw) {
  .el-header {
    padding: 0 $padding;
  }

  .el-container {
    .main {
      padding: 24px $padding 54px $padding;

      .li-play-bar {
        padding: 0 $padding;
      }
    }
  }
}

#app {
  width: 100%;
  transition: all 0.4s;
}

//main {
//  top: 0;
//  bottom: 0;
//  right: 0;
//  left: 0;
//  overflow: auto;
//  padding: 64px 10vw 96px 10vw;
//  box-sizing: border-box;
//  scrollbar-width: none; // firefox
//}
//
//@media (max-width: 1336px) {
//  main {
//    padding: 64px 5vw 96px 5vw;
//  }
//}
//
//main::-webkit-scrollbar {
//  width: 0px;
//}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
