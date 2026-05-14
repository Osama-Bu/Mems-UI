<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">{{ $t('command.sensorConfig.label') }}</span>
      <el-button
        style="float: right"
        @click="pushSensor"
        type="primary"
        plain
        size="small"
        v-hasPermi="['cmd:send']"
        >
        {{ $t('command.updateCmd') }}
      </el-button>
    </div>
    <el-form
      ref="form"
      label-width="160px"
      style="height: 110px; margin-top: 0"
    >
      <div id="main">
        <el-form-item :label="$t('command.sensorConfig.p1_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.sensor_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item :label="$t('command.sensorConfig.p1_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.sensor_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item :label="$t('command.sensorConfig.p2_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.beidou_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item :label="$t('command.sensorConfig.p2_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.beidou_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>

        <el-form-item :label="$t('command.sensorConfig.p3_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.navigation_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.p3_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.navigation_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power1_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_1_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power1_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_1_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power2_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_2_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power2_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_2_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power3_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_3_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power3_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_3_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power4_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_4_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power4_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_4_unable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power5_up')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_5_enable"
            active-color="#13ce66"
            inactive-color="#808080"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('command.sensorConfig.power5_down')+':'" class="sensorClass">
          <el-switch
            v-model="switch_data.port_5_unable"
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
  name: "sensorConfig",
  components: {},
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {
      selectDeviceId: undefined,
      switch_data: {
        sensor_enable: false,
        sensor_unable: false,
        beidou_enable: false,
        beidou_unable: false,
        navigation_enable: false,
        navigation_unable: false,
        port_1_enable: false,
        port_1_unable: false,
        port_2_enable: false,
        port_2_unable: false,
        port_3_enable: false,
        port_3_unable: false,
        port_4_enable: false,
        port_4_unable: false,
        port_5_enable: false,
        port_5_unable: false,
      },
      transfer_data: {
        sensor_enable: "p1sd",
        sensor_unable: "p1dd",
        beidou_enable: "p2sd",
        beidou_unable: "p2dd",
        navigation_enable: "p3sd",
        navigation_unable: "p3dd",
        port_1_enable: "pp1sd",
        port_1_unable: "pp1dd",
        port_2_enable: "pp2sd",
        port_2_unable: "pp2dd",
        port_3_enable: "pp3sd",
        port_3_unable: "pp3dd",
        port_4_enable: "pp4sd",
        port_4_unable: "pp4dd",
        port_5_enable: "pp5sd",
        port_5_unable: "pp5dd",
      }, //此数据用来把变量和指令确认命令里要显示的内容做映射
      transfer_content: {
        sensor_enable: this.$t('otherConfig.commandConfig.sensor_enable'),
        sensor_unable: this.$t('otherConfig.commandConfig.sensor_unable'),
        beidou_enable: this.$t('otherConfig.commandConfig.beidou_enable'),
        beidou_unable: this.$t('otherConfig.commandConfig.beidou_unable'),
        navigation_enable: this.$t('otherConfig.commandConfig.navigation_enable'),
        navigation_unable: this.$t('otherConfig.commandConfig.navigation_unable'),
        port_1_enable: this.$t('otherConfig.commandConfig.port_1_enable'),
        port_1_unable: this.$t('otherConfig.commandConfig.port_1_unable'),
        port_2_enable: this.$t('otherConfig.commandConfig.port_2_enable'),
        port_2_unable: this.$t('otherConfig.commandConfig.port_2_unable'),
        port_3_enable: this.$t('otherConfig.commandConfig.port_3_enable'),
        port_3_unable: this.$t('otherConfig.commandConfig.port_3_unable'),
        port_4_enable: this.$t('otherConfig.commandConfig.port_4_enable'),
        port_4_unable: this.$t('otherConfig.commandConfig.port_4_unable'),
        port_5_enable: this.$t('otherConfig.commandConfig.port_5_enable'),
        port_5_unable: this.$t('otherConfig.commandConfig.port_5_unable'),
      },
      switch_list: [],
    };
  },
  created() {
    this.selectDeviceId = this.deviceId;
  },
  methods: {
    pushSensor() {
      // hex转String,port_1_enable至port_5_unable专用
      let hexToString = function (hex) {
        const arr = hex.split("");
        let out = "";
        for (let i = 0; i < arr.length / 2; i++) {
          const tmp = "0x" + arr[i * 2] + arr[i * 2 + 1];
          const charValue = String.fromCharCode(tmp);
          out += charValue;
        }
        return out;
      };
      // 通过事件总线发送消息
      let command_str = "";
      let numericDeviceCdId = parseInt(this.deviceCdId, 10);
      let hexString = numericDeviceCdId
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");

      let highByte = hexString.slice(0, 2); // 高位字节
      let lowByte = hexString.slice(2, 4); // 低位字节
      // 拼接成大端格式
      hexString = lowByte + highByte;
      for (let key in this.switch_data) {
        //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
        if (this.switch_data[key]) {
          //如果switch中的数据值是true意味着要发送此命令
          switch (key) {
            case "sensor_enable":
              command_str =
                "$Q," + this.deviceCdId + "," + "G" + "," + 1 + ",*";
              break;
            case "sensor_unable":
              command_str =
                "$Q," + this.deviceCdId + "," + "G" + "," + 0 + ",*";
              break;
            case "beidou_enable":
              command_str =
                "$Q," + this.deviceCdId + "," + "I" + "," + 1 + ",*";
              break;
            case "beidou_unable":
              command_str =
                "$Q," + this.deviceCdId + "," + "I" + "," + 0 + ",*";
              break;
            case "navigation_enable":
              command_str =
                "$Q," + this.deviceCdId + "," + "P" + "," + 1 + ",*";
              break;
            case "navigation_unable":
              command_str =
                "$Q," + this.deviceCdId + "," + "P" + "," + 0 + ",*";
              break;
            case "port_1_enable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50312C312C2A2A");
              break;
            case "port_1_unable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50312C302C2A2A");
              break;
            case "port_2_enable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50322C312C2A2A");
              break;
            case "port_2_unable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50322C302C2A2A");
              break;
            case "port_3_enable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50332C312C2A2A");
              break;
            case "port_3_unable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50332C302C2A2A");
              break;
            case "port_4_enable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50342C312C2A2A");
              break;
            case "port_4_unable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50342C302C2A2A");
              break;
            case "port_5_enable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50352C312C2A2A");
              break;
            case "port_5_unable":
              command_str =
                hexToString("2452") +
                hexToString(hexString) +
                hexToString("1500245357495443482C50352C302C2A2A");
              break;
          }
          this.switch_list.push({
            ccontent: this.transfer_content[key],
            cname: this.transfer_data[key],
            pram: command_str,
          });
          this.switch_data[key] = false; //这个作用是把数据放入发送指令列表中后，数据清零
        }
      }
      eventBus.$emit("pushSensor", this.switch_list); //新版协议使用后，解开注释
      this.switch_list = [];
    },
  },
  watch: {
    deviceId: function (val) {
      this.selectDeviceId = val;
    },
  },
};
</script>

<style  scoped>
.sensorClass {
  margin-top: 0;
  margin-bottom: 0;
}
#main {
  height: 100px;
}

#main >>> .el-form-item {
  margin-bottom: 0;
  color: #ffffff;
}
#main >>> .el-form-item__label {
  color: #ffffff;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 240px;
  height: 100%;
}
</style>
