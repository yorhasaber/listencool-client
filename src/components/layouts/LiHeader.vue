<template>


  <nav :class="{ 'has-custom-titlebar': hasCustomTitlebar }">

    <!--图标-->
    <div class="header-logo" @click="goPage()">
      <li-icon :icon="iconList.ERJI"></li-icon>
      <span>{{ musicName }}</span>
    </div>
    <div class="navigation-buttons">
      <Button-Icon @click.native="go('back')"><el-icon :size="20"><ArrowLeftBold/></el-icon></Button-Icon>
      <button-icon @click.native="go('forward')"><el-icon :size="20"><ArrowRightBold /></el-icon></button-icon>
    </div>



    <div class="navigation-links">
      <router-link to="/" :class="{ active: $route.name === 'home' }">首页</router-link>
      <router-link to="/song-sheet" :class="{ active: $route.name === 'song-sheet' }">发现</router-link>
      <router-link to="/singer" :class="{ active: $route.name === 'singer' }">歌手</router-link>
    </div>


    <!--    <li-header-nav class="li-header-nav" :styleList="headerNavList" :activeName="activeNavName" @click="goPage"></li-header-nav>-->
    <!--搜索框-->
    <div class="right-part">
      <div class="search-box">
        <div class="container" :class="{ active: inputFocus }">
          <Search style="width: 1em; height: 1em; margin-right: 8px" />
          <div class="input">
            <input placeholder="搜索" :prefix-icon="Search" v-model="keywords" @keyup.enter="goSearch()"/>
          </div>
        </div>
      </div>
    </div>
    <!--    <div class="header-search">-->
    <!--      <el-input placeholder="搜索" :prefix-icon="Search" v-model="keywords" @keyup.enter="goSearch()" />-->
    <!--    </div>-->
    <!--设置-->
    <li-header-nav class="navigation-links" v-if="!token" :styleList="signList" :activeName="activeNavName" @click="goPage"></li-header-nav>

    <el-dropdown class="user-wrap" v-if="token" trigger="click">
      <el-image class="user" fit="contain" :src="attachImageUrl(userPic)"/>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, index) in menuList" :key="index" @click.stop="goMenuList(item.path)">
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </nav>
</template>

<script lang="ts">
import {defineComponent, ref, getCurrentInstance, computed, reactive} from "vue";
//todo 有问题
import {Search} from "@element-plus/icons-vue"
import {useStore} from "vuex";
import LiIcon from "./LiIcon.vue";
import LiHeaderNav from "./LiHeaderNav.vue";
import ButtonIcon from "@/components/ButtonIcon.vue"
import mixin from "@/mixins/mixin";
import {HEADERNAVLIST, SIGNLIST, MENULIST, Icon, MUSICNAME, RouterName, NavName} from "@/enums";
import {HttpManager} from "@/api";

