<template>
  <div id="main">
    <el-form ref="form" label-width="160px">
      <el-form-item :label="$t('command.navigateConfig.fixed_heading')">
        <el-input
          v-model="course_set.fix_heading"
          style="width: 49%"
          size="mini"
          :placeholder="$t('command.navigateConfig.value')+'：0~359'"
        ></el-input>
        <el-input
          v-model="course_set.fix_heading_2"
          style="width: 49%; margin-left: 2%"
          size="mini"
          :placeholder="$t('command.navigateConfig.default_status')+':1'"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('command.navigateConfig.fixed_rudder_angle')">
        <el-input
          v-model="course_set.fix_angle"
          style="width: 49%"
          size="mini"
          :placeholder="$t('command.navigateConfig.value')+'：-45~45'"
        ></el-input>
        <el-input
          v-model="course_set.fix_angle_2"
          style="width: 49%; margin-left: 2%"
          size="mini"
          :placeholder="$t('command.navigateConfig.default_status')+':1'"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('command.navigateConfig.error_circle_radius')">
        <el-input
          v-model="course_set.radius"
          size="mini"
          placeholder="0~9999"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('command.navigateConfig.tail_rudder_error')">
        <el-input
          v-model="course_set.deviation"
          size="mini"
          placeholder="-40~40"
        ></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import eventBus from "./EventBus";
export default {
  name: "courseSet",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {
      selectDeviceId: undefined,
      course_set: {
        fix_heading: "",
        fix_heading_2: "",
        fix_angle: "",
        fix_angle_2: "",
        deviation: "",
        radius: "",
        revise_heading: "",
      },
      transfer_data: {
        fix_heading: "gdhx",
        fix_angle: "gddj",
        deviation: "djanzhwch",
        radius: "wchybj",
        revise_heading: "xzdj",
      },
      transfer_content: {
        fix_heading: this.$t('otherConfig.commandConfig.fix_heading'),
        fix_angle: this.$t('otherConfig.commandConfig.fix_angle'),
        deviation: this.$t('otherConfig.commandConfig.deviation'),
        radius: this.$t('otherConfig.commandConfig.radius'),
        revise_heading: this.$t('otherConfig.commandConfig.revise_heading'),
      },
      course_list: [],
    };
  },
  created() {
    this.selectDeviceId = this.deviceId;
  },
  methods: {
    pushCourseSet() {
      // 通过事件总线发送消息
      let command_str = "";
      for (let key in this.course_set) {
        if (this.course_set[key] !== "" && key !== "fix_heading_2" && key !== "fix_angle_2") {
          //如果数据值不为空意味着要发送此命令
          switch (key) {
            case "deviation":
              command_str = "$Q," + this.deviceCdId + "," + 3 + "," + this.course_set[key] + ",*";
              break;
            case "fix_angle":
              if (this.course_set.fix_angle_2 === 1 || this.course_set.fix_angle_2 === "") {
                command_str = "$Q," + this.deviceCdId + "," + 7 + "," + 1 + "," + this.course_set[key] + ",*";
              } else {
                command_str = "$Q," + this.deviceCdId + "," + 7 + "," + 0 + "," + this.course_set[key] + ",*";
              }
              break;
            case "fix_heading":
              if (this.course_set.fix_heading_2 === 1 || this.course_set.fix_heading_2 === "") {
                command_str = "$Q," + this.deviceCdId + "," + 8 + "," + 1 + "," + this.course_set[key] + ",*";
              } else {
                command_str = "$Q," + this.deviceCdId + "," + 8 + "," + 0 + "," + this.course_set[key] + ",*";
              }
              break;
            case "radius":
              command_str = "$Q," + this.deviceCdId + "," + 5 + "," + this.course_set[key] + ",*";
              break;
            case "revise_heading":
              command_str = "$Q," + this.deviceCdId + "," + 1 + "," + this.course_set[key] + ",*";
              break;
          }
          this.course_list.push({
            ccontent: this.transfer_content[key],
            cname: this.transfer_data[key],
            pram: command_str,
          });
        }
        this.course_set[key] = "";
      }
      eventBus.$emit("pushCourseSet", this.course_list);
      this.course_list = [];
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
  margin-top: 0;
  margin-bottom: 0;
  width: 90%;
}
</style>
