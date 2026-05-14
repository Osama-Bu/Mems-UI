<template>
  <el-form-item>
    <dv-border-box-8 style="height: 35px;width: 70px;margin-bottom:30px;">
      <el-button type="text"
                 style="margin-left:0;height: 35px;width: 70px;"
                 size="medium"
                 @click="onSubmit"
                 v-hasPermi="['vue:view:cmd']">
        确认
      </el-button>
    </dv-border-box-8>
  </el-form-item>
</template>

<script>
  export default {
    name: 'datavButton'
  }
</script>

<style scoped>

</style>
