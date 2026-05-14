<template>
  <el-container id="main">
    <el-header style="padding-left: 0">
      <div class="top-back"></div>
      <div class="navbar" v-if="showNavbar">
        <navbar />
      </div>
      <div class="topTitleBox">
        <div class="dateTimeBox">
          <p class="dateText">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</p>
        </div>
        <div style="position: absolute; top: 35px; left: 60px">
          <div>
            <el-form ref="id" label-width="80px">
              <el-form-item :label="$t('command.top.deviceId')" id="lable" v-hasPermi="['cmd:send']">
                <el-select
                  v-model="selectDeviceId"
                  filterable
                  placeholder="ID"
                  style="margin-left: 0; width: 95px"
                  size="mini"
                  @change="idChanged()"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.cdId"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.cdId }}</span>
                    <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
                    <span style="color: #8492a6; font-size: 13px">{{ item.deviceName }}</span>
                  </el-option>
                </el-select>
                <el-button
                  style="margin-left: 15px"
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="customCmd"
                  v-hasPermi="['cmd:custom:all']"
                  >{{ $t('command.top.customCmd') }}
                </el-button>
                <el-button
                  style="margin-left: 15px"
                  type="primary"
                  plain
                  icon="el-icon-timer"
                  size="mini"
                  @click="TimingTask"
                  v-hasPermi="['cmd:task:add']"
                  >{{ $t('command.top.taskManage') }}
                </el-button>
                <el-button
                  style="margin-left: 15px"
                  type="primary"
                  plain
                  icon="el-icon-s-grid"
                  size="mini"
                  @click="globalCmd"
                  v-hasPermi="['cmd:all']"
                  >{{ $t('command.top.globalCmd') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-header>
    <el-container style="margin-top: 20px">
      <el-aside
        style="
          background-color: #ffffff00;
          width: 240px;
          padding-left: 0;
          padding-right: 0;
          margin-bottom: 0;
          padding-bottom: 0;
        "
      >
        <!--传感器配置-->
        <sensor-config :deviceId="selectDeviceId" :deviceCdId="selectDeviceCdId" />
      </el-aside>

      <el-main style="padding-top: 8px; padding-left: 5px">
        <el-row :gutter="22">
          <el-col :span="14" style="padding-right: 5px">
            <el-row>
              <!--导航配置-->
              <el-col :span="24">
                <navigation-config :deviceId="selectDeviceId" :deviceCdId="selectDeviceCdId" />
              </el-col>
            </el-row>
            <el-row :span="14" style="margin-top: 0.6%; margin-left: 0">
              <el-col :span="9">
                <!--通讯配置-->
                <comm-config :deviceId="selectDeviceId" :deviceCdId="selectDeviceCdId" />
              </el-col>
              <el-col :span="15" style="height: 100%">
                <!--系统配置-->
                <system-config
                  :deviceId="selectDeviceId"
                  :deviceCdId="selectDeviceCdId"
                  style="margin-top: 0; margin-left: 5px"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10" style="padding-left: 0; padding-right: 0">
            <!--指令确认-->
            <el-row>
              <cmd-confirm :id="selectDeviceId" :glideridIrid="selectDeviceCdId" />
            </el-row>
            <el-row style="margin-top: 5px">
              <cmd-record :id="selectDeviceId" :glideridIrid="selectDeviceCdId"  :options="options"/>
            </el-row>
          </el-col>
        </el-row>
        <addcmd
          ref="cmdAddModal"
          :deviceId="selectDeviceId"
          :deviceCdId="selectDeviceCdId"
        ></addcmd>
        <TimingTaskManage
          ref="TimingTaskModal"
          :deviceId="selectDeviceId"
          :deviceOptions="options"
        />
        <globalCmd ref="globalCmd" :deviceId="selectDeviceId" :deviceCdId="selectDeviceCdId" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import sensorConfig from "./modules/sensorConfig";
import cmdConfirm from "./modules/cmdConfirm";
import cmdRecord from "./modules/cmdRecord";
import navigationConfig from "./modules/navigationConfig";
import commConfig from "./modules/commConfig";
import systemConfig from "./modules/systemConfig";
import addcmd from "./modules/add/index";
import globalCmd from "./modules/globalCmd";
import TimingTaskManage from "./modules/TimingTaskManage";
import { Navbar } from "@/layout/components";
import { getDeviceInfo } from "@/api/device/device";
import eventBus from "./modules/EventBus";
import { options } from "runjs";

export default {
  name: "index",
  components: {
    sensorConfig,
    navigationConfig,
    commConfig,
    systemConfig,
    cmdConfirm,
    cmdRecord,
    TimingTaskManage,
    globalCmd,
    Navbar,
    addcmd,
  },
  data() {
    return {
      showNavbar: true,
      // 选中设备主键id
      selectDeviceId: '',
      // 选中设备cdId
      selectDeviceCdId: '',

      options: [],
      item: {},
      //时间
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: [
        this.$t('system.week.Sunday'),
        this.$t('system.week.Monday'),
        this.$t('system.week.Tuesday'),
        this.$t('system.week.Wednesday'),
        this.$t('system.week.Thursday'),
        this.$t('system.week.Friday'),
        this.$t('system.week.Saturday')],
    };
  },
  created() {
    this.getDeviceList();
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    if (this.$route.query.hideNavbar === 'true') {
      this.showNavbar = false;
    }
  },

  mounted() {
    this.timeFn();
  },
  methods: {
    // 获取所有设备列表
    getDeviceList() {
      let queryParam = {
        pageNum: -1,
        pageSize: 10,
        cdId: undefined,
        deviceName: undefined,
        communicateCode: undefined,
        deviceType: undefined,
        deviceModel: undefined,
        startTime: undefined
      };
      getDeviceInfo(queryParam).then((res) => {
        if (res.code !== 200) {
          alert("请重新链接");
        } else {
          this.options = [];
          for (let item of res.rows) {
            const temp = {
              id: item.id,
              cdId: item.cdId,
              deviceName: item.deviceName
            };
            this.options.push(temp);
          }
          // 判断是否从地图页跳转过来
          if (!this.$route.query.deviceId) {
            this.selectDeviceId = this.options[0].id; //id初始值
            this.selectDeviceCdId = this.options[0].cdId;
          } else {
            const targetOption = this.options.find(item => item.id === Number(this.$route.query.deviceId));
            if (targetOption) {
              this.selectDeviceId = targetOption.id;
              this.selectDeviceCdId = targetOption.cdId;
            } else {
              // 不存在则选择第一个选项
              this.selectDeviceId = this.options[0].id;
              this.selectDeviceCdId = this.options[0].cdId;
              this.$message.warning('传入的设备ID无效，已默认选中第一个设备');
            }
          }
          eventBus.$emit("pushGliderMultiCmd", this.options);
        }
      });
    },
    // 选择设备
    idChanged() {
      for (let i in this.options) {
        if (this.selectDeviceId === this.options[i].id) {
          this.selectDeviceCdId = this.options[i].cdId;
          break;
        }
      }
    },

    // 自定义指令
    customCmd() {
      this.$refs.cmdAddModal.open = true;
      this.$refs.cmdAddModal.flag = true;
    },

    // 定时任务
    TimingTask() {
      this.$refs.TimingTaskModal.open = true;
      this.$refs.TimingTaskModal.flag = true;
    },

    // 全局指令
    globalCmd() {
      this.$refs.globalCmd.open = true;
      this.$refs.globalCmd.flag = true;
    },

    //获取时间
    timeFn() {
      setInterval(() => {
        this.dateDay = this.formatTimes(new Date(), "HH: mm: ss");
        this.dateYear = this.formatTimes(new Date(), "yyyy-MM-dd");
        this.dateWeek = this.weekday[new Date().getDay()];
      }, 1000);
    },
    formatTimes(time, fmt) {
      if (!time) return "";
      else {
        const date = new Date(time);
        const o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(),
          "H+": date.getHours(),
          "m+": date.getMinutes(),
          "s+": date.getSeconds(),
          "q+": Math.floor((date.getMonth() + 3) / 3),
          S: date.getMilliseconds(),
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (const k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      }
    },

  },

  watch: {
    selectDeviceId: function (val) {
      // 指令历史，控制总线
      if (this.selectDeviceId !== undefined) {
        eventBus.$emit("getCmdHistoryByID", this.selectDeviceId);
      }
    },
  },
};
</script>

<style scoped>
#main >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0);
  color: #ffffff;
}

/*表单内容颜色*/

#main >>> .el-form-item__label {
  color: #ffffff;
}

/*表单lable颜色*/

#main >>> .hamburger {
  /*左上角按钮颜色*/
  fill: rgb(255, 255, 255);
}

