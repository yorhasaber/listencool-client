<template>

  <body class="body-bg">
  <div  class="site">
    <div class="container">
      <div class="login">
        <div class="hero">
          <h1>欢迎


            加入 <br>Listen Cool</h1>
          <p>小tips:<br>ListenCool的logo包含了<br>其所有字母的元素.</p>
        </div>
        <div class="main">
          <form  ref="signInForm" v-on:submit.prevent="onSubmit" >
            <h2>Listen Cool 注册</h2>
            <p>
              <input type="text" v-model="registerForm.username" placeholder="用户名">
            </p>
            <p>
              <input type="text" v-model="registerForm.username" placeholder="密码">
            </p>
            <p>
              <input type="text" v-model="registerForm.username" placeholder="手机号">
            </p>
            <p>
              <input type="text" v-model="registerForm.username" placeholder="请再次输入密码">
            </p>
            <p>
              <input type="submit" class="submit" @click="handleLoginIn" value="注册">
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

  <div class="sign">
    <el-form ref="signUpForm" label-width="70px" status-icon :model="registerForm" :rules="SignUpRules">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" placeholder="密码" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-radio-group v-model="registerForm.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phoneNum" label="手机">
        <el-input placeholder="手机" v-model="registerForm.phoneNum"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="birth" label="生日">
        <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-form-item prop="introduction" label="签名">
        <el-input type="textarea" placeholder="签名" v-model="registerForm.introduction"></el-input>
      </el-form-item>
      <el-form-item prop="location" label="地区">
        <el-select v-model="registerForm.location" placeholder="地区" style="width: 100%">
          <el-option v-for="item in AREA" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="sign-btn">
        <el-button @click="goBack()">登录</el-button>
        <el-button type="primary" @click="handleSignUp(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from "vue";
import mixin from "@/mixins/mixin";
import LiLoginLogo from "@/components/layouts/LiLoginLogo.vue";
import { HttpManager } from "@/api";
import { getBirth } from "@/utils";
import { AREA, RouterName, NavName, SignUpRules } from "@/enums";

export default defineComponent({
  components: {
    LiLoginLogo,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { routerManager, changeIndex } = mixin();

    const registerForm = reactive({
      username: "",
      password: "",
      sex: "",
      phoneNum: "",
      email: "",
      birth: new Date(),
      introduction: "",
      location: "",
    });

    async function handleSignUp() {
      let canRun = true;
      (proxy.$refs["signUpForm"] as any).validate((valid) => {
        if (!valid) return (canRun = false);
      });
      if (!canRun) return;


      try {
        const username = registerForm.username;
        const password = registerForm.password;
        const sex = registerForm.sex;
        const phoneNum = registerForm.phoneNum;
        const email = registerForm.email;
        const birth = registerForm.birth;
        const introduction = registerForm.introduction;
        const location = registerForm.location;
        const result = (await HttpManager.SignUp({username,password,sex,phoneNum,email,birth,introduction,location})) as ResponseBody;
        (proxy as any).$message({
          message: result.message,
          type: result.type,
        });

        if (result.success) {
          changeIndex(NavName.SignIn);
          routerManager(RouterName.SignIn, { path: RouterName.SignIn });
        }
      } catch (error) {
        console.error(error);
      }
    }

    return {
      SignUpRules,
      AREA,
      registerForm,
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

.hero::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 0;
  width: 280px;
  height: 100px;
  background: linear-gradient(to right, rgba(163, 241, 68, 0.85), rgba(26, 86, 128, 0.73), rgba(28, 185, 101, 0.73));
  z-index: -1;
  filter: blur(70px);
}

.main form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
