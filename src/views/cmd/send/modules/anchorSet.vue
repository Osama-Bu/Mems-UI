<template>
  <div id="main">
    <el-form ref="form" label-width="160px">
      <el-form-item label="PID">
        <el-input
          v-model="anchor_set.p"
          style="width: 32%"
          :placeholder="'P:'+$t('command.navigateConfig.integer')"
          size="mini"
        ></el-input>
        <el-input
          v-model="anchor_set.i"
          style="width: 32%; margin-left: 2%"
          :placeholder="'I:'+$t('command.navigateConfig.integer')"
          size="mini"
        ></el-input>
        <el-input
          v-model="anchor_set.d"
          style="width: 32%; margin-left: 2%"
          :placeholder="'D:'+$t('command.navigateConfig.integer')"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('command.navigateConfig.anchoring_radius')">
        <el-input
          v-model="anchor_set.angle_range"
          size="mini"
          placeholder="0~200"
          >
          <template slot="suffix">
            {{ $t('system.meter') }}
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('command.navigateConfig.rotation_distance')">
        <el-input v-model="anchor_set.angle_fd" size="mini" style="width: 49%">
          <template slot="suffix">
            {{ $t('system.meter') }}
          </template>
        </el-input>
        <el-select
          v-model="anchor_set.angle_pram"
          size="mini"
          placeholder="方向"
          style="width: 49%; margin-left: 2%"
        >
          <el-option :label="$t('command.navigateConfig.clock')" value="1"></el-option>
          <el-option :label="$t('command.navigateConfig.antiClock')" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('command.navigateConfig.interval_beacon')" class="item" >
          <el-input v-model="anchor_set.beaconTime" size="mini" >
            <template slot="suffix">
              {{ $t('system.time.minute') }}
            </template>
          </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import eventBus from "./EventBus";
export default {
  name: "anchorSet",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {
      selectDeviceId: undefined,
      anchor_set: {
        p: "",
        i: "",
        d: "",
        beaconTime:"",
        angle_fd: "",
        angle_range: "",
        angle_pram: this.$t('command.navigateConfig.clock'),
        pid_transfer: "",
      },
      transfer_data: {
        p: "ddP",
        i: "ddI",
        d: "ddD",
        beaconTime:'xbjhcsj',
        angle_fd: "mdcsh",
        angle_range: "mdbj",
        angle_pram: "mdcs",
        pid_transfer: "PIDczzh",
      },
      transfer_content: {
        p: this.$t('otherConfig.commandConfig.p'),
        i: this.$t('otherConfig.commandConfig.i'),
        d: this.$t('otherConfig.commandConfig.d'),
        beaconTime: this.$t('otherConfig.commandConfig.beaconTime'),
        angle_fd: this.$t('otherConfig.commandConfig.angle_fd'),
        angle_range: this.$t('otherConfig.commandConfig.angle_range'),
        angle_pram: this.$t('otherConfig.commandConfig.angle_pram'),
        pid_transfer: this.$t('otherConfig.commandConfig.pid_transfer'),
      },
      anchor_list: [],
    };
  },
  mounted(){
      //信标机回传间隔自定义label颜色
      this.updateDynamicStyle();
  },
  created() {

  },
  methods: {
    updateDynamicStyle() {
      const label = document.querySelector('.item .el-form-item__label');
      if (label) {
        // 动态设置样式,设置信标机回传间隔标题颜色
        label.style.color = '#06f1ef';
      }
    },
    pushAnchor() {
      // 通过事件总线发送消息
      let command_str = "";
      for (let key in this.anchor_set) {
        if (this.anchor_set[key] !== "" && key !== "angle_pram") {
          switch (key) {
            case "p":
              command_str =
                "$Q," +
                this.deviceCdId +
                "," +
                4 +
                "," +
                this.anchor_set[key] +
                ",*";
              break;
            case "i":
              command_str =
                "$Q," +
                this.deviceCdId +
                "," +
                "A" +
                "," +
                this.anchor_set[key] +
                ",*";
              break;
            case "d":
              command_str =
                "$Q," +
                this.deviceCdId +
                "," +
                6 +
                "," +
                this.anchor_set[key] +
                ",*";
              break;
            case "angle_range":
              command_str =
                "$Q," +
                this.deviceCdId +
                "," +
                "D" +
                "," +
                this.anchor_set[key] +
                ",*";
              break;
            case "angle_fd":
              if (
                this.anchor_set.angle_pram === this.$t('command.navigateConfig.clock') ||
                this.anchor_set.angle_pram === ""
              ) {
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  "E" +
                  "," +
                  1 +
                  "," +
                  this.anchor_set[key] +
                  ",*";
              } else {
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  "E" +
                  "," +
                  0 +
                  "," +
                  this.anchor_set[key] +
                  ",*";
              }
              break;
            case "pid_transfer":
              command_str =
                "$Q," +
                this.deviceCdId +
                "," +
                "B" +
                "," +
                this.anchor_set[key] +
                ",*";
              break;
              case "beaconTime":
                command_str=
                "$,"+
                "T"+
                ","+
                this.anchor_set[key]+
                ",*";
          }
          this.anchor_list.push({
            ccontent: this.transfer_content[key],
            cname: this.transfer_data[key],
            pram: command_str,
          });
          this.anchor_set[key] = "";
        }
      }
      eventBus.$emit("pushAnchor", this.anchor_list);
      this.anchor_list = [];
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

  .el-form-item {
    display: inline-block;
    width: 87%;
    margin-top: 0;
    margin-bottom:  0;
  }
</style>
