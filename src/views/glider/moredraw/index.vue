<template>
  <div id="main">
    <div class="top-back">
    </div>
    <div class="navbar">
      <navbar />
    </div>
    <div class="topTitleBox">

      <div class="dateTimeBox">
        <p class="dateText">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</p>
      </div>

      <div style="position:absolute;top: 35px;left:60px;">
        <div style="color: #06f1ef;display: inline;">
          <el-button type="text" class="back" @click="goBack()">{{ $t('system.back') }}</el-button>
          <span>
						<el-date-picker
              v-model="startDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('deviceDetails.moreDraw.top.tip1')"
              style="margin-left:5px;width:195px;"
            ></el-date-picker>
						<el-date-picker
              v-model="endDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('deviceDetails.moreDraw.top.tip2')"
              style="margin-left:5px;width:195px;"
            ></el-date-picker>
					</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span style="color: #ffffff;display: inline;">{{ $t('deviceDetails.moreDraw.top.deviceId') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
            <el-select
              v-model="selectedID"
              filterable
              :placeholder="selectedID+''"
              style="width:95px; margin-right:10px;"
              @change="idChanged(null)"
              class="idSelect"
            >
              <el-option v-for="item in options"
                         :key="item.id"
                         :label="item.cdId"
                         :value="item.id">
                <span style="float: left">{{ item.cdId }}</span>
                <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
                <span style=" color: #8492a6; font-size: 13px">{{ item.deviceName }}</span>
              </el-option>
            </el-select>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span style="color: #ffffff;display: inline;">{{ $t('deviceDetails.moreDraw.top.msg') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <el-select
            v-model="selectedID2"
            filterable
            style="width:165px;margin-right:10px;"
            @change="msgChanged(null)"
            class="idSelect"
          >
            <el-option v-for="item2 in options2" :key="item2.value" :label="item2.name" :value="item2.value">
              <span style="float: left">{{ }}</span>
              <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
              <span style=" color: #8492a6; font-size: 13px">{{ item2.name }}</span>
            </el-option>
          </el-select>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span style="color: #ffffff;display: inline;">{{ $t('deviceDetails.moreDraw.top.msgItem') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <el-select
            v-model="selectedID3"
            multiple
            collapse-tags
            filterable
            style="width:210px;margin-right:10px;"
            @change="filedChanged(null)"
            class="idSelect"
            v-hasPermi="['moredraw:data:query']"
          >
            <el-option v-for="item3 in options3" :key="item3.value" :label="item3.name" :value="item3.value">
              <span style="float: left">{{ item3.name }}</span>
              <span style=" color: rgba(0, 3, 48, 0.0); font-size: 13px">__</span>
              <span style=" color: #8492a6; font-size: 13px">{{ item3.content }}</span>
            </el-option>
          </el-select>
          <span style="color: #ffffff;font-size: 30px;">{{ deviceID }}</span>
        </div>
      </div>
    </div>
    <div class="page" v-if="downloading1">
      <div class="note-message" v-show="noteIsShow">{{ $t('deviceDetails.top.tip3') }}</div>
      <!-- 将v-for应用到包装的div -->
      <div class="list" v-for="(chartData, index) in chartDataArray" :key="keyCounter + index * 1000">
        <protocol
          :msgId="chartData.msgId"
          :fieldLimit_name="chartData.fieldLimit_name"
          :chartIndex="index"
          :deviceId = "selectedID"
        ></protocol>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'
import { getDeviceInfo, getDeviceInfoWithMessage } from "@/api/device/device"
import { getMsgItemsByMsgId } from "@/api/message/message"
import { detailExcel } from "@/api/status/status"
import protocol from "@/views/glider/moredraw/module/protocol.vue";

export default {
  name: "Glidermoredraw",
  components: {
    protocol,
    Navbar,
  },
  data() {
    return {
      //搜索字段
      queryParams: {
        pageNum: -1,
        pageSize: 10
      },
      msgQueryParams:{
        deviceId: undefined,
        msgIdList: undefined,
        pageNum: -1,
        pageSize: 10,
      },
      fieldQueryParams:{
        pageNum: -1,
        pageSize: 10,
        id:undefined,
      },
      downloading:false,
      downloading1:false,
      noteIsShow: true,
      dateDay: null, //时间
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

      selectedID: "",
      selectedID2: "",
      selectedID3: [],
      selectedID3_name:[],
      chartDataArray: [
        // 添加更多图表数据对象
      ],
      options: [],
      options2: [],
      options3: [],
    };
  },
  watch: {
    selectedID3(newValues) {
      // 清空原有的selectedID3_name数组
      this.selectedID3_name = [];

      // 遍历新的selectedID3数组，将对应的name存入selectedID3_name数组
      newValues.forEach((selectedValue) => {
        const selectedItem = this.options3.find(item => item.value === selectedValue);
        if (selectedItem) {
          this.selectedID3_name.push(selectedItem.name);
        }
      });
    },
  },
  created() {
    this.$store.dispatch('app/closeSideBar',{ withoutAnimation: false });
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    if(this.$store.getters.permissions.indexOf("device:page")!==-1 ||
      this.$store.getters.permissions.indexOf("*:*:*")!==-1 ){

      getDeviceInfo(this.queryParams).then(res => {
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

          if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
            const selectedItem = this.options.find(item => item.id === parseInt(this.$route.query.deviceId));
            this.selectedID = selectedItem.id;
            this.noteIsShow = false;
            this.idChanged(null);
          }else{
            this.selectedID = this.options[0].value;
            this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
            this.endDate = new Date().getTime();
            this.noteIsShow = false;
            this.idChanged(null);
          }
        }
      });
    }

  },
  mounted() {
    this.timeFn();
    this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
  },

  methods: {
    downloadExcel() {
      this.$confirm('是否确认导出设备详情数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloading=true;
        return detailExcel(this.selectedID,this.startDate,this.endDate)
      }).then(res => {
        this.download(res.data.url);
        this.downloading=false;
      }).catch(()=>{
        this.downloading=false;
      });
    },
    filedChanged(item){
      this.downloading1 = true;
      this.queryData();
      this.chartDataArray = []
      for (let item of this.selectedID3){
        const selectedOption = this.options3.find(option => option.value === item);
        this.chartDataArray.push({
          msgId: this.selectedID2,
          fieldLimit_name: selectedOption.name,
        });
      }
    },
    msgChanged(item) {
      if(this.$store.getters.permissions.indexOf("msg-device:page")!==-1 ||
        this.$store.getters.permissions.indexOf("*:*:*")!==-1 ){
        this.fieldQueryParams.id=this.selectedID2;
        // 协议项查询
        getMsgItemsByMsgId(this.selectedID2).then(res => {
          if (res.code !== 200) {
            alert("请重新链接");
          } else {
            this.options3 = [];
            for (let item of res.data) {
              const temp = {
                value: item.id,
                content: item.content,
                name: item.name,
              };
              this.options3.push(temp);
            }
            if(this.options3){
              this.selectedID3=[];
              this.selectedID3_name=[];
            }
          }
        });
      }

    },
    idChanged(item) {
      if(this.$store.getters.permissions.indexOf("msg:page")!==-1 ||
        this.$store.getters.permissions.indexOf("*:*:*")!==-1 ){
        this.msgQueryParams.deviceId = this.selectedID;
        getDeviceInfoWithMessage(this.msgQueryParams).then(res => {
          if (res.code !== 200) {
            alert("请重新链接");
          } else {
            this.options2 = [];
            if(res.rows){
              for (let item of res.rows) {
                const temp = {
                  value: item.id,
                  name: item.name,
                };
                this.options2.push(temp);
              }
              if(this.options2){
                this.selectedID2 = this.options2[0].value;
                this.msgChanged(this.selectedID2);
              }
            }
          }
        });
        this.$router.push({
          path: '/glidermoredraw',
          query: {
            deviceId: this.selectedID,
            startDate: this.startDate,
            endDate: this.endDate
          }
        });
        this.keyCounter++;
      }

    },
    queryData() {
      this.$router.push({
        path: '/glidermoredraw',
        query: {
          deviceId: this.selectedID,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
      this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
      this.keyCounter++;
      //  this.$router.go(0);
    },
    timeFn() {
      //获取时间
      setInterval(() => {
        this.dateDay = this.formatTimes(new Date(), "HH:mm:ss");
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
              RegExp.$1.length === 1 ?
                o[k] :
                ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      }
    },
    goBack() {
      this.$router.go(-1)
      // this.$router.push({
      //   path: '/gliderdetail',
      //   query: {
      //     deviceId: this.selectedID,
      //     startDate: this.startDate,
      //     endDate: this.endDate
      //   }
      // });
    },
  },
};
</script>
<style scoped>
.top-back{
  background-color: #1E1F26;
  position: absolute;
  width: 100%;
  height: 83px;
  box-shadow:0 3px 5px #000000;
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
  z-index:1;
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
  background-color: #1D1E22;
  // border:2px solid #2C303A;
  border-top: 2px solid #2C303A;
  box-shadow:0px 2px 3px 0px #000000;
  border-radius: 12px;
  display: flex;
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
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* 根据需要调整项目之间的间距 */
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
