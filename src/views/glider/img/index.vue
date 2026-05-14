<template>
  <div id="main">
    <div class="top-back"></div>
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
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span style="color: #ffffff;display: inline;">{{ $t('deviceDetails.imageReturn.top.deviceId') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <el-select v-model="selectedID"
                     filterable
                     :placeholder="selectedID+''"
                     style="width:95px;margin-right:10px;"
                     @change="idChanged()"
                     class="idSelect">
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
          <span style="color: #ffffff;font-size: 30px;">{{ deviceID }}</span>
          <span>
            <el-date-picker v-model="startDate" type="datetime" value-format="timestamp" :placeholder="$t('deviceDetails.imageReturn.top.tip1')"
              style="margin-left:5px;width:195px;"></el-date-picker>
            <el-date-picker v-model="endDate" type="datetime" value-format="timestamp" :placeholder="$t('deviceDetails.imageReturn.top.tip2')"
              style="margin-left:5px;width:195px;"></el-date-picker>
          </span>
          <el-button type="text" class="query" @click="queryData()" v-hasPermi="['chart:data:query']">{{ $t('deviceDetails.imageReturn.top.query') }}</el-button>
        </div>
      </div>
    </div>
    <div class="image-container">
      <div class="list" v-for="(link, index) in imageLinks" :key="index" :data-index="index">
        <img :src="link" alt="Image" class="fill-container" />
        <p class="upload-time">{{ timeLinks[index] }}</p>
      </div>
    </div>
    <div class="note-message" v-show="noteIsShow">{{ $t('deviceDetails.top.tip3') }}</div>
  </div>
</template>

<script>

import ttimg from './modules/Img.vue'
import { Navbar } from '@/layout/components'
import { getDeviceInfo } from "@/api/device/device"
import { detailExcel } from "@/api/status/status"
import {download} from "@/utils/ruoyi";
import { getTTImg }from "@/api/message/message"

export default {
  name: "home",
  components: {
    ttimg,
    Navbar,
  },
  data() {
    return {
      //搜索字段
      queryParams: {
        pageNum: -1,
        pageSize: 10,
        code: undefined,
        name: undefined,
        imel: undefined,
      },
      //天通请求字段
      queryPara:{
        deviceId: 100,
        endTime: "",
        msgType: 0,
        startTime: ""
      },
      downloading:false,
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
      imageLinks: [],
      timeLinks:[],
      keyCounter: 1,

      selectedID: null,
      options: [{
        value: '1',
      }, {
        value: '2',
      }],
    };
  },
  created() {
    this.$store.dispatch('app/closeSideBar',{ withoutAnimation: false });
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    this.selectedID = this.$route.query.deviceId;
    console.log(this.selectedID)
    if(this.$store.getters.permissions.indexOf("device:page")!==-1 ||
      this.$store.getters.permissions.indexOf("*:*:*")!==-1 ){
      this.selectedID = this.$route.query.deviceId;
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
        }
        if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
          const selectedItem = this.options.find(item => item.id === parseInt(this.$route.query.deviceId));
          this.selectedID = selectedItem.id;
          this.noteIsShow = false;
        }else{
          this.selectedID = this.options[0].value;
          this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
          this.endDate = new Date().getTime();
          this.idChanged(null);
          this.noteIsShow=false;
        }
      });
    }
    this.queryPara.deviceId=this.selectedID;
    const sstartDate = new Date(parseInt(this.startDate));
    const eendDate = new Date(parseInt(this.endDate));
    const formattedStartDate = sstartDate.toISOString().split('T')[0];
    const formattedEndDate = eendDate.toISOString().split('T')[0];
    this.queryPara.startTime = formattedStartDate;
    this.queryPara.endTime = formattedEndDate;
    getTTImg(this.queryPara).then(res => {
      this.imageLinks = res.images.map(image => image.address);
      this.timeLinks = res.images.map(image => image.upload_time);
    })

  },
  mounted() {
    this.timeFn();
    this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
  },
  // beforeRouteUpdate (to, from, next) {
  //   console("luyou  yaobianla")
  //   this.created();
  //   next();
  // },

  methods: {
    handleOtherDraw(){
      this.$router.push({
        path:"/glidermoredraw",
        query: {
          deviceId: this.selectedID,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },
    goBack() {
      this.$router.go(-1)
      // this.$router.push({
      //   path: '/gliderdetail',
      //   query: {
      //     gliderId: this.selectedID,
      //     startDate: this.startDate,
      //     endDate: this.endDate
      //   }
      // });
    },
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

    idChanged() {
      this.$router.push({
        path: '/imagereturn',
        query: {
          deviceId: this.selectedID,
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
      // this.$router.go(0);
      this.keyCounter++;
    },
    queryData() {
      this.queryPara.deviceId = this.selectedID;
      this.queryPara.msgType=0;
      const sstartDate = new Date(parseInt(this.startDate));
      const eendDate = new Date(parseInt(this.endDate));
      const formattedStartDate = sstartDate.toISOString().split('T')[0];
      const formattedEndDate = eendDate.toISOString().split('T')[0];
      this.queryPara.startTime = formattedStartDate;
      this.queryPara.endTime = formattedEndDate;
      // 执行数据查询操作
      getTTImg(this.queryPara).then(res => {
        this.imageLinks = res.images.map(image => image.address);
        this.timeLinks = res.images.map(image => image.upload_time);
        //this.imageLinks = res.images[0].address;
      });

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
              RegExp.$1.length === 1 ?
                o[k] :
                ("00" + o[k]).substr(("" + o[k]).length)
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
.top-back{
  background-color: #1E1F26;
  position: absolute;
  width: 100%;
  height: 83px;
  box-shadow:0px 3px 5px #000000;
}
.image-container {
  position: absolute;
  left: 30px;
  right: 25px;
  top: 90px;
  bottom: 25px;
  overflow-y: auto;
  /* 启用垂直滚动条 */
  overflow-x: hidden;
  /* 隐藏水平滚动条 */
}

.list {
  float: left;
  height: 49%;
  width: 32.6%;
  margin: 0.3%;
  position: relative;
  background-color: #1D1E22;
  border-top: 2px solid #2C303A;
  box-shadow: 0px 2px 3px 0px #000000;
  border-radius: 12px;
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
  position: absolute;
  height: 30px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  font: 24px/30px bold;
}


.fill-container {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    text-shadow: 0 0 4px #ffffff;
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
  margin: 0;
  border: 0;
  padding: 0;
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
  background-color: #131417;
  background-size: 100% 100%;

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
}

.list {
  float: left;
  height: 49%;
  width: 32.6%;
  margin: 0.3%;
  position: relative;
  background-color: #1D1E22;
  border-top: 2px solid #2C303A;
  box-shadow:0 2px 3px 0 #000000;
  border-radius: 12px;
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
.upload-time {
  position: absolute;
  /* 添加此行 */
  bottom: 10px;
  /* 调整位置 */
  left: 30%;
  /* 调整位置 */
  color: #fff;
  /* 调整颜色 */
  font-size: 14px;
  /* 调整字体大小 */
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
