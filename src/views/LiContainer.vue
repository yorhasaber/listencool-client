<template>
  <el-container>
    <el-header>
      <li-header></li-header>
    </el-header>
    <el-main>
      <router-view/>
      <li-current-play></li-current-play>
      <li-play-bar></li-play-bar>
      <li-scroll-top></li-scroll-top>
      <li-audio></li-audio>
    </el-main>
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
}
</style>
