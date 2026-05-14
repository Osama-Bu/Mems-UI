<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules"  :label-position="labelPosition" class="register-form"  label-width="80px">

      <h3 class="title" style="margin-bottom:0px">注册用户</h3>
      <el-form-item prop="userName" label="用户姓名"  >
        <el-input v-model="registerForm.userName" type="text" prefix-icon="el-icon-user-solid"  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="nickName" label="用户别名">
        <el-input v-model="registerForm.nickName" type="text" placeholder="请输入别名" prefix-icon="el-icon-user" ></el-input>
      </el-form-item>

      <el-form-item prop="phonenumber" label="手机号码">
        <el-input v-model="registerForm.phonenumber" type="text" prefix-icon="el-icon-phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱地址">
        <el-input v-model="registerForm.email" type="text" prefix-icon="el-icon-message"  placeholder="请输入邮箱地址"></el-input>
      </el-form-item>

      <el-form-item prop="values" label="选择组织" style="margin-bottom: 0px">
        <el-select v-model="registerForm.values" placeholder="请选择组织，如无组织请联系管理员">
          <el-option
            v-for="item in registerForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          v-model="registerForm.password"
          type="password"
          prefix-icon="el-icon-lock"
          auto-complete="off"
          placeholder="请输入密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password2" label="确认密码">
        <el-input
          v-model="registerForm.password2"
          type="password"
          prefix-icon="el-icon-lock"
          auto-complete="off"
          placeholder="请再次输入密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled" style="width: 100%" label="验证码">
        <el-input
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 60%"
          @keyup.enter.native="handleRegister('registerForm')"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="margin-left: 11%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          @click.native.prevent="handleRegister('registerForm')"
        >
          <span v-if="!loading">立即注册</span>
          <span v-else>注 册 中...</span>
        </el-button>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {resgister, getDeptlist, getPublicKey, getCodeImg} from '@/api/register'
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import IconSelect from "@/components/IconSelect";

    export default {
        name: 'index',
        components:{Treeselect, IconSelect},
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.registerForm.password2 !== '') {
                        this.$refs.registerForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.registerForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                labelPosition: 'right',
                publicKey:'',
                codeUrl: "",
                cookiePassword: "",
                registerForm: {
                    values:[],
                    userName: "",
                    nickName:'',
                    email:'',
                    phonenumber:'',
                    sex:'0',
                    password: "",
                    password2: "",
                    orgID:'',
                    options:[],
                    code: '',
                    uuid: ''
                },
                registerRules: {
                    userName: [
                        { required: true, trigger: "blur", message: "用户名不能为空" }
                    ],
                    nickName: [
                        { required: true, trigger: "blur", message: "别名不能为空" }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur', required: true, },
                        {
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
                            message: '密码要求8到16个字母和数字'
                        }
                    ],
                    password2: [
                        { validator: validatePass2, trigger: 'blur' , required: true,},
                        {
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
                            message: '密码要求8到16个字母和数字'
                        }
                    ],
                    phonenumber: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
                        {
                            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            message: '请输入正确的手机号码'
                        }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        {
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: '请输入正确的邮箱地址'
                        }
                    ],
                    values: [
                        { required: true, message: '请选择单位或注册单位', trigger: 'blur' },
                    ],
                },
                loading: false,
                redirect: undefined,
                // 验证码开关
                captchaEnabled: true,
            };
        },
        created() {
            this.getPublicKey();
            this.getOrg();
            this.getCode();
        },
        // mounted() {
        //     //获取从ordAdd组件传过来的消息，重新获取注册表单中的组织
        //     eventBus.$on('refreshOrgs', (sensorMsg) => {
        //         this.getOrg();
        //     })
        // },
        methods:{
            /** 注册用户 */
            handleRegister(formName){
                this.loading = true
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data={
                            "userName":this.registerForm.userName,
                            "nickName": this.registerForm.nickName,
                            "email": this.registerForm.email,
                            "phonenumber": this.registerForm.phonenumber,
                            "sex": this.registerForm.sex,
                            "password": this.Rsa.rsaPublicData(this.publicKey,this.registerForm.password),
                            "password1":this.Rsa.rsaPublicData(this.publicKey,this.registerForm.password2),
                            "deptId": this.registerForm.values,
                            "code": this.registerForm.code,
                            "uuid": this.registerForm.uuid,
                            "tenantId": 1
                        }
                        resgister(data).then(res=>{
                            if(res.code==200){
                                this.$message({
                                    message: '注册成功, 请联系管理员激活',
                                    type: 'success',
                                    duration: 5000,
                                });
                                this.$router.push({
                                    path: '/login',
                                });
                                this.loading = false
                            }
                        }).catch(() => {
                            this.loading = false;
                        });
                    } else {
                        this.loading = false
                        return false;
                    }
                });
            },
            /** 表单重置 */
            reset() {
                this.registerForm = {
                    userName: "",
                    nickName:'',
                    email:'',
                    phonenumber:'',
                    sex:'0',
                    password: "",
                    password2: "",
                    orgID:'',
                    values:[],
                    options:[],
                    code: '',
                    uuid: ''
                };
                // this.$refs.orgAddModal.resetForm("form");
            },
            /** 获取组织列表 */
            getOrg(){
                this.registerForm.options=[]
                this.registerForm.values=[]
                getDeptlist().then(res=>{
                    if(res.code==200){
                        for(let item of res.data){
                            let org= { value: 0, label: '无'};
                            org.value=item.deptId;
                            org.label=item.deptName;
                            // if(item.children.length>0){
                            //     org['children']=item.children;
                            // }
                            this.registerForm.options.push(org)
                        }
                    }
                });
            },
            getPublicKey(){
                getPublicKey().then(res=>{
                    if(res.code==200){
                        this.publicKey=res.data;
                    }
                },);
            },
            getCode() {
                getCodeImg().then(res => {
                    this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
                    if (this.captchaEnabled) {
                        this.codeUrl = "data:image/gif;base64," + res.img;
                        this.registerForm.uuid = res.uuid;
                    }
                });
            },
        },
    }
</script>

<style scoped>
  .register {
    position: fixed;
    width: 100%;
    height: 100%;
    margin-right: 10px;
    background: url("~@/assets/images/background-image.jpg");
    background-size: cover;
  }
  .title {
    margin: 0px auto 0px 40px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #1b1b1b;
  }
  .el-form-item {
    margin-top: 4.5%;
    margin-bottom: 4.5%;
  }
  el-form-item__content
  .register >>> .el-form-item__label {
    color: #1b1b1b;
  }

  .register-form {
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.8);
    width: 450px;
    padding: 25px 25px 5px 25px;
    position: fixed;
    margin-top:9%;
    margin-right: 0px;
    right: 150px;
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  h3{
    padding-right: 40px;
  }
  h3 img{
    margin-left: 10px;
    float: left;
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .login-code-img {
    height: 38px;
  }
</style>
