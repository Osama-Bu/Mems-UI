<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span style="color: #06f1ef">导航配置</span>
      <el-button
        style="float: right"
        @click="pushMethod"
        type="primary"
        plain
        size="small"
        v-hasPermi="['cmd:send']"
      >
        更新指令
      </el-button>
    </div>
    <div id="main">
      <el-row :gutter="24">
        <el-col :span="12" style="padding-left: 0">
          <cmd-beacon
            :deviceId="deviceId"
            :deviceCdId="deviceCdId"
            ref="cmdBeacon"/>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import cmdBeacon from "./cmdBeacon";
import pathTrack from "../../modules/./pathTrack";
import courseSet from "../../modules/./courseSet";
export default {
  name: "navigationConfigBeacon",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  components: { cmdBeacon, pathTrack, courseSet },
  data() {
    return {
      // 暂未使用
      selectDeviceId: undefined,
    };
  },
  created() {
    this.selectDeviceId = this.deviceId;
  },
  methods: {
    pushMethod() {
      this.$refs.cmdBeacon.pushBeacon();
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
#main >>> .el-form-item {
  margin-bottom: 0;
  color: #ffffff;
}
#main >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0);
  color: #ffffff;
}
#main >>> .el-form-item__label {
  color: #ffffff;
}
</style>
