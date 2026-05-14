<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">{{ $t('command.cmdConfirm.label') }}</span>
      <el-button
        style="float: right"
        @click="sendCmd"
        type="primary"
        size="small"
        v-hasPermi="['cmd:send']"
        >{{ $t('command.cmdConfirm.execute') }}</el-button>
      <el-button
        style="float: right; margin-right: 10px"
        @click="addTimingCmd"
        type="primary"
        size="small"
        v-hasPermi="['cmd:send']"
        >{{ $t('command.cmdConfirm.taskSend.label') }}</el-button>
      <el-button
        style="float: right"
        @click="sendMultiCmd"
        type="primary"
        size="small"
        v-hasPermi="['cmd:send']"
        >{{ $t('command.cmdConfirm.multiSend.label') }}</el-button>
    </div>
    <el-form ref="form" class="table">
      <el-table
        :data="tableData"
        height="260px"
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0)"
      >
        <el-table-column
          prop="ccontent"
          :label="$t('command.cmdConfirm.table.cmdName')"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="pram"
          :label="$t('command.cmdConfirm.table.cmdContent')"
          align="center"
        ></el-table-column>
        <el-table-column :label="$t('system.operate')" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >{{ $t('system.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <cmd-timing ref="orgAddModal"></cmd-timing>
    <mult-cmd ref="multCmdModal"></mult-cmd>
  </el-card>
</template>

<script>
import eventBus from "./EventBus";
import { sendCmd, getCmds } from "@/api/command/command";
import MultCmd from "./multCmd";
import CmdTiming from "./cmdTiming";

export default {
  name: "commandConfirm",
  components: { CmdTiming, MultCmd },
  props: ["id"],
  data() {
    return {
      selectDeviceId: undefined,
      // 指令类型：0-基础指令，1-自定义指令
      cmdType: "0",
      sendTime: "",
      tableData: [],
      loading: false,
      // 指令列表
      cmdList: {}
    };
  },
  async created() {
    this.selectDeviceId = this.id;
    await this.getCmdList();

    // 确保数据加载完成后再执行后续逻辑
    await this.$nextTick();
    // console.log('cmdList 已加载:', this.cmdList);
  },
  mounted() {
    // 通过事件总线监听消息
    eventBus.$on("pushSensor", (sensorMsg) => {
      for (let i in sensorMsg) {
        this.tableData.push(sensorMsg[i]);
      }
    });
      eventBus.$on("pushSysConfig", (sysConfigMsg) => {
        for (let i in sysConfigMsg) {
          this.tableData.push(sysConfigMsg[i]);
        }
      });
      eventBus.$on("pushCommConfig", (commConfigMsg) => {
        for (let i in commConfigMsg) {
          this.tableData.push(commConfigMsg[i]);
        }
      });
    eventBus.$on("pushPath", (pathMsg) => {
      this.tableData.push(pathMsg);
    });
    eventBus.$on("pushCourseSet", (courseMsg) => {
      for (let i in courseMsg) {
        this.tableData.push(courseMsg[i]);
      }
    });
    eventBus.$on("pushAnchor", (anchorMsg) => {
      for (let i in anchorMsg) {
        this.tableData.push(anchorMsg[i]);
      }
    });
    eventBus.$on("clearCmdTable", () => {
      this.tableData = [];
    });
    eventBus.$on("pushBeacon", (anchorMsg) => {
      for (let i in anchorMsg) {
        this.tableData.push(anchorMsg[i]);
      }
    });
    eventBus.$on("pushGlider", (anchorMsg) => {
      for (let i in anchorMsg) {
        this.tableData.push(anchorMsg[i]);
      }
    });
    eventBus.$on("sendMultiCmdSuccess", (msg) => {
      this.tableData = msg;
    });
    // eventBus.$on('pushSendTime', (time) => {
    //   this.sendtime=time;
    // })
  },
  methods: {
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      this.$message({
        type: "success",
        message: "删除成功",
      });
    },
    // 指令发送，todo 目前只有铱星邮件发送一个途径，若设备没绑定铱星，则会报错
    sendCmd() {
      let cmd_list = [];
      for (let i in this.tableData) {
        let cmd = {
          cmdId: this.cmdList[this.tableData[i].cname],
          content: this.tableData[i].pram,
          deviceId: this.selectDeviceId,
          cmdType: this.cmdType, // 基础指令
        };
        cmd_list.push(cmd);
      }
      if (cmd_list.length > 0) {
        // this.loading = true; //开启加载样式
        this.$message('正在发送，请稍候')
        sendCmd(cmd_list).then((res) => {
          // this.loading = false; //有返回值之后取消加载样式
          if(res.code === 200){
            this.$message({
              message: "已成功发送" + cmd_list.length + "条指令",
              type: "success",
            });
            this.tableData = []; //清空发送列表
            eventBus.$emit("getCmdHistoryByID", this.selectDeviceId);
          }
        });
      } else {
        this.$message({
          message: "所发送指令不能少于一条",
          type: "warning",
        });
      }
    },
    // 获取指令列表
    async getCmdList() {
      await getCmds().then((res) => {
        for (let i in res.data) {
          this.cmdList[res.data[i]["code"]] = res.data[i]["id"];
        }
      });
    },

    /** 新增定时指令操作 */
    addTimingCmd() {
      let timing_list = [];
      for (let i in this.tableData) {
        let cmd = {
          cmdId: this.cmdList[this.tableData[i].cname],
          content: this.tableData[i].pram,
          deviceId: this.selectDeviceId,
          cmdType: this.cmdType,
        };
        timing_list.push(cmd);
      }
      if (timing_list.length > 0) {
        eventBus.$emit("sendTimingCmds", timing_list);
        this.$refs.orgAddModal.open = true;
        this.$refs.orgAddModal.flag = true;
        this.$refs.orgAddModal.title = this.$t('command.cmdConfirm.taskSend.title');
      } else {
        this.$message({
          message: "所发送指令不能少于一条",
          type: "warning",
        });
      }
    },
    /** 多设备发送指令 */
    sendMultiCmd() {
      let cmd_list = [];
      for (let i in this.tableData) {
        let cmd = {
          cmdId: this.cmdList[this.tableData[i].cname],
          content: this.tableData[i].pram,
          deviceId: this.selectDeviceId,
          cmdType: this.cmdType,
        };
        cmd_list.push(cmd);
      }
      if (cmd_list.length > 0) {
        eventBus.$emit("sendMultiCmd", cmd_list);
        this.$refs.multCmdModal.open = true;
        this.$refs.multCmdModal.flag = true;
        this.$refs.multCmdModal.title = this.$t('command.cmdConfirm.multiSend.title');
      } else {
        this.$message({
          message: "所发送指令不能少于一条",
          type: "warning",
        });
      }
    },
  },
  watch: {
    id: function (val) {
      this.selectDeviceId = val;
    },
  },
};
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.box-card >>> .el-card__body {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-top: 0;
}
.table {
  width: 100%;
  height: 100%;
}

.el-table {
  color: #ffffff; /*表格字体颜色*/
  background-color: #ffffff00;
}
.box-card >>> .el-table tbody tr:hover > td {
  background-color: rgba(33, 37, 41, 0.9); /*悬浮列颜色*/
  /*color:rgba(255, 255, 255, 1);!*悬浮字体颜色*!*/
}
.box-card >>> .el-table tr {
  color: #ffffff; /*表格字体颜色*/
  background-color: rgba(44, 48, 52, 1); /*表格列颜色*/
}

.box-card >>> .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  color: #ffffff; /*表头字体颜色*/
  background-color: rgba(33, 37, 41, 1); /*表头颜色*/
  text-align: center;
}

.box-card >>> .el-table__body-wrapper::-webkit-scrollbar {
  width: 0;
  /*width: 0px;*/
}
.box-card >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 0px;
  height: 50px;
  background: rgba(255, 255, 255, 0.5);
}
.box-card >>> .el-table__body-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}

#box-card >>> .top-right-btn .el-row .el-button:first-child {
  display: none;
}
</style>
