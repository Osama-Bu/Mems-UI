<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">{{ $t('command.cmdHistory.label') }}</span>
      <el-button
        style="float: right"
        @click="getCmdHistoryByID(id)"
        type="primary"
        size="small"
      >{{ $t('command.cmdHistory.button.current') }}
      </el-button>
      <el-button
        style="float: right;margin-right: 10px"
        @click="getCmdHistory"
        type="primary"
        size="small"
        v-hasPermi="['cmd:task:history']"
      >{{ $t('command.cmdHistory.button.all') }}
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        height="255px"
        v-loading="loading"
        stripe
        element-loading-background="rgba(0, 0, 0, 0)"
      >
        <el-table-column
          prop="sendTime"
          :label="$t('command.cmdHistory.table.date')"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="cdId" :label="$t('command.cmdHistory.table.deviceId')" width="80" align="center">
        </el-table-column>

        <el-table-column
          prop="cmdType"
          :label="$t('command.cmdHistory.table.cmdType')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.cmdType==='0'? '':'success'">
              {{ scope.row.cmdType==='0'?
              $t('command.cmdHistory.table.basicCmd')
              :
              $t('command.cmdHistory.table.customCmd') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="cmdName"
          :label="$t('command.cmdHistory.table.cmdName')"
          width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="sendContent"
          :label="$t('command.cmdHistory.table.cmdContent')"
          width="160"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="state" :label="$t('command.cmdHistory.table.status')" width="80" align="center">
        </el-table-column>
        <el-table-column
          :label="$t('system.operate')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-finished"
              @click="submitForm(scope.row)"
              v-hasPermi="['cmd:send']"
            >{{ $t('command.cmdHistory.table.sendAgain') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import eventBus from './EventBus'
import { sendCmd, getCmds, history, getHistoryById } from '@/api/command/command'

export default {
  name: 'cmdRecord',
  data() {
    return {
      loading: false,
      tableData: [],
      cmdList: {
        mbd: ''
      },
      commandConfig:{
        sensor_enable: { chineseName: '传感器系统P1上电', name: this.$t('otherConfig.commandConfig.sensor_enable') },
        sensor_unable: { chineseName: '传感器系统P1断电', name: this.$t('otherConfig.commandConfig.sensor_unable') },
        beidou_enable: { chineseName: '北斗P2上电', name: this.$t('otherConfig.commandConfig.beidou_enable') },
        beidou_unable: { chineseName: '北斗P2断电', name: this.$t('otherConfig.commandConfig.beidou_unable') },
        navigation_enable: { chineseName: '导航P3上电', name: this.$t('otherConfig.commandConfig.navigation_enable') },
        navigation_unable: { chineseName: '导航P3断电', name: this.$t('otherConfig.commandConfig.navigation_unable') },
        port_1_enable: { chineseName: '端口Power1上电', name: this.$t('otherConfig.commandConfig.port_1_enable') },
        port_1_unable: { chineseName: '端口Power1断电', name: this.$t('otherConfig.commandConfig.port_1_unable') },
        port_2_enable: { chineseName: '端口Power2上电', name: this.$t('otherConfig.commandConfig.port_2_enable') },
        port_2_unable: { chineseName: '端口Power2断电', name: this.$t('otherConfig.commandConfig.port_2_unable') },
        port_3_enable: { chineseName: '端口Power3上电', name: this.$t('otherConfig.commandConfig.port_3_enable') },
        port_3_unable: { chineseName: '端口Power3断电', name: this.$t('otherConfig.commandConfig.port_3_unable') },
        port_4_enable: { chineseName: '端口Power4上电', name: this.$t('otherConfig.commandConfig.port_4_enable') },
        port_4_unable: { chineseName: '端口Power4断电', name: this.$t('otherConfig.commandConfig.port_4_unable') },
        port_5_enable: { chineseName: '端口Power5上电', name: this.$t('otherConfig.commandConfig.port_5_enable') },
        port_5_unable: { chineseName: '端口Power5断电', name: this.$t('otherConfig.commandConfig.port_5_unable') },

        mbd: { chineseName: '目标点', name: this.$t('otherConfig.commandConfig.mbd') },
        p: { chineseName: '尾舵控制参数P', name: this.$t('otherConfig.commandConfig.p') },
        i: { chineseName: '尾舵控制参数I', name: this.$t('otherConfig.commandConfig.i') },
        d: { chineseName: '尾舵控制参数D', name: this.$t('otherConfig.commandConfig.d') },
        beaconTime: { chineseName: '信标机回传时间', name: this.$t('otherConfig.commandConfig.beaconTime') },
        angle_fd: { chineseName: '锚定前向距离及参数', name: this.$t('otherConfig.commandConfig.angle_fd') },
        angle_range: { chineseName: '锚定半径', name: this.$t('otherConfig.commandConfig.angle_range') },
        angle_pram: { chineseName: '锚定参数', name: this.$t('otherConfig.commandConfig.angle_pram') },
        pid_transfer: { chineseName: 'PID控制转换', name: this.$t('otherConfig.commandConfig.pid_transfer') },

        fix_heading: { chineseName: '固定航向', name: 'Fixed Heading' },
        fix_angle: { chineseName: '固定舵角', name: 'Fixed Rudder Angle' },
        deviation: { chineseName: '舵机安装误差', name: 'Servo Installation Offset' },
        radius: { chineseName: '误差圆半径', name: 'Error Circle Radius' },
        revise_heading: { chineseName: '修正舵角', name: 'Revised Rudder Angle' },

        ir9602_interval: { chineseName: '铱星9602回传间隔', name: this.$t('otherConfig.commandConfig.ir9602_interval') },
        beidou_interval: { chineseName: '北斗通信间隔', name: this.$t('otherConfig.commandConfig.beidou_interval') },

        electric_enable: { chineseName: '下位机电源使能', name: this.$t('otherConfig.commandConfig.electric_enable') },
        electric_unable: { chineseName: '下位机电源关闭', name: this.$t('otherConfig.commandConfig.electric_unable') },
        storage_enable: { chineseName: '存储使能', name: this.$t('otherConfig.commandConfig.storage_enable') },
        storage_unable: { chineseName: '存储结束', name: this.$t('otherConfig.commandConfig.storage_unable') },
        soft_ware_reset: { chineseName: '系统重启', name: this.$t('otherConfig.commandConfig.soft_ware_reset') },
      }
    }
  },
  props: {
    id: 0,
    options: Array
  },
  created() {
    this.getCmdList()
  },
  mounted() {
    // 事件总线监听消息
    eventBus.$on('getCmdHistory', (sensorMsg) => {
      this.getCmdHistory()
    })
    eventBus.$on('getCmdHistoryByID', (sensorMsg) => {
      this.getCmdHistoryByID(sensorMsg)
    })
  },
  beforeUnmount() {
    // 组件卸载时，移除当前组件绑定的监听（关键！）
    eventBus.$off("getCmdHistory", this.getCmdHistory);
    eventBus.$off("getCmdHistoryByID", this.getCmdHistoryByID);
  },
  methods: {
    getCmdName(chineseName) {
      const target = Object.values(this.commandConfig).find(
        item => item.chineseName === chineseName
      );
      return target ? target.name : chineseName;
    },

    // 再次发送，提交按钮
    submitForm(row) {
      let cmd_list = []
      let cmd = {
        cmdType: row.cmdType,
        cmdId: row.cmdId,
        content: row.sendContent,
        deviceId: row.deviceId
      }
      cmd_list.push(cmd)
      this.$message('正在发送，请稍候')
      sendCmd(cmd_list).then((res) => {

        if(res.code === 200){
          this.$message({
            message: '已成功发送' + cmd_list[0].content,
            type: 'success'
          })
          // 发送成功，刷新列表
          eventBus.$emit("getCmdHistoryByID", row.deviceId);
        }else {
          this.$message.error("发送失败")
        }
      })
    },
    // 获取全部指令历史
    getCmdHistory() {
      this.tableData = [] //清空一下列表
      this.loading = true //开启加载样式
      history().then((res) => {
        this.loading = false //有返回值之后取消加载样式
        let rows = res.data
        for (let i in rows) {
          const item = {
            id: undefined,
            deviceId: undefined,
            cdId: undefined,
            deviceName: '',
            cmdType: '',
            cmdId: undefined,
            cmdName: '',
            sendTime: '',
            sendContent: '',
            isSuccess: undefined,
            state: ''
          }
          item.id = rows[i].id
          item.cdId = rows[i].cdId
          item.deviceName = rows[i].deviceName
          item.deviceId = rows[i].deviceId
          item.sendTime = rows[i].sendTime
          item.cmdType = rows[i].cmdType
          item.cmdName = this.getCmdName(rows[i].cmdName);
          item.sendContent = rows[i].sendContent
          item.cmdId = rows[i].cmdId
          item.state = rows[i].isSuccess ? this.$t('system.success'):this.$t('system.fail');
          this.tableData.push(item)
        }
      })
    },
    // 获取当前设备指令历史（默认）
    getCmdHistoryByID(id) {
      this.tableData = [] //清空一下列表
      this.loading = true //开启加载样式
      getHistoryById(id).then((res) => {
        this.loading = false //有返回值之后取消加载样式
        let rows = res.data
        for (let i in rows) {
          const item = {
            id: undefined,
            deviceId: undefined,
            cdId: undefined,
            deviceName: '',
            cmdType: '',
            cmdId: undefined,
            cmdName: '',
            sendTime: '',
            sendContent: '',
            isSuccess: undefined,
            state: ''
          }
          item.id = rows[i].id
          item.cdId = rows[i].cdId
          item.deviceId = rows[i].deviceId
          item.deviceName = rows[i].deviceName
          item.sendTime = rows[i].sendTime
          item.cmdType = rows[i].cmdType
          item.cmdName = this.getCmdName(rows[i].cmdName);
          item.sendContent = rows[i].sendContent
          item.cmdId = rows[i].cmdId
          item.state = rows[i].isSuccess ? this.$t('system.success'):this.$t('system.fail');
          this.tableData.push(item)
        }
      })
    },
    // 获取指令列表
    getCmdList() {
      getCmds().then((res) => {
        for (let i in res.data) {
          this.cmdList[res.data[i]['code']] = res.data[i]['id']
        }
      })
    }
  },
  watch: {
    id: function(val) {

    }
  }
}
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

.el-table {
  color: #ffffff; /*表格字体颜色*/
  background-color: #ffffff00;
}

.box-card >>> .el-table tbody tr:hover > td {
  background-color: rgba(33, 37, 41, 0.9); /*悬浮列颜色*/
}

.box-card >>> .el-table tr {
  color: #ffffff; /*表格字体颜色*/
  background-color: rgba(44, 48, 52, 1); /*表格列颜色*/
}

.box-card >>> .el-table--striped .el-table__body tr.el-table__row--striped td {
  color: #ffffff; /*表格字体颜色*/
  background-color: rgba(18, 18, 0, 1); /*表格斑马列颜色*/
}

.box-card >>> .el-table--striped .el-table__body tr:hover > td {
  background-color: rgba(33, 37, 41, 0.9); /*斑马列悬浮列颜色*/
}

.box-card >>> .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  color: #ffffff; /*表头字体颜色*/
  background-color: rgba(33, 37, 41, 1); /*表头颜色*/
  text-align: center;
}

.box-card {
  width: 100%;
}

.box-card >>> .el-card__body {
  padding: 0;
}
</style>