#main >>> .el-card {
  /*卡片样式*/
  border: 0px;
  background-color: rgba(255, 255, 255, 0.12);
}

.navbar {
  position: absolute;
  width: calc(100%);
}

#main >>> .el-breadcrumb {
  /*左上角按钮旁边的面包屑*/
  display: none;
}

.top-back {
  background-color: #1e1f26;
  position: absolute;
  width: 100%;
  height: 83px;
  box-shadow: 0px 3px 5px #000000;
}
</style>

<style scoped lang="scss">
#main {
  position: fixed;
  width: 100%;
  height: 100%;
  // min-width: 1850px;
  // background: url("~@/assets/bg2.jpg") no-repeat;
  background-color: #131417;
  background-size: 100% 100%;
  overflow: hidden;

  .topTitleBox {
    width: 100%;
    height: 80px;
    display: flex;
    position: relative;

    .leftDecorate {
      position: absolute;
      left: 7%;
      top: 32px;
    }

    .dateTimeBox {
      display: inline-block;
      position: absolute;
      right: 3%;
      top: 28px;
      color: #797979;
      font-size: 16px;
      // background-color: rgb(15, 19, 37);
      width: 30%;
      height: 30px;
      text-align: right;
      line-height: 30px;
      cursor: pointer;

      .dateText {
        display: inline-block;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    padding-top: 20px;
  }
}

.page {
  position: absolute;
  left: 30px;
  top: 90px;
  right: 25px;
  bottom: 25px;
  // background-color: #01066A;
}

.list {
  float: left;
  height: 49%;
  width: 32.6%;
  margin: 0.3%;
  position: relative;
  // background-color: #2C303A;
  border: 2px solid #2c303a;
  border-radius: 12px;
  // box-shadow:0px 0px 5px #000000;
}

.list:before {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
}

.list:after {
  content: attr(data-index);
  position: absolute;
  height: 30px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  font: 24px/30px bold "microsoft yahei";
}

.navbar {
  position: absolute;
  width: calc(100%);
}
</style>
