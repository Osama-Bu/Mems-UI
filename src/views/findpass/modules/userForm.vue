<template>
  <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
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
      <el-button type="primary" @click="onSubmit">下一步</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'userForm',
    data() {
      return {
        form: {
          userName: '',
          phonenumber: '',
          email: '',
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
      }
    },
    methods:{
      onSubmit() {
        console.log('submit!');
      },
    },

  }
</script>

<style scoped>

</style>
