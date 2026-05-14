<template>
  <div class="app-container">
    <!--      添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="querydealParams" :model="querydealParams" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('deviceInfo.alarmContent.handleAlarm.option')">
              <el-input v-model="opinion" type="textarea"
                        :placeholder="$t('deviceInfo.alarmContent.handleAlarm.tips')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { UpdateAlarmInfo } from '@/api/alarm/alarminfo'
export default {
  name: 'AlarmDealed',
  components: {
      Treeselect
  },
  data() {
    return {
      title: "",
      open: false,
      flag: false,
      add: true,
      opinion: "",
      id:"",
      querydealParams: {
        dealTime: "",
        dealed: undefined,
        id: undefined,
        opinion: "",
        status: "0",
      },
    }
  },
  created() {
  },
  methods: {
    //提交新增或修改的表单信息
    submitForm: function () {
      const now = Date.now();
        const noww = new Date(now);
        const offset = 8 * 60; // 北京时间的时区偏移为 UTC+8
        noww.setMinutes(noww.getMinutes() + offset); // 添加时区偏移量
        const formattedDateTimeString = noww.toISOString()
          .replace("T", " ").slice(0, -5);
        this.querydealParams.dealTime = formattedDateTimeString;
        if (this.flag) {
          this.flag = false
          this.$refs['querydealParams'].validate(valid => {
              if (valid) {
                  this.querydealParams.opinion = this.opinion;
                  this.querydealParams.id = this.id;
                  this.querydealParams.dealed = true;
                  UpdateAlarmInfo(this.querydealParams).then(res => {
                      this.msgSuccess('处理成功')
                      this.open = false
                      this.$emit('ok', '')
                      this.querydealParams.dealed = true;
                  })
              } else {
                  this.flag = true
              }
          })
      }
    },
    //关闭新增或修改页面
    cancel() {
      this.open = false
    },
  }
}
</script>

<style scoped></style>
