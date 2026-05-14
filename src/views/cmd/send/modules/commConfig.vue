<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">{{ $t('command.commConfig.label') }}</span>
      <el-button
        style="float: right"
        @click="pushComConfig"
        type="primary"
        plain
        size="small"
        v-hasPermi="['cmd:send']"
        >{{ $t('command.updateCmd') }}</el-button>
    </div>
    <el-form
      ref="form"
      label-width="160px"
      style="display:inline-block;margin-left:0;margin-right:0"
    >
      <div id="main">
        <el-form-item :label="$t('command.commConfig.interval_9602')">
          <el-input v-model="comm_config.ir9602_interval" size="mini">
            <template slot="suffix">
              {{ $t('system.time.second') }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('command.commConfig.interval_bd')">
          <el-input v-model="comm_config.beidou_interval" size="mini">
            <template slot="suffix">
              {{ $t('system.time.second') }}
            </template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import eventBus from "./EventBus";
export default {
  name: "commConfig",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {
      // 暂未用到
      selectDeviceId: undefined,

      comm_config: {
        ir9602_interval: "",
        beidou_interval: "",
      },

      //此数据用来把变量和指令确认命令里要显示的内容做映射
      transfer_data: {
        ir9602_interval: "yxhchjg",
        beidou_interval: "bdtxjg",
      },

      transfer_content: {
        ir9602_interval: this.$t('otherConfig.commandConfig.ir9602_interval'),
        beidou_interval: this.$t('otherConfig.commandConfig.beidou_interval'),
      },

      //把数据处理成指令确认组件能直接识别的list
      commConfigList: [],
    };
  },
  created() {
    this.selectDeviceId = this.deviceId;
  },
  methods: {
    pushComConfig() {
      for (let key in this.comm_config) {
        let command_str = "";
        if (this.comm_config[key] !== "" && key !== "beidou_interval") {
          switch (key) {
            case "ir9602_interval":
              command_str = "$Q," + this.deviceCdId + "," + 2 + "," + this.comm_config[key] + "," + 400 + ",*";
              break;
            case "beidou_interval":
              // todo 北斗通信间隔指令还未启用
              break;
          }
          this.commConfigList.push({
            ccontent: this.transfer_content[key],
            cname: this.transfer_data[key],
            pram: command_str,
          });
          this.comm_config[key] = "";
        }
      }
      eventBus.$emit("pushCommConfig", this.commConfigList);
      this.commConfigList = [];
    },
  },
  watch: {
    deviceId: function (val) {
      this.selectDeviceId = val;
    },
  },
};
</script>

<style scoped>
#lable >>> .el-form-item__label {
  font-family: "Microsoft YaHei", Arial, sans-serif;
  font-size: 22px;
  color: #02ccfe;
  display: inline-block;
  font-weight: normal;
  margin-left: 0;
}

.el-form-item {
  margin-left: 3%;
  margin-top: 0;
  margin-bottom: 0;
  width: 85%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

#main >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0);
  color: #ffffff;
}
#main >>> .el-form-item__label {
  color: #ffffff;
}
.box-card {
  height: 100%;
}
</style>
