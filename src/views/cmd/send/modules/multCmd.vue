<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="600px"
    append-to-body
    id="dialog2"
  >
    <el-form ref="form" label-width="120px">
      <el-row>
        <el-col>
          <el-form-item style="margin-left: 14%; width: 340px" :label="$t('command.cmdConfirm.multiSend.deviceId')">
            <el-select v-model="ids" filterable placeholder="ID" multiple>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.cdId"
                :value="item.id"
              >
                <span style="float: left"> {{ item.cdId }} </span>
                <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
                <span style="color: #8492a6; font-size: 13px"> {{item.deviceName }} </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: 14%">
        <el-button type="primary" @click="submit">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import eventBus from "./EventBus";
import { sendCmd } from "@/api/command/command";

export default {
  name: "multCmd",
  data() {
    return {
      ids: [], //设备主键id
      code: [], //设备物理id即code
      value: "",
      options: [],
      startDate: null,
      open: false,
      title: "",
      flag: false,
      sendCmdList: [],
    };
  },
  created() {
    eventBus.$on("pushGliderMultiCmd", (sensorMsg) => {
      // console.log("pushGliderMultiCmd 触发", sensorMsg); // 看后续是否有触发且值为空
      this.options = sensorMsg;
    });
    // 通过事件总线监听消息
    eventBus.$on("sendMultiCmd", (sensorMsg) => {
      // console.log("sendMultiCmd 触发", sensorMsg); // 看后续是否有触发且值为空
      this.sendCmdList = sensorMsg;
    });
  },

  methods: {
    /** 提交按钮 */
    submit: function () {
      let cmd_list = [];
      for (let i of this.ids) {
        for (let j in this.options) {
          if (this.options[j].id === i) {
            for (let cmd of this.sendCmdList) {
              let str_list = cmd.content.split(","); //字符串转数组
              // 替换设备自定义ID，todo 区分端口上电断电等指令
              str_list[1] = this.options[j].cdId;
              let content = str_list.join(",");
              let cmd_elem = {
                cmdId: cmd.cmdId,
                content: content,
                deviceId: this.options[j].id,
                cmdType: cmd.cmdType
              };
              cmd_list.push(cmd_elem);
            }
          }
        }
      }

      if (cmd_list.length > 0) {
        this.loading = true; //开启加载样式
        sendCmd(cmd_list).then((res) => {
          if(res.code === 200){
            const h = this.$createElement;
            let cmd_str = [];
            for (let cmd of cmd_list) {
              cmd_str.push(h("p", null, cmd.content));
            }

            this.$message({
              message: "已成功发送" + cmd_list.length + "条指令",
              type: "success",
            });

            // 已发送指令显示
            this.$notify({
              title: "指令详情",
              message: h("i", { style: "color: teal" }, cmd_str),
            });

            // 清空指令确认列表中待发送指令
            eventBus.$emit("sendMultiCmdSuccess", []);
            // 关闭窗口
            this.cancel();
          }
        });
      } else {
        this.$message({
          message: "所发送指令不能少于一条",
          type: "warning",
        });
      }
    },

    // 取消按钮
    cancel() {
      this.open = false;
    },
  },
  mounted() {
  },
  beforeDestroy() {
    // 必须解绑，避免组件销毁后仍监听导致内存泄漏
    eventBus.$off('sendMultiCmd', this.submit);
    eventBus.$off('pushGliderMultiCmd', this.submit);
    eventBus.$off("sendMultiCmdSuccess");
  },
};
</script>

<style scoped>
</style>
