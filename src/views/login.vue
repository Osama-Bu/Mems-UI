<template>
  <div class="outer">
    <header class="top-header">
      <div class="system-title">{{ $t('system.title') }}</div>
      <lang-select class="set-language" />
    </header>
    <div class="banner">
    </div>
    <div class="login">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" :placeholder="$t('login.username')">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" :placeholder="$t('login.password')"
            @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input v-model="loginForm.code" auto-complete="off" :placeholder="$t('login.code')" style="width: 63%"
            @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 10px 0;">{{ $t('login.rememberMe') }}</el-checkbox>
        <el-form-item style="width:100%;margin-bottom: 10px">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
            @click.native.prevent="handleLogin">
            <span v-if="!loading">{{ $t('login.logIn') }}</span>
            <span v-else>{{ $t('login.loggingIn') }}</span>
          </el-button>

          <el-form-item>
            <el-button type="text" @click="toFindpass">
              <u>{{ $t('login.forgetPwd') }}</u>
            </el-button>
<!--            <el-button size="medium" type="text" style="margin-left: 26%"-->
<!--              @click.native.prevent="toRegister">注册</el-button>-->
<!--            <el-button type="text" style="margin-left: 22%" @click="visitorEnter()">游客入口</el-button>-->
          </el-form-item>
<!--            <div style="float: right;" v-if="register">-->
<!--              <router-link class="link-type" :to="'/register'">立即注册</router-link>-->
<!--            </div>-->
        </el-form-item>

      </el-form>
      <!--  底部  -->
      <div class="el-login-footer">
        <!--      <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span>-->
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg, getPublicKey } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import LangSelect from '@/components/LangSelect'

export default {
  name: "Login",
  components: { LangSelect },
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: this.$t('login.rule_username') }
        ],
        password: [
          { required: true, trigger: "blur", message: this.$t('login.rule_password') }
        ],
        code: [{ required: true, trigger: "change", message: this.$t('login.rule_code') }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    // visitorEnter () {
    //   if (this.loginForm.uuid) {
    //     getVisitorNamePwd(this.loginForm.uuid).then(res => {
    //       this.loginForm.username = res.data.userName;
    //       this.loginForm.password = res.data.pwd;
    //       this.loginForm.code = "" + res.data.verifyCode;
    //       this.handleLogin();
    //       this.$message({
    //         message: '游客身份获取成功，欢迎使用本系统！',
    //         type: 'success'
    //       });
    //     });
    //   } else {
    //     this.$message({
    //       message: '点击过快哦，请等待验证码加载后重试。',
    //       type: 'warning'
    //     });
    //   }
    //
    // },
    // toRegister () {
    //   this.$router.push({
    //     path: '/register',
    //   });
    // },
    toFindpass() {
      this.$router.push({ path: '/findpass' }).catch(error => {
        console.log(error);
      });
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          getPublicKey().then(res => {
            let encryptor = new JSEncrypt()
            encryptor.setPublicKey(res.data)
            let form = JSON.parse(JSON.stringify(this.loginForm));
            form.password = encryptor.encrypt(form.password)
            this.$store.dispatch("Login", form).then(() => {
              this.$router.push({ path: "/map/olmap" }).catch(() => { });
            }).catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
              }
            });
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.outer {
  height: 100vh;
  min-height: 900px;
  // width: auto;
  // min-width: 1920px;
  box-sizing: border-box;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.banner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: url("../assets/images/background-none-title.png") center center / cover no-repeat;
}

.title {
  margin: 0px 0px 20px 30px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #1b1b1b;
}

.login-form {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  width: 350px;
  padding: 25px 25px 5px 25px;
  position: absolute;
  right: 250px;
  top: 200px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }

  h3 {
    padding-right: 40px;
  }

  h3 img {
    margin-left: 10px;
    float: left;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}

/* 顶部栏：左侧标题 + 右侧语言 */
.top-header {
  width: 100%;
  height: 70px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between; /* 左右分开 */
  align-items: center;
  //background-color: #0a101f; /* 科技深色背景 */
  box-sizing: border-box;
  //box-shadow: 0 2px 15px rgba(0, 180, 255, 0.2);
}

/* 左上方：科技风系统标题（核心样式） */
.system-title {
  font-size: 64px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 3px;

  /* 科技风字体 */
  font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", sans-serif;

  /* 科技蓝光效果 */
  text-shadow:
    0 0 5px #00b4ff,
    0 0 10px #00b4ff,
    0 0 15px #00a6ff;

  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 50px; /* 往下一点 */
  //padding-left: 50px;
}

/* 语言选择器靠右 */
.set-language {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
