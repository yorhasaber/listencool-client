<template>

    <body class="body-bg">
    <div  class="site">
      <div class="container">
        <div class="login">
          <div class="hero">
            <h1>你好 音乐 <br>Hello Music</h1>
            <p>欢迎来到Listen Cool音乐平台<br>如果你没有账号<br>可以<a @click="handleSignUp">点击这里</a>进行注册.</p>
          </div>
          <div class="main">
            <form  ref="signInForm" v-on:submit.prevent="onSubmit" >
              <h2>Listen Cool 登录</h2>
              <p>
                <input type="text" v-model="registerForm.username" placeholder="用户名">
              </p>
              <p class="password">
                <input type="password"  v-model="registerForm.password" @keyup.enter="handleLoginIn" placeholder="密码">
                <i class="ri-eye-off-line"></i>
                <a @click="handleSignUp" href="#">注册</a>
              </p>
              <p>
                <input type="submit" class="submit" @click="handleLoginIn" value="登录">
              </p>
            </form>
            <div class="options">
              <div class="separator">
                <p>使用其他方式登录</p>
              </div>
              <ul>
                <li><a href="#"><i class="ri-smartphone-fill ri-2x"></i></a></li>
                <li><a href="#"><i class="ri-playstation-fill ri-2x"></i></a></li>
                <li><a href="#"><i class="ri-xbox-fill ri-2x"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body>


  <el-form ref="signInForm" status-icon :model="registerForm" :rules="SignInRules">
  </el-form>

</template>

<script lang="ts">


import {defineComponent, reactive, getCurrentInstance} from "vue";
import mixin from "@/mixins/mixin";
import LiLoginLogo from "@/components/layouts/LiLoginLogo.vue";
import {HttpManager} from "@/api";
import {NavName, RouterName, SignInRules} from "@/enums";

export default defineComponent({
  components: {
    LiLoginLogo,
  },
  setup() {
    const {proxy} = getCurrentInstance();
    const {routerManager, changeIndex} = mixin();

    // 登录用户名密码
    const registerForm = reactive({
      username: "",
      password: "",
    });

    async function handleLoginIn() {
      let canRun = true;
      (proxy.$refs["signInForm"] as any).validate((valid) => {
        if (!valid) return (canRun = false);
      });
      if (!canRun) return;


      try {
        const username = registerForm.username;
        const password = registerForm.password;
        const result = (await HttpManager.signIn({username, password})) as ResponseBody;


        //todo 有问题
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });

        if (result.success) {
          proxy.$store.commit("setUserId", result.data[0].id);
          proxy.$store.commit("setUsername", result.data[0].username);
          proxy.$store.commit("setUserPic", result.data[0].avator);
          proxy.$store.commit("setToken", true);
          changeIndex(NavName.Home);
          routerManager(RouterName.Home, {path: RouterName.Home});
        }
      } catch (error) {
        console.error(error);
      }
    }

    function handleSignUp() {
      routerManager(RouterName.SignUp, {path: RouterName.SignUp});
    }



    return {
      registerForm,
      SignInRules,
      handleLoginIn,
      handleSignUp,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/sign.scss";

.body-bg{
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.8;
    color: var(--dark-color);
    background-color: var(--background-color);
    user-select: none;
    -webkit-user-drag: none;
}

</style>
