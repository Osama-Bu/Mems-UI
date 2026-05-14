<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body  id="dialog2">
    <el-form ref="form"  label-width="120px">
      <el-row>
        <el-col >
          <el-form-item style="margin-left: 14%;width:340px;" :label="$t('command.cmdConfirm.taskSend.taskName')" prop="taskname">
            <el-select v-model="value" filterable placeholder="ID">
              <el-option v-for="item in options" :key="item.value" :label="item.name"
                         :value="item.value">
                <span style="float: left">{{ item.value }}</span>
                <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
                <span style=" color: #8492a6; font-size: 13px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: 14%">
        <el-button type="primary" @click="submit" v-hasPermi="['cmd:task:add']">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import eventBus from './EventBus'
  import { getCurrentTimingTaskID, addCmdToTask } from '@/api/command/command'
  export default {
    name: 'cmdTiming',
    data(){
      return{
        value:'',
        options: [],
        taskname:'',
        startDate:null,
        open: false,
        title: '',
        flag:false,
        sendcmds:[],
      }
    },
    created() {

      this.getTaskList()
      this.id = this.$route.query.deviceId;
    },
    methods:{
      /** 提交按钮 */
      submit: function() {
        addCmdToTask(this.value,this.sendcmds).then(res => {
          if (res.code === 200) {
            eventBus.$emit('clearCmdTable')//用以清空指令列表
            eventBus.$emit('refreshTimingTask')//用以刷新定时任务管理列表
            this.$message({
              message: '已成功添加定时任务',
              type: 'success'
            });
          } else {
            alert("请重新链接");
          }
        });
        this.cancel()
      },

      // 取消按钮
      cancel() {
        this.open = false;
      },
      getTaskList(){
        getCurrentTimingTaskID().then(res => {
          if (res.code !== 200) {
            alert("请重新链接");
          } else {
            this.options = [];
            for (let item of res.data) {
              const temp = {
                value: item.taskId,
                name: item.taskName,
              };
              this.options.push(temp);
            }
            if (!this.$route.query.deviceId) {
              this.id = this.options.value; //给id付一个初始值
            }
          }
        });
      },

    },
    mounted() {
      // 通过事件总线监听消息
      eventBus.$on('sendTimingCmds', (sensorMsg) => {
        this.sendcmds=sensorMsg
      })
      //当新增任务后，刷新任务相关列表
      eventBus.$on('refreshTimingTask', () => {
        this.getTaskList();
      })
    },
  }
</script>

<style scoped>

</style>