export default defineComponent({
  components: {
    LiIcon,
    LiHeaderNav,
    ButtonIcon,
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const store = useStore();
    const {changeIndex, routerManager} = mixin();

    const musicName = ref(MUSICNAME)
    const headerNavList = ref(HEADERNAVLIST); // 左侧导航栏
    const signList = ref(SIGNLIST); // 右侧导航栏
    const menuList = ref(MENULIST); // 用户下拉菜单项
    const iconList = reactive({
      ERJI: Icon.ERJI,
    });
    const keywords = ref("");
    const activeNavName = computed(() => store.getters.activeNavName);
    const userPic = computed(() => store.getters.userPic);
    const token = computed(() => store.getters.token);

    function goPage(path, name) {
      if (!path && !name) {
        changeIndex(NavName.Home);
        routerManager(RouterName.Home, {path: RouterName.Home});
      } else {
        changeIndex(name);
        routerManager(path, {path});
      }
    }

    function goMenuList(path) {
      if (path == RouterName.SignOut) {
        proxy.$store.commit("setToken", false);
        changeIndex(NavName.Home);
        routerManager(RouterName.Home, {path: RouterName.Home});
      } else {
        routerManager(path, {path});
      }
    }

    function go(where) {
      if (where === 'back') this.$router.go(-1);
      else this.$router.go(1);
    }


    function goSearch() {
      if (keywords.value !== "") {
        proxy.$store.commit("setSearchWord", keywords.value);
        routerManager(RouterName.Search, {path: RouterName.Search, query: {keywords: keywords.value}});
      } else {
        (proxy as any).$message({
          message: "搜索内容不能为空",
          type: "error",
        });
      }
    }


    return {
      musicName,
      headerNavList,
      signList,
      menuList,
      iconList,
      keywords,
      activeNavName,
      userPic,
      token,
      Search,
      goPage,
      goMenuList,
      goSearch,
      go,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
@import "@/assets/css/global.scss";

//@media screen and (min-width: $sm) {
//  .header-logo {
//    margin: 0 1rem;
//  }
//}
//
//@media screen and (max-width: $sm) {
//  .header-logo {
//    margin: 0 1rem;
//
//    span {
//      display: none;
//    }
//  }
//  .header-search {
//    display: none;
//  }
//}

.li-header {
  position: fixed;
  width: 100%;
  height: $header-height;
  line-height: $header-height;
  padding: $header-padding;
  margin: $header-margin;
  background-color: $theme-header-color;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  z-index: 100;
  display: flex;
  white-space: nowrap;
  flex-wrap: nowrap;
}

/* LOGO */
.header-logo {
  font-size: $font-size-logo;
  font-weight: bold;
  cursor: pointer;

  .icon {
    @include icon(1.9rem, $color-black);
    vertical-align: middle;
  }

  span {
    margin-left: 1rem;
  }
}

.li-header-nav {
  flex: 1;
}

/*搜索输入框*/
.header-search {
  margin: 0 20px;
  width: 100%;

  &::v-deep input {
    text-indent: 5px;
    max-width: $header-search-max-width;
    min-width: $header-search-min-width;
    border-radius: $header-search-radius;
    box-shadow: none;
    background-color: $color-light-grey;
    color: $color-black;
  }
}

/*用户*/
.user-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .user {
    //width: $header-user-width;
    //height: $header-user-width;
    border-radius: $header-user-radius;
    margin-right: $header-user-margin;
    cursor: pointer;
  }
}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;
  padding: {
    right: 0vw;
    left: 1vw;
  }
  .svg-icon {
    height: 24px;
    width: 24px;
  }

  button {
    -webkit-app-region: no-drag;
  }
}

.right-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .avatar {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-app-region: no-drag;
    -webkit-user-drag: none;

    &:hover {
      filter: brightness(80%);
    }
  }

  .search-button {
    display: none;
    -webkit-app-region: no-drag;
  }
}


.search-box {
  .active {
    input,
    .svg-icon {
      color: var(--color-text);
    }
  }
}

.container {
  display: flex;
  align-items: center;
  height: 32px;
  background: var(--color-secondary-bg-for-transparent);
  border-radius: 8px;
  width: 200px;
}

nav {
  position: fixed;
  top: 0;
  right: 20px;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: {
    right: 5vw;
    left: 5vw;
  }
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}

@media (max-width: 1336px) {
  nav {
    padding: 0 5vw;
  }
}

@supports (-moz-appearance: none) {
  nav {
    background-color: var(--color-body-bg);
  }
}

nav.has-custom-titlebar {
  padding-top: 20px;
  -webkit-app-region: no-drag;
}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;

  .svg-icon {
    height: 24px;
    width: 24px;
  }

  button {
    -webkit-app-region: no-drag;
  }
}

@media (max-width: 970px) {
  .navigation-buttons {
    flex: unset;
  }
}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;

  a {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: {
      right: 12px;
      left: 12px;
    }

    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }

    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }

  a.active {
    color: var(--color-primary);
  }
}

.search {
  .svg-icon {
    height: 18px;
    width: 18px;
  }
}

.search-box {
  display: flex;
  justify-content: flex-end;
  -webkit-app-region: no-drag;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 200px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: {
      left: 8px;
      right: 4px;
    }
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);

    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme='dark'] {
  .search-box {
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

.right-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .avatar {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-app-region: no-drag;
    -webkit-user-drag: none;

    &:hover {
      filter: brightness(80%);
    }
  }

  .search-button {
    display: none;
    -webkit-app-region: no-drag;
  }
}


.input {
  transition: all 0.5s;
}
</style>
