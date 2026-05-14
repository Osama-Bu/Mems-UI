<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body  id="dialog2">
    <el-form ref="form" :model="form" :rules="rules" width="500px" label-width="140px">
      <el-row>
        <el-col :span="20">
          <el-form-item :label="$t('command.taskManage.add.taskName')" prop="taskName">
            <el-input v-model="form.taskName" :placeholder="$t('command.taskManage.add.tip1')" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.taskManage.add.taskType')">
            <el-radio v-model="form.taskType" label='0'>{{ $t('command.taskManage.add.schedule') }}</el-radio>
            <el-radio v-model="form.taskType" label='1'>{{ $t('command.taskManage.add.recur') }}</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.taskManage.add.interval')" prop="sendInterval" >
            <el-input v-model="form.timeInterval" :placeholder="$t('command.taskManage.add.tip2')" :disabled="form.time_interval" >
              <template slot="suffix">
                {{ $t('system.time.second') }}
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item :label="$t('command.taskManage.add.sendTime')" prop="sendTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              value-format="timestamp"
              :disabled="form.time_send"
              :placeholder="$t('command.taskManage.add.tip3')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: 14%">
        <el-button type="primary" @click="submitForm" v-hasPermi="['cmd:task:add']">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import { addTimingTask } from '@/api/command/command'
import eventBus from './EventBus'
export default {
  name: 'addTimingTask',
  components: {
    Treeselect,
  },
  data(){
    return{
      open: false,
      form: {
        taskName:'',
        taskType:'0',
        timeInterval:0,
        startTime:'',
        time_interval:true,
        time_send:false,
      },
      rules:{
        taskName: [
          { required: true, trigger: "blur", message: this.$t('command.taskManage.add.rule1') }
        ],
      },
      title: '',
      flag:false
    }
  },
  created() {

  },
  methods:{
    /** 提交按钮 */
    submitForm: function() {
      if(this.flag){
        this.flag = false
        this.$refs["form"].validate(valid => {
          if (valid) {
            const queryParam={
              taskName: this.form.taskName,
              taskType: parseInt(this.form.taskType),
              timeInterval: this.form.timeInterval,
              startTime: this.form.startTime/1000,
            }
            addTimingTask(queryParam).then(response => {
              if (response.code === 200) {
                eventBus.$emit('refreshTimingTask','ok')
                this.$message({
                  message: '已成功添加定时任务',
                  type: 'success'
                });
                this.form={}//清空表单
              }
            });

            this.cancel()//关闭页面
          }else{
            this.flag = true
          }
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
  },
  watch: {
    'form.taskType': function(newx, oldx) {
      if (newx === '0'){
        this.form.time_interval = true
        this.form.time_send = false
      }else if (newx === '1'){
        this.form.time_interval = false
        this.form.time_send = false
      }
    },
  },
}


</script>

<style scoped>

</style>
