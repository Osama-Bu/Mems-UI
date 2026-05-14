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
      <div style="position: absolute; top: 35px; left: 60px">
        <div style="color: #06f1ef; display: inline">
          <span style="color: #ffffff; display: inline">{{ $t('faultDetect.top.deviceId') }}:</span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <el-select
            v-model="selectedID"
            filterable
            :placeholder="selectedID + ''"
            style="width: 95px; margin-right: 10px"
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
          <span>
            <el-date-picker
              v-model="startDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('faultDetect.top.tip1')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('faultDetect.top.tip2')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
          </span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <span
            style="color: #ffffff; display: inline; margin-left: 10px"
            v-hasPermi="['fault-detect:interval']"
          >{{ $t('faultDetect.top.returnInterval') }}:
          </span>
          <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
          <el-input
            v-model="txTimeInput"
            placeholder="10-10-60-60"
            style="width: 120px"
            v-hasPermi="['fault-detect:interval']"
          ></el-input>
          <span
            style="color: #ffffff; display: inline"
            v-hasPermi="['fault-detect:interval']"
          >{{ $t('system.time.minute') }}</span>
          <el-button
            type="text"
            class="excel"
            :loading="downloading"
            @click="indexChange()"
          >{{ $t('faultDetect.top.faultDetect') }}</el-button>
        </div>
      </div>
    </div>
    <div class="page-title">{{ $t('faultDetect.chart.title') }}<br /></div>
    <div
      class = "page"
      v-loading = "loading"
      element-loading-background = "rgba(19, 20, 23, 0.8)"
      :element-loading-text = "$t('faultDetect.chart.tip2')"
    >
      <div v-if="this.show" class="pro_info">
        <div class="top">
          <div class="left">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.pose_detection.label') }}</div>
              <div class="index">
                <span class="name"
                >{{ $t('faultDetect.pose_detection.tractor_pitch') }}：{{ this.Real_Pitch.data }}°</span>
                <span class="time">{{ this.Real_Pitch.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Real_Pitch.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name"
                >{{ $t('faultDetect.pose_detection.tractor_roll') }}：{{ this.Real_Roll.data }}°</span>
                <span class="time">{{ this.Real_Roll.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Real_Roll.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.pose_detection.ship_pitch') }}：{{ this.pitch.data }}°</span>
                <span class="time">{{ this.pitch.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.pitch.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.pose_detection.ship_roll') }}：{{ this.roll.data }}°</span>
                <span class="time">{{ this.roll.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.roll.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
            </div>
          </div>
          <div class="mid">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.armored_cable.label') }}</div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.armored_cable.twist_number') }}：{{ this.twist_angle.data }}</span>
                <span class="time">{{ this.twist_angle.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.twist_angle.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name" v-if="this.Real_Heading.tag">
                  {{ $t('faultDetect.armored_cable.communication') }}：{{ this.Real_Heading.data }}</span
                >
                <span class="name" v-else> {{ $t('faultDetect.armored_cable.communication') }}</span>
                <span class="time">{{ this.Real_Heading.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Real_Heading.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.navi_system.label') }}</div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.navi_system.speed') }}：{{ this.Speed_ave.data }}m/s</span>
                <span class="time">{{ this.Speed_ave.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Speed_ave.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.navi_system.position') }}：{{ this.GPSX0.data }}°,{{ this.GPSY0.data }}°</span
                >
                <span class="time">{{ this.GPSxy.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.GPSxy.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.navi_system.heading_deviation') }}：{{ this.hxpc.data }}°</span>
                <span class="time">{{ this.hxpc.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.hxpc.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name"> {{ $t('faultDetect.navi_system.rudder_deviation') }}：{{ this.wdpc.data }}°</span>
                <span class="time">{{ this.wdpc.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.wdpc.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.navi_system.expect_steer') }}：{{ this.Rudder_Angle.data }}°</span
                >
                <span class="time">{{ this.Rudder_Angle.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Rudder_Angle.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.control_system.label') }}</div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.control_system.voltage') }}：{{ this.Battery_volt.data }}V</span>
                <span class="time">{{ this.Battery_volt.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.Battery_volt.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.control_system.data_callback') }}</span>
                <span class="time">{{ this.imel.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.imel.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name"
                >{{ $t('faultDetect.control_system.cabin_humidity') }}：{{ this.M_Humility.data }}%</span>
                <span class="time">{{ this.M_Humility.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.M_Humility.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name"
                >{{ $t('faultDetect.control_system.charge_voltage_diff') }}：{{ this.dyc.data }}</span>
                <span class="time">{{ this.dyc.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.dyc.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
            </div>
          </div>
          <div class="mid">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.comm_system.label') }}</div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.comm_system.iridium_comm') }}：{{ this.yxRate.data < 0 ? 0 : (this.yxRate.data > 100 ? 100 : this.yxRate.data) }}%</span
                >
                <span class="time">{{ this.yxRate.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.yxRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button
                  class="butt"
                  type="success"
                  v-else-if="!this.yxRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.normal') }}</el-button>
                <el-button class="butt" type="info" v-else>{{ $t('faultDetect.status.invalid') }}</el-button>
              </div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.comm_system.beacon_comm') }}：{{ this.BEACON.data < 0 ? 0 : (this.BEACON.data > 100 ? 100 : this.BEACON.data) }}%</span
                >
                <span class="time">{{ this.BEACON.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.BEACON.tag && this.BEACON.data"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button
                  class="butt"
                  type="success"
                  v-else-if="!this.BEACON.tag && this.BEACON.data"
                >{{ $t('faultDetect.status.normal') }}</el-button>
                <el-button class="butt" type="info" v-else>{{ $t('faultDetect.status.invalid') }}</el-button>
              </div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.comm_system.bd3_comm') }}：{{ this.bdRate.data < 0 ? 0 : (this.bdRate.data > 100 ? 100 : this.bdRate.data) }}%</span
                >
                <span class="time">{{ this.bdRate.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.bdRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button
                  class="butt"
                  type="success"
                  v-else-if="!this.bdRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.normal') }}</el-button>
                <el-button class="butt" type="info" v-else>{{ $t('faultDetect.status.invalid') }}</el-button>
              </div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.comm_system.tt_comm') }}：{{ this.ttRate.data < 0 ? 0 : (this.ttRate.data > 100 ? 100 : this.ttRate.data) }}%</span
                >
                <span class="time">{{ this.ttRate.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.ttRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button
                  type="success"
                  class="butt"
                  v-else-if="!this.ttRate.tag && !this.BEACON.data"
                >{{ $t('faultDetect.status.normal') }}</el-button>
                <el-button class="butt" type="info" v-else>{{ $t('faultDetect.status.invalid') }}</el-button>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="kuang">
              <div class="title">{{ $t('faultDetect.load_system.label') }}</div>
              <div class="index">
                <span class="name">
                  {{ $t('faultDetect.load_system.weather_station_wind_speed') }}：{{ this.windspeed_38.data }}m/s</span>
                <span class="time">{{ this.windspeed_38.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.windspeed_38.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.load_system.effective_wave_height') }}：{{ this.H1_3.data }}m</span>
                <span class="time">{{ this.H1_3.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.H1_3.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name"
                >{{ $t('faultDetect.load_system.water_temperature') }}：{{ this.CT_temperature_38.data }}℃</span>
                <span class="time">{{ this.CT_temperature_38.sendDate }}</span>
                <el-button
                  class="butt"
                  type="danger"
                  v-if="this.CT_temperature_38.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.load_system.drag_pitch') }}：{{ this.F.data }}°</span>
                <span class="time">{{ this.F.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.F.tag"
                >{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
              <div class="index">
                <span class="name">{{ $t('faultDetect.load_system.drag_roll') }}：{{ this.HOLL.data }}°</span>
                <span class="time">{{ this.HOLL.sendDate }}</span>
                <el-button class="butt" type="danger" v-if="this.HOLL.tag">{{ $t('faultDetect.status.abnormal') }}</el-button>
                <el-button class="butt" type="success" v-else>{{ $t('faultDetect.status.normal') }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="note-message" v-if="!this.show">{{ $t('faultDetect.chart.tip1') }}</div>
    </div>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'
import { getDeviceInfo } from '@/api/device/device'
import { getFault } from '@/api/alarm/faultdiagnosis'

export default {
  name: "home",
  components: {
    Navbar,
  },
  data() {
    return {
      //搜索字段
      queryParams: {
        pageNum: -1,
        pageSize: 10
      },
      queryFault: {
        deviceId: undefined,
        alarmTimeStart: undefined,
        alarmTimeEnd: undefined,
        txTime: [],
      },

      //牵引机俯仰
      Real_Pitch: {},
      //牵引机横滚
      Real_Roll: {},
      //母船俯仰
      pitch: {},
      //母船横滚
      roll: {},

      //扭转圈数
      twist_angle: {},
      //上下位机通讯
      Real_Heading: {},

      //速度
      Speed_ave: {},
      //定位经度
      GPSX0: {},
      //定位纬度
      GPSY0: {},
      //定位
      GPSxy: {},
      //航向偏差
      hxpc: {},
      //尾舵跟踪偏差
      wdpc: {},
      //期望打舵
      Rudder_Angle: {},

      //电压
      Battery_volt: {},
      //数据回传
      imel: {},
      //舱内湿度
      M_Humility: {},
      //充电电压差
      dyc: {},

      //铱星通信成功率
      yxRate: {},
      //信标通信成功率
      BEACON: {},
      //北三通信成功率
      bdRate: {},
      //天通通信成功率
      ttRate: {},

      //气象站风速
      windspeed_38: {},
      //有效波高
      H1_3: {},
      //水温
      CT_temperature_38: {},
      //拖体俯仰
      F: {},
      //拖体横滚
      HOLL: {},

      loading: false,
      downloading: false,
      //页面展示
      show: false,
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
      // 回传间隔
      txTimeInput: "10-10-60-60",
      keyCounter: 1,
      selectedID: null,
      options: [],
      props: { multiple: true },
    };
  },

  created() {
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    this.selectedID = this.$route.query.deviceId;
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    getDeviceInfo(this.queryParams).then((res) => {
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
      } else {
        this.selectedID = this.options[0].id;
        this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
        this.endDate = new Date().getTime();
        this.idChanged(null);
        this.noteIsShow = false;
      }
    });

  },
  mounted() {
    this.indexSelectionValue = null;
    this.timeFn();
    this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
  },
  watch: {
    indexType(newIndexType, oldIndexType) {
      // 监听 indexType 变化
      if (newIndexType !== oldIndexType) {
        // 当 indexType 发生变化时，清空 indexSelectionValue 数组
        this.chartArray = [];
      }
    },
  },
  methods: {
    idChanged() {
      // 显示
      this.show = false;
      // 设备
      this.chartArray = [];
      // this.graghType = "";
      this.indexSelectionValue = null;
      this.$router.push({
        path: "/faultdiagnosis",
        query: {
          deviceId: this.selectedID,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      // this.$router.go(0);
      this.keyCounter++;
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
    indexChange() {
      this.queryFault.deviceId = this.selectedID;
      this.queryFault.alarmTimeStart = this.timeChange(this.startDate);
      this.queryFault.alarmTimeEnd = this.timeChange(this.endDate);
      this.queryFault.txTime = this.txTimeInput.split("-").map(Number);
      //牵引机俯仰
      this.Real_Pitch = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //牵引机横滚
      this.Real_Roll = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //母船俯仰
      this.pitch = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //母船横滚
      this.roll = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //扭转圈数
      this.twist_angle = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //上下位机通讯
      this.Real_Heading = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //速度
      this.Speed_ave = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //定位经度
      this.GPSX0 = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //定位纬度
      this.GPSY0 = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //定位
      this.GPSxy = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //航向偏差
      this.hxpc = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //尾舵跟踪偏差
      this.wdpc = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //期望打舵
      this.Rudder_Angle = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //电压
      this.Battery_volt = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //数据回传
      this.imel = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //舱内湿度
      this.M_Humility = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //充电电压差
      this.dyc = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //铱星通信成功率
      this.yxRate = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //信标通信成功率
      this.BEACON = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //北三通信成功率
      this.bdRate = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //天通通信成功率
      this.ttRate = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //气象站风速
      this.windspeed_38 = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //有效波高
      this.H1_3 = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //水温
      this.CT_temperature_38 = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //拖体俯仰
      this.F = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      //拖体横滚
      this.HOLL = {
        data: 0,
        sendDate: "0000-00-00 00:00:00",
        tag: true,
      };
      // 调用查询接口
      this.loading = true;
      getFault(this.queryFault).then((res) => {
        this.loading = false;
        let temp = {
          sendDate: "0000-00-00 00:00:00",
          tag: true
        };
        for (let item of res) {
          // console.log("item:", item);
          if (item.msgItem === "Real_Pitch" && item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Real_Pitch = temp;
            // console.log("Real_Pitch:", this.Real_Pitch);
          }
          if (item.msgItem === "Real_Roll" && item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Real_Roll = temp;
            // console.log("Real_Roll:", this.Real_Roll);
          }
          if (item.msgItem === "pitch" && item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.pitch = temp;
            // console.log("pitch:", this.pitch);
          }
          if (item.msgItem === "roll" && item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.roll = temp;
            // console.log("roll:", this.roll);
          }
          if (item.msgItem === "Twist_angle"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.twist_angle = temp;
            // console.log("twist_angle:", this.twist_angle);
          }
          if (item.msgItem === "Real_Heading"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Real_Heading = temp;
            // console.log("Real_Heading:", this.Real_Heading);
          }
          if (item.msgItem === "Speed_ave"&& item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Speed_ave = temp;
            // console.log("Speed_ave:", this.Speed_ave);
          }
          if (item.msgItem === "GPSX0"&& item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.GPSX0 = temp;
          }
          if (item.msgItem === "GPSY0"&& item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.GPSY0 = temp;
          }
          if (!this.GPSX0.tag && !this.GPSY0.tag) {
            this.GPSxy.tag = false;
            this.GPSxy.sendDate = this.GPSX0.sendDate;
          } else if (this.GPSX0.tag && this.GPSY0.tag) {
            this.GPSxy.tag = true;
            // 将日期时间字符串转换为时间戳
            const timestampx = Date.parse(this.GPSX0.sendDate);
            const timestampy = Date.parse(this.GPSY0.sendDate);
            if (timestampx < timestampy) {
              this.GPSxy.sendDate = this.GPSX0.sendDate;
            } else {
              this.GPSxy.sendDate = this.GPSY0.sendDate;
            }
          } else {
            this.GPSxy.tag = true;
            if (this.GPSX0.tag) {
              this.GPSxy.sendDate = this.GPSX0.sendDate;
            } else {
              this.GPSxy.sendDate = this.GPSY0.sendDate;
            }
          }
          // console.log("GPSxy:", this.GPSxy);
          if (item.msgItem === "hxpc"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.hxpc = temp;
          }
          if (item.msgItem === "wdpc"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.wdpc = temp;
            // console.log("wdpc:", this.wdpc);
          }
          if (item.msgItem === "Rudder_Angle"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Rudder_Angle = temp;
            // console.log("Rudder_Angle:", this.Rudder_Angle);
          }
          if (item.msgItem === "Battery_volt"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.Battery_volt = temp;
            // console.log("Battery_volt:", this.Battery_volt);
          }
          if (item.msgItem === "imel"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.imel = temp;
            // console.log("imel:", this.imel);
          }
          if (item.msgItem === "M_Humility"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.M_Humility = temp;
            // console.log("M_Humility:", this.M_Humility);
          }
          if (item.msgItem === "dyc"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.dyc = temp;
            // console.log("dyc:", this.dyc);
          }
          if (item.msgItem === "yxRate"&&item.data != null) {
            temp = {
              data: Math.round(item.data * 100),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.yxRate = temp;
            // console.log("yxRate:", this.yxRate);
          }
          if (item.msgItem === "BEACON"&&item.data != null) {
            temp = {
              data: Math.round(item.data * 100),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.BEACON = temp;
            // console.log("BEACON:", this.BEACON);
          }
          if (item.msgItem === "bdRate"&&item.data != null) {
            temp = {
              data: Math.round(item.data * 100),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.bdRate = temp;
            // console.log("bdRate:", this.bdRate);
          }
          if (item.msgItem === "ttRate"&&item.data != null) {
            temp = {
              data: Math.round(item.data * 100),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.ttRate = temp;
            // console.log("ttRate:", this.ttRate);
          }
          if (item.msgItem === "windspeed_38"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.windspeed_38 = temp;
            // console.log("windspeed_38:", this.windspeed_38);
          }
          if (item.msgItem === "H1_3"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.H1_3 = temp;
            // console.log("H1_3:", this.H1_3);
          }
          if (item.msgItem === "CT_temperature_38"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.CT_temperature_38 = temp;
            // console.log("CT_temperature_38:", this.CT_temperature_38);
          }
          if (item.msgItem === "F"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.F = temp;
            // console.log("F:", this.F);
          }
          if (item.msgItem === "HOLL"&&item.data != null) {
            temp = {
              data: item.data.toFixed(2),
              sendDate: item.sendDate,
              tag: item.tag,
            };
            this.HOLL = temp;
            // console.log("HOLL:", this.HOLL);
          }
        }
      }).catch(() => {
        this.loading = false;
      });
      this.show = true;
    },
    timeChange(timestamp) {
      // 创建一个 Date 对象，传入时间戳（毫秒为单位）
      const date = new Date(parseInt(timestamp));
      // 使用 Date 对象的方法获取年、月、日、时、分、秒
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，因此要加 1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // 构建日期时间字符串，以 xxxx-xx-xx xx:xx:xx 格式显示
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    opacity: 0;
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
  font-size: 3em;
  color: #06f1ef;
  position: absolute;
  margin: 0;
  border: 0;
  padding: 0;
  letter-spacing: 0.3em;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: fadeInAnimation 3s infinite ease-in;
  z-index: 1;
  text-align: center;
  white-space: nowrap;
}

.page-title {
  color: rgb(46, 117, 182);
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
  text-shadow: 0 0 3px rgb(15, 47, 106), 0 0 5px rgb(15, 47, 106),
  0 0 10px rgb(15, 47, 106), 0 0 15px rgb(15, 47, 106);
}
.page-title .en {
  font-size: 16px;
}

#main {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #131417;
  background-size: 100% 100%;
}

.topTitleBox {
  width: 100%;
  height: 80px;
  display: flex;
  position: relative;
}
.topTitleBox .dateTimeBox {
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
}
.topTitleBox .dateTimeBox .dateText {
  display: inline-block;
}

.navbar {
  position: absolute;
  width: calc(100%);
}

.page {
  position: absolute;
  left: 30px;
  top: 150px;
  right: 25px;
  bottom: 25px;
  overflow-y: auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.pro_info {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.pro_info .top,
.pro_info .bottom {
  flex: 1;
  display: flex;
  min-height: 0;
  margin-bottom: 10px;
}
.pro_info .bottom {
  margin-bottom: 0;
  margin-top: 10px;
}

.pro_info .left,
.pro_info .mid,
.pro_info .right {
  flex: 1;
  display: flex;
  margin: 0 8px;
  min-width: 0;
}

.pro_info .top .left,
.pro_info .bottom .left {
  margin-left: 0;
}
.pro_info .top .right,
.pro_info .bottom .right {
  margin-right: 0;
}

.kuang {
  background-color: #262626;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.kuang .title {
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
  margin: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.kuang .index {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 4px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  flex-shrink: 0;
}

.kuang .index .name {
  font-size: 18px;
  color: #e0e0e0;
  width: auto;
  min-width: 160px;
  margin-left: 0;
  flex: 1;
}

.kuang .index .time {
  font-size: 14px;
  color: #aaa;
  text-align: center;
  margin: 0 8px;
  white-space: nowrap;
}

.kuang .index .butt {
  height: 32px;
  padding: 0 12px;
  margin-left: 8px;
  font-size: 14px;
  flex-shrink: 0;
  width: 80px;
}

@media screen and (max-width: 1600px) {
  .kuang .index .name {
    font-size: 16px;
    min-width: 130px;
  }
  .kuang .index .time {
    font-size: 12px;
  }
  .kuang .title {
    font-size: 20px;
  }
  .kuang .index .butt {
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
  }
}

@media screen and (max-width: 1400px) {
  .kuang .index .name {
    font-size: 14px;
    min-width: 110px;
  }
  .kuang .index .time {
    font-size: 11px;
  }
  .kuang .title {
    font-size: 18px;
  }
}

.kuang::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.kuang::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}
.kuang::-webkit-scrollbar-thumb {
  background: #3a6ea5;
  border-radius: 3px;
}
.kuang::-webkit-scrollbar-thumb:hover {
  background: #2c5a8c;
}
.excel {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 30px;
}
</style>
