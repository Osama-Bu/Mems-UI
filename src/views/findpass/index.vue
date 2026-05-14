<template>
  <div class="findpass">
    <el-row  type="flex" justify="center">
      <el-col :span="16">
          <el-steps :active="active" style="margin-top: 30px;margin-bottom: 20px" finish-status="success">
            <el-step title="输入信息"></el-step>
            <el-step title="更改密码"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>

          <el-row  type="flex" justify="center">
            <el-col :span="14">
              <el-card class="box-card">
                <el-form v-show="this.active==0" ref="form" :model="form" :rules="formRules" label-width="80px">
                  <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phonenumber">
                    <el-input v-model="form.phonenumber"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="form.email"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" :loading="this.loading" @click="onSubmit('form')" >
                      下一步
                    </el-button>
                  </el-form-item>
                </el-form>

                <el-form v-show="this.active==1" ref="form2" :model="form2" :rules="formRules2" label-width="80px">
                  <el-form-item label="验证码" prop="code">
                    <el-input v-model="form2.code"></el-input>
                  </el-form-item>
                  <el-form-item prop="password"  label="密码">
                    <el-input
                      v-model="form2.password"
                      type="password"
                      auto-complete="off"
                      placeholder="请输入密码"
                    >
                      <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password2" label="确认密码">
                    <el-input
                      v-model="form2.password2"
                      type="password"
                      auto-complete="off"
                      placeholder="请再次输入密码"
                    >
                      <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                    </el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" :loading="this.loading" @click="modifyPass('form2')" >下一步</el-button>
                  </el-form-item>
                </el-form>

                <el-form v-show="this.active==3" ref="form3" :model="form3" label-width="80px">
                  <el-form-item >
                    <el-image
                      style="width: 256px; height: 256px"
                      :src="form3.imageurl"
                      fit="contain">
                    </el-image>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="toLogin">返回登录</el-button>
                  </el-form-item>
                </el-form>

              </el-card>
            </el-col>
          </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {listOrg,getOrg,addOrg,delOrg,updateOrg} from '@/api/system/org'
  import {getPublicKey,sendUser,modify} from '@/api/login'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  import userForm from './modules/userForm'

  export default {
    name: 'index',
    components:{Treeselect,IconSelect,userForm},
    data() {
      //validatePass和validatePass2用来校验两次输入密码是否一致的
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form2.password2 !== '') {
            this.$refs.form2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form2.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        publicKey:'',
        loading: false,
        active: 0,
        form: {
          userName: '',
          phonenumber: '',
          email: '',
        },
        form2: {
          userID:'',
          code:'',
          password: "",
          password2: "",
        },
        form3: {
          imageurl:require("@/assets/icons/success.png"),
        },
        formRules: {
          userName: [
            { required: true, trigger: "blur", message: "用户名不能为空" }
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
        },
        formRules2: {
          code: [
            { required: true, trigger: "blur", message: "验证码不能为空" }
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
        },
      }
    },

    methods:{
      //提交form1表单的信息
      onSubmit(formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data={
              "userName":this.form.userName,
              "email": this.form.email,
              "phonenumber": this.form.phonenumber,
            }
            sendUser(data).then(res=>{

                if(res.code==200){
                  this.form2.userID=res.data;
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  });
                  this.getPublicKey();//发送完成后获取密钥
                  this.next();//步骤栏进入下一级
                  this.loading = false
                }
              },);
            }
          else {
            console.log('error submit!!');
            this.loading = false
            return false;
          }
        });

      },
      //提交form2的表单
      modifyPass(formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("sendUser publicKey,password:",this.Rsa.rsaPublicData(this.publicKey,this.form2.password));
            let data={
              "userName":this.form.userName,
              "code": this.form2.code,
              //这个Rsa方法是个全局方法，具体内容写在utils的rsa.js里面，在main.js注册全局方法
              "password":this.Rsa.rsaPublicData(this.publicKey,this.form2.password),
              "password1":this.Rsa.rsaPublicData(this.publicKey,this.form2.password2),
            }
            console.log("sendUser data:",data);
            modify(data).then(res=>{
              console.log("sendUser:",res);
              if(res.code==200){
                this.$message({
                  message: res.msg,
                  type: 'success'
                });
                this.active=3;//直接进入最后一个步骤栏
                this.loading = false
              }
            },);
          }
          else {
            console.log('error submit!!');
            this.loading = false
            return false;
          }
        });
      },

      toLogin(){
        this.$router.push({
          path: '/login',
        });
      },

      next() {
        if (this.active++ > 2) this.active = 0;
      },

      getPublicKey(){
        getPublicKey().then(res=>{
          if(res.code==200){
            this.publicKey=res.data;
          }
        },);
      }
    },
  }
</script>

<style scoped>
  .box-card {
    width: 100%;
  }
  .el-form-item{
    text-align: center;
    width: 70%;
    margin-left: 11%;
  }


</style>
