<template>
  <div id="main" >
    <div class="top-back"></div>
    <div class="navbar" v-if="showNavbar">
      <navbar />
    </div>
    <div class="topTitleBox">
      <div class="dateTimeBox">
        <p class="dateText">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</p>
      </div>
      <div style="position: absolute; top: 35px; left: 60px">
        <div style="color: #06f1ef; display: inline">
          <span style="color: #ffffff; display: inline">{{ $t('deviceDetails.top.deviceId') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span :disabled="options.length > 0">
             <el-select
               v-model="selectDeviceId"
               filterable
               :placeholder="selectDeviceId + ''"
               style="width: 125px; margin-right: 10px"
               @change="idChanged()"
               class="idSelect"
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
          </span>

          <span style="color: #ffffff; font-size: 30px">{{ deviceID }}</span>
          <span>
            <el-date-picker
              v-model="startDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('deviceDetails.top.tip1')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('deviceDetails.top.tip2')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
          </span>
          <el-button
            type="text"
            class="query"
            @click="queryData()"
            v-hasPermi="['chart:data:query']"
          >{{ $t('deviceDetails.top.query') }}</el-button>
          <el-button
            type="text"
            class="excel"
            @click="downloadExcel"
            v-hasPermi="['chart:excel:export']"
          >
            <template>
              <i class="el-icon-loading" v-if="downloading"></i>
              {{ $t('deviceDetails.top.export') }}
            </template>
          </el-button>
          <el-button
            type="text"
            class="otherdraw"
            @click="handleOtherDraw()"
            v-hasPermi="['vue:detail:moredraw']"
          >{{ $t('deviceDetails.top.moreDraw') }}</el-button>
          <el-button
            type="text"
            class="otherdraw"
            @click="handleImageReturn()"
            v-hasPermi="['vue:detail:imgback']"
          >{{ $t('deviceDetails.top.imageReturn') }}</el-button>
          <el-button
            type="text"
            class="otherdraw"
            @click="showReport()"
            v-hasPermi="['vue:detail:report']"
          >{{ $t('deviceDetails.top.report') }}</el-button>
            <el-popover placement="right" trigger="click">
              <el-button
                type="text"
                slot="reference"
                class="otherdraw"
                v-has-permi="['vue:chart:bd3']"
              >{{ $t('deviceDetails.top.bd3Image') }}</el-button>
              <div>
                <el-button
                  type="text"
                  @click="handleLofar()"
                  v-has-permi="['chart:lofar:query']"
                  >{{ $t('deviceDetails.top.lofar') }}</el-button>
              </div>
              <div>
                <el-button
                  type="text"
                  @click="handlePowerCheck()"
                  v-has-permi="['chart:power:query']"
                  >{{ $t('deviceDetails.top.powerCheck') }}</el-button>
              </div>
            </el-popover>
          <el-dialog :title="$t('deviceDetails.top.lofar')"
                     :visible.sync="dialogVisibleLofar"
                     :top="'10px'"
                     :left="'10px'"
              :width="'1500px'" :height="'1800px'" :append-to-body="true" center>
              <lofar ref="lofar" :lofarData="lofarData"/>
          </el-dialog>
          <el-dialog :visible.sync="dialogVisiblePowerCheck"
                     :top="'10px'"
                     :left="'10px'"
                     :width="'1500px'"
                     :height="'1800px'"
                     :append-to-body="true"
                     center>
              <powercheck ref="powercheck" :PowerCheckData="PowerCheckData"/>
          </el-dialog>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="list" :key="keyCounter + 1000">
        <navigation />
      </div>
      <div class="list" :key="keyCounter + 2000">
        <power />
      </div>
      <div class="list" :key="keyCounter + 3000">
        <endurance />
      </div>
      <div class="list" :key="keyCounter + 4000">
        <drag />
      </div>
      <div class="list" :key="keyCounter + 5000">
        <floatingship />
      </div>
      <div class="list" :key="keyCounter + 7000">
        <energy />
      </div>
      <div class="list" :key="keyCounter + 8000">
        <propeller />
      </div>
      <div class="list" :key="keyCounter + 9000">
        <humidity />
      </div>
      <div class="list" :key="keyCounter + 10000">
        <twistangle />
      </div>

    </div>
    <div class="note-message" v-show="noteIsShow">请选择信息进行查询</div>
  </div>

</template>

<script>

import energy from "./modules/Energy.vue";
import floatingship from "./modules/FloatingShip.vue";
import power from "./modules/Power.vue";
import navigation from "./modules/Navigation.vue";
import endurance from "./modules/Endurance.vue";
import drag from "./modules/Drag.vue";
import { Navbar } from "@/layout/components";
import { getDeviceInfo } from "@/api/device/device";
import { detailExcel } from "@/api/status/status";
import temperature from "@/views/glider/detail/modules/temperature.vue";
import humidity from "@/views/glider/detail/modules/humidity.vue";
import twistangle from "@/views/glider/detail/modules/Twistangle.vue";
import { getLofar, getPowerCheck }from "@/api/report/report";
import lofar from "@/views/glider/detail/modules/lofar.vue";
import powercheck from "@/views/glider/detail/modules/PowerCheck.vue";
import Propeller from './modules/propeller.vue';
import { downloadFile } from '@/utils/download';

export default {
  name: "home",
  components: {
    drag,
    power,
    navigation,
    endurance,
    energy,
    floatingship,
    Navbar,
    humidity,
    temperature,
    twistangle,
    lofar,
    powercheck,
    Propeller,
  },
  data() {
    return {
      showNavbar: true,
      lofarParams:{
        deviceId: 0,
        endTimeStamp: 0,
        startTimeStamp: 0
      },
      // lofar图的显示与隐藏
      dialogVisibleLofar:false,
      lofarData:[],
      // 能量检测图接口参数
      PowerCheckParams:{
          endTimeStamp: 0,
          gliderId: 0,
          startTimeStamp: 0
      },
      // 能量检测图的显示与隐藏
      dialogVisiblePowerCheck:false,
      PowerCheckData:[],
      //搜索字段
      queryParams: {
        pageNum: -1,
        pageSize: 10,
        deviceId: undefined,
        cdId: undefined,
        deviceName: undefined,
      },
      downloading: false,
      noteIsShow: true,
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
      deviceID: null,
      startDate: null,
      endDate: null,

      keyCounter: 1,

      selectDeviceId: '',
      options: [],
    };
  },
  async created() {

    await this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    if (this.$route.query.hideNavbar === 'true') {
      this.showNavbar = false;
    }
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    this.selectDeviceId = this.$route.query.deviceId;

    if (this.$store.getters.permissions.indexOf("device:page") !== -1 ||
      this.$store.getters.permissions.indexOf("*:*:*") !== -1) {

      await getDeviceInfo(this.queryParams).then((res) => {
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
        }
        // 判断是否从地图页过来的 从这开始
        if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
          const selectedItem = this.options.find(item => item.id === parseInt(this.$route.query.deviceId));
          this.selectDeviceId = selectedItem.id;
          this.noteIsShow = false;
        } else {
          this.selectDeviceId = this.options[0].id;
          this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
          this.endDate = new Date().getTime();
          this.idChanged(null);
          this.noteIsShow = false;
        }
      });
    }
  },
  mounted() {
    this.timeFn();
    this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
  },

  methods: {
    handleLofar(){
    if (this.$store.getters.permissions.indexOf("chart:lofar:query") !== -1 ||
      this.$store.getters.permissions.indexOf("*:*:*") !== -1) {
        this.lofarParams.endTimeStamp=parseInt(this.endDate),
        this.lofarParams.deviceId=parseInt(this.selectDeviceId),
        this.lofarParams.startTimeStamp=parseInt(this.startDate),
        getLofar(this.lofarParams).then(res => {
          if (res.code !== 200) {
              alert("接口错误");
          } else {
            if(res.rows){
              this.lofarData = res.rows.flatMap(row =>
                Object.entries(row.lofarDataMap).map(([key, value]) => [parseInt(key), ...value])
              );
            }
          }
          // 判断子组件是否存在
          if (this.lofarData.length > 0) {
            this.dialogVisibleLofar=true;
            setTimeout(()=>{
              this.$refs.lofar.initLofar();
            },500)
          } else {
            this.$message({ message: '所选时间段无数据', type: 'warning' });
          }
        });
      }

    },
    //能量检测
    handlePowerCheck() {
      if (this.$store.getters.permissions.indexOf("chart:power:query") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1) {
          this.PowerCheckParams.deviceId = parseInt(this.selectDeviceId),
          this.PowerCheckParams.endTimeStamp = parseInt(this.endDate),
          this.PowerCheckParams.startTimeStamp = parseInt(this.startDate),
            getPowerCheck(this.PowerCheckParams).then(res => {
            if (res.code !== 200) {
              alert("接口错误");
            } else {
              let index1 = [];
              let index2 = [];
              this.PowerCheckData = [];
              for (let item of res.rows) {
                let tempDate = new Date(item.timeStamp);
                // 提取日期组件
                let year = tempDate.getFullYear();
                let month = tempDate.getMonth() + 1; // 月份是从0开始的，所以要加1
                let day = tempDate.getDate();
                let hours = tempDate.getHours();
                let minutes = tempDate.getMinutes().toString().padStart(2, '0');//确保整点如4:00而不是4:0
                let seconds = tempDate.getSeconds().toString().padStart(2, '0');
                // 构造表示的日期时间字符串
                let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                let tempPower = item.powerCheck;
                index1.push(tempPower);
                index2.push(formattedDate);
              }
              this.PowerCheckData.push(index1);
              this.PowerCheckData.push(index2);

              // 判断该时间段内是否有数据
              if (res.total > 0) {
                this.dialogVisiblePowerCheck = true;
                setTimeout(() => {
                  this.$refs.powercheck.init();
                }, 500);
              }else {
                this.$message({
                  message: '所选时间段无数据',
                  type: 'warning'
                });
              }

            }
          });
      }
    },
    // 海试报告
    showReport() {
      this.$router.push({
        path: "/gliderreport",
        query: {
          deviceId: this.selectDeviceId,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
    },

    // 更多出图
    handleOtherDraw() {
      this.$router.push({
        path: "/glidermoredraw",
        query: {
          deviceId: this.selectDeviceId,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
    },
    // 图像回传
    handleImageReturn() {
      this.$router.push({
        path: "/imagereturn",
        query: {
          deviceId: this.selectDeviceId,
          startDate: this.startDate,
          endDate: this.endDate,
          msgType: 0,
        },
      });
    },
    downloadExcel() {
      this.$confirm("是否确认导出设备详情数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.downloading = true;
          return detailExcel(this.selectDeviceId, this.startDate, this.endDate);
        }).then((res) => {
          if (res.code === 200) {
            // 下载文件
            // const url = res.data.url
            // const fileName = url.split('?')[0].split('/').pop() || '设备详情.xlsx'
            // this.$message.success('下载中，请稍候...')
            // downloadFile(url, fileName)
            this.download(res.data.url);
            this.downloading = false
          }
        }).catch(() => {
          this.downloading = false;
        });
    },

    idChanged() {
      this.$router.push({
        path: "/gliderdetail",
        query: {
          deviceId: this.selectDeviceId,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      // this.$router.go(0);
      this.keyCounter++;
    },

    queryData() {
      this.$router.push({
        path: "/gliderdetail",
        query: {
          deviceId: this.selectDeviceId,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
      this.keyCounter++;
      //  this.$router.go(0);
    },
    timeFn() {
      //获取时间
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
};
</script>
<style scoped>
.top-back {
  background-color: #1e1f26;
  position: absolute;
  width: 100%;
  height: 83px;
  box-shadow: 0px 3px 5px #000000;
}

#main >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0);
  color: #ffffff;
}

#main >>> .el-breadcrumb {
  display: none;
}

#main >>> .hamburger {
  fill: rgb(255, 255, 255);
}

.topTitleBox >>> .el-button.is-loading:before {
  background-color: rgb(255 255 255);
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0; /*设置不透明度*/
    text-shadow: 0px 0px 4px #ffffff;
  }

  50% {
    opacity: 0.6;
    text-shadow: 0 0 10px #ffffff;
  }

  100% {
    opacity: 0;
    text-shadow: 0 0 4px #ffffff;
  }
}

.note-message {
  font-size: 4.5em;
  color: #06f1ef;
  position: absolute;
  margin: 0px;
  border: 0px;
  padding: 0px;
  letter-spacing: 0.3em;
  left: calc((100% - 11.5em) / 2);
  top: calc((100% - 1.5em) / 2);
  animation: fadeInAnimation 3s infinite ease-in;
  z-index: 1;
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
  // overflow: hidden;

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
  max-height: 4000px; /* 根据需要调整高度 */
  max-weight: 3000px; /* 根据需要调整高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

.list {
  float: left;
  height: 49%;
  width: 32.6%;
  margin: 0.3%;
  position: relative;
  background-color: #1d1e22;
  // border:2px solid #2C303A;
  border-top: 2px solid #2c303a;
  box-shadow: 0px 2px 3px 0px #000000;
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
.query {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 10px;
  // top: 30px;
  // left: 45px;
}
.excel {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 30px;
  // top: 30px;
  // left: 45px;
}
.otherdraw {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 30px;
  // top: 30px;
  // left: 45px;
}
.navbar {
  position: absolute;
  width: calc(100%);
}
</style>
