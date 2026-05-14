<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">{{ $t('command.systemConfig.label') }}</span>
      <el-button
        style="float: right"
        @click="pushSysConfig"
        type="primary"
        plain
        size="small"
        v-hasPermi="['cmd:send']"
        >
        {{ $t('command.updateCmd') }}
      </el-button>
    </div>

    <el-form ref="form" label-width="115px">
      <div id="main">
        <el-form-item
          :label="$t('command.systemConfig.restart')+':'"
          label-width="120"
          style="display: inline-block"
        >
          <el-switch
            v-model="sys_config.soft_ware_reset"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          :label="$t('command.systemConfig.storage_start')+':'"
          label-width="120px"
          style="display: inline-block"
        >
          <el-switch
            v-model="sys_config.storage_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          :label="$t('command.systemConfig.storage_end')+':'"
          label-width="120px"
          style="display: inline-block"
        >
          <el-switch
            v-model="sys_config.storage_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item
          :label="$t('command.systemConfig.power_up')+':'"
          label-width="150px"
          style="display: inline-block">
          <el-switch
            v-model="sys_config.electric_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('command.systemConfig.power_down')+':'"
          label-width="150px"
          style="display: inline-block; margin-left: 40px"
        >
          <el-switch
            v-model="sys_config.electric_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import eventBus from "./EventBus";
export default {
  name: "systemConfig",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {

      sys_config: {
        electric_enable: false,
        electric_unable: false,
        storage_enable: false,
        storage_unable: false,
        soft_ware_reset: false,
      },
      transfer_data: {
        electric_enable: "xwjdyshn",
        electric_unable: "xwjdyshn",
        storage_enable: "cchshn",
        storage_unable: "cchshn",
        soft_ware_reset: "xtchq",
      },
      transfer_content: {
        electric_enable: this.$t('otherConfig.commandConfig.electric_enable'),
        electric_unable: this.$t('otherConfig.commandConfig.electric_unable'),
        storage_enable: this.$t('otherConfig.commandConfig.storage_enable'),
        storage_unable: this.$t('otherConfig.commandConfig.storage_unable'),
        soft_ware_reset: this.$t('otherConfig.commandConfig.soft_ware_reset'),
      },
      sysConfigList: [],
    };
  },
  created() {

  },
  methods: {
    pushSysConfig() {
      // 通过事件总线发送消息
      let command_str = "";
      for (let key in this.sys_config) {
        //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
        if (this.sys_config[key]) {
          //如果数据值是true意味着要发送此命令
          switch (key) {
            case "soft_ware_reset":
              command_str = "$Q," + this.deviceCdId + "," + 0 + ",*";
              break;
            case "electric_enable":
              command_str =
                "$Q," + this.deviceCdId + "," + 9 + "," + 1 + ",*";
              break;
            case "electric_unable":
              command_str =
                "$Q," + this.deviceCdId + "," + 9 + "," + 0 + ",*";
              break;
            case "storage_enable":
              command_str =
                "$Q," + this.deviceCdId + "," + "C" + "," + 1 + ",*";
              break;
            case "storage_unable":
              command_str =
                "$Q," + this.deviceCdId + "," + "C" + "," + 0 + ",*";
              break;
          }
          this.sysConfigList.push({
            ccontent: this.transfer_content[key],
            cname: this.transfer_data[key],
            pram: command_str,
          });
          this.sys_config[key] = false; //这个作用是把数据放入发送指令列表中后，数据清零
        }
      }
      eventBus.$emit("pushSysConfig", this.sysConfigList);
      this.sysConfigList = [];
    },
  },
  watch: {
    deviceId: function (val) {

    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  width: 32%;
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
