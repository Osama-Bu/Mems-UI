<template>
  <div class="app-container">
    <navbar />
    <div>
      <div style="position: absolute; top: 35px; left: 60px">
        <div style="color: #06f1ef; display: inline">

          <el-button type="text" class="back" @click="goBack()">{{ $t('system.back') }}</el-button>

          <span style="color: #000000; display: inline">{{ $t('deviceDetails.report.top.deviceId') }}:</span>
          <el-select
            v-model="selectedID"
            filterable
            :placeholder="selectedID + ''"
            style="width: 95px; margin-right: 10px"
            @change="idChanged(null)"
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
              :placeholder="$t('deviceDetails.report.top.tip1')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              value-format="timestamp"
              :placeholder="$t('deviceDetails.report.top.tip2')"
              style="margin-left: 5px; width: 195px"
            ></el-date-picker>
          </span>

        </div>
      </div>
    </div>
    <div class="report">
      <h1 style="text-align: center">海试报告</h1>
      <h2>一、基本情况</h2>
      <div class="main-text">
        {{ this.reportData.start }}至{{
          this.reportData.end
        }}，波浪滑翔器{{
          this.selectedCdID
        }}号设备开展海上实验，执行（海洋观测、探测）任务，期间成功回传{{
          this.reportData.size
        }}组数据，包括经度、纬度、期望航向等数据。
      </div>
      <h2 style="margin-top: 40px">二、平台状态分析</h2>
      <div class="main-text">
        海试期间的轨迹如图1所示，总航程{{
          this.reportData.voyage
        }}公里，如图2所示。总航时{{ this.reportData.sailing }}天，平均对地速度{{
          this.reportData.grounds
        }}m/s，如图3所示。
      </div>
      <div class="container">
        <div id="trajectory" class="echarts"></div>
        <div class="title" style="margin: 0">图1 轨迹图</div>
      </div>
      <div class="container" style="margin-top: 40px">
        <div id="voyage" class="echarts"></div>
        <div class="title" style="margin: 0">图2 航程图</div>
      </div>
      <div class="container" style="margin-top: 40px">
        <div
          id="speed"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图3 速度图</div>
      </div>
      <div class="main-text">
        <strong class="underline-text"
          >设备船体与牵引机俯仰、横滚姿态比对</strong
        >如图4、图5及表1至表3所示。
      </div>
      <div
        style="
          text-align: center;
          width: 900px;
          margin: 0 auto;
          margin-top: 50px;
        "
      >
        表1俯仰姿态量化统计
        <el-table
          :data="tableData1"
          class="table"
          border
          style="margin-top: 10px"
        >
          <el-table-column
            prop="range"
            label="范围"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="tractor"
            label="牵引机俯仰（%）"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="hull"
            label="船体俯仰（%）"
            style="height: 50px"
          ></el-table-column>
        </el-table>
      </div>
      <div
        style="
          text-align: center;
          width: 900px;
          margin: 0 auto;
          margin-top: 100px;
        "
      >
        表2横滚姿态量化统计
        <el-table
          :data="tableData2"
          class="table"
          border
          style="margin-top: 10px"
        >
          <el-table-column
            prop="range"
            label="范围"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="tractor"
            label="牵引机横滚（%）"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="hull"
            label="船体横滚（%）"
            style="height: 50px"
          ></el-table-column>
        </el-table>
      </div>
      <div
        style="
          text-align: center;
          width: 900px;
          margin: 0 auto;
          margin-top: 100px;
        "
      >
        表3姿态最值统计
        <el-table
          :data="tableData3"
          class="table"
          border
          style="margin-top: 10px"
        >
          <el-table-column
            prop="range"
            label="范围"
            style="height: 40px"
          ></el-table-column>
          <el-table-column
            prop="max"
            label="最大值"
            style="height: 40px"
          ></el-table-column>
          <el-table-column
            prop="min"
            label="最小值"
            style="height: 40px"
          ></el-table-column>
          <el-table-column
            prop="avg"
            label="平均值"
            style="height: 40px"
          ></el-table-column>
        </el-table>
      </div>
      <div class="container" style="margin-top: 90px">
        <div
          id="hullPosture"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图4 船体姿态图</div>
      </div>
      <div class="container" style="margin-top: 90px">
        <div
          id="tractorPosture"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图5 牵引机姿态图</div>
      </div>
      <div class="main-text" style="margin-top: 50px">
        <strong class="underline-text">设备航向控制效果</strong>如图6和表4所示。
      </div>
      <div
        style="
          text-align: center;
          width: 900px;
          margin: 0 auto;
          margin-top: 50px;
        "
      >
        表4航向数据量化统计
        <el-table :data="tableData4" class="table" border>
          <el-table-column
            prop="range"
            label="偏差范围"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="tracking"
            label="航向跟踪控制偏差（%）"
            style="height: 50px"
          ></el-table-column>
          <el-table-column
            prop="different"
            label="（船体——牵引机）航向差（%）"
            style="height: 50px"
          ></el-table-column>
        </el-table>
      </div>
      <div class="container" style="margin-top: 50px">
        <div
          id="headingControl"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图6 航向控制效果图</div>
      </div>
      <div class="main-text">
        <strong class="underline-text">设备电压状态</strong>如图7所示。
      </div>
      <div class="container">
        <div
          id="voltage"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图7 电压图</div>
      </div>
      <div class="main-text">
        <strong class="underline-text">控制舱内环境状态</strong>如图8所示。
      </div>
      <div class="container" style="height: 415px">
        <div
          id="environment"
          class="echarts"
          style="height: 400px; margin-bottom: 20px; margin-top: 50px"
        ></div>
        <div class="title" style="margin: 0">图8 控制舱内环境采集图</div>
      </div>
      <div class="main-text" style="margin-top: 20px">
        <strong class="underline-text">电源管理状态</strong
        >如图9所示，系统剩余电量变化受光照影响明显，在无光照状态下电量下降平稳，说明系统放电稳定；系统总电流均值为{{
          this.reportData.electricity
        }}A，最大值为{{ this.reportData.electricity1 }}A，系统电压采集均值为{{
          this.reportData.voltage
        }}V，最大值为{{ this.reportData.voltage1 }}V。
      </div>
      <div class="container" style="height: 420px">
        <div
          id="powerManagement"
          class="echarts"
          style="height: 400px; margin-bottom: 20px"
        ></div>
        <div class="title" style="margin: 0">图9 电源管理状态</div>
      </div>
      <div class="main-text" style="margin-top: 20px">
        <strong class="underline-text">电池组状态</strong
        >如图10所示，电池组最高温度为{{
          this.reportData.temperature
        }}℃，最大值符合电池组工作要求，电池组剩余电量受光照影响明显，在无光照状态下电量下降平稳，说明系统放电稳定；电池组电流值后段时间出现明显上升是因为电池板开始工作。
      </div>
      <div class="container" style="margin-top: 50px">
        <div id="batteryPack" class="echarts"></div>
      </div>
      <div class="container">
        <div
          id="currentBatteryPack"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图10 电池组状态</div>
      </div>
      <div class="main-text" style="margin-top: 20px">
        <strong class="underline-text">电池板充电状态</strong>如图11所示，{{
          this.reportData.code
        }}号波浪滑翔器装载2块太阳能电池板，电池板1电压平均值为{{
          this.reportData.voltage121
        }}V，电池板1电流平均值为{{
          this.reportData.electricity121
        }}A；电池板2电压平均值为{{
          this.reportData.voltage122
        }}V，电流平均值为{{ this.reportData.electricity122 }}A。
      </div>
      <div class="container" style="margin-top: 30px; height: 355px">
        <div id="batteryPanel" class="echarts" style="height: 320px"></div>
      </div>
      <div class="container" style="height: 355px">
        <div id="batteryPane2" class="echarts" style="height: 320px"></div>
        <div class="title" style="margin: 0">图11 电池板状态</div>
      </div>
      <h2 style="margin-top: 60px">三、载荷数据分析</h2>
      <div class="main-text">
        <strong class="underline-text">风速、风向状态</strong>如图12和图13所示。
      </div>
      <div class="container">
        <div
          id="windSpeedRose"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">图12 风速玫瑰图</div>
      </div>
      <div class="container">
        <div id="windSpeedComparison" class="echarts"></div>
        <div class="title" style="margin: 0">图13 风速比对</div>
      </div>
      <div class="main-text" style="margin-top: 70px">
        <strong class="underline-text">气温、气压、水温状态</strong>如图14所示。
      </div>
      <div class="container" style="margin-top: 20px">
        <div
          id="temperaturePressure"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图14 气温、气压、水温数据比对
        </div>
      </div>
      <div class="main-text">
        <strong class="underline-text">波浪状态</strong>如图15至图20所示。
      </div>
      <div class="container" style="margin-top: 10px">
        <div
          id="wave"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图15 平均波高、平均波周期比对
        </div>
      </div>
      <div class="container" style="margin-top: 20px">
        <div
          id="1/3wave"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图16 1/3波高、平均波周期比对
        </div>
      </div>
      <div class="container" style="margin-top: 20px">
        <div
          id="1/10wave"
          style="
            height: 310px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图17 1/10波高、平均波周期比对
        </div>
      </div>
      <div class="container" style="margin-top: 20px">
        <div
          id="maxWave"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图18 最高波高、平均波周期比对
        </div>
      </div>
      <div class="container" style="margin-top: 30px">
        <div
          id="effectiveWave"
          style="
            height: 320px;
            width: 100%;
            margin: 0 auto;
          "
        ></div>
        <div class="title" style="margin: 0">
          图19 有效波高、平均波周期比对
        </div>
      </div>
      <div class="container" style="margin-top: 20px">
        <div
          id="waveComparison"
          style="
            height: 320px;
            width: 100%;
            margin-bottom: 20px;
          "
        ></div>
        <div class="title" style="margin: 0">图20 波向、波数比对</div>
      </div>
    </div>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getDeviceInfo } from "@/api/device/device";
import { getReport } from "@/api/report/report";
import { Navbar } from "@/layout/components";
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/chart/line");
var charts = {};
export default {
  name: "GliderReport",
  components: { Navbar },
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
      //返回数据
      reportData: {},
      //报告请求参数
      repQueryParams: {
        deviceId: undefined,
        startTimeStamp: undefined,
        endTimeStamp: undefined,
      },
      msgQueryParams: {
        deviceId: undefined,
        msgIdList: undefined,
        pageNum: -1,
        pageSize: 10,
      },
      startDate: null,
      endDate: null,
      //设备选项
      options: [],
      //协议选项
      options2: [],
      selectedID: "",
      selectedCdID: "",
      selectedID2: "",

      //初始化表格
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],

      loading: false,
      // chartData: [],
      // timeData: [],
      cep80: 0,
      //表格数据
      chartData2: [],
      chartData3: [],
      timeData3: [],
      chartData4: [],
      timeData4: [],
      chartData5: [],
      timeData5: [],
      chartData6: [],
      timeData6: [],
      chartData7: [],
      timeData7: [],
      chartData8: [],
      timeData8: [],
      chartData9: [],
      timeData9: [],
      chartData10: [],
      timeData10: [],
      chartData11: [],
      timeData11: [],
      chartData12: [],
      timeData12: [],
      chartData13: [],
      timeData13: [],
      chartData14: [],
      timeData14: [],
      chartData15: [],
      timeData15: [],
      chartData16: [],
      timeData16: [],
      chartData17: [],
      timeData17: [],
      chartData18: [],
      timeData18: [],
      chartData19: [],
      timeData19: [],
      chartData20: [],
      timeData20: [],
      chartData21: [],
      timeData21: [],
      chartData22: [],
      timeData22: [],
      chartData23: [],
      timeData23: [],

      //图2最大最小范围
      minx: 400,
      maxx: 0,
      miny: 400,
      maxy: 0,
    };
  },
  props: {
    str: {
      type: String,
      default: "",
    },
    title: undefined,
    text: undefined,
  },
  created() {
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    this.startDate = this.$route.query.startDate;
    this.endDate = this.$route.query.endDate;
    //获取报告接口的参数
    this.repQueryParams.startTimeStamp = this.startDate;
    this.repQueryParams.endTimeStamp = this.endDate;
    this.repQueryParams.deviceId = this.$route.query.deviceId;
    if (
      this.$store.getters.permissions.indexOf("device:page") !== -1 ||
      this.$store.getters.permissions.indexOf("*:*:*") !== -1
    ) {
      this.selectedID = this.$route.query.deviceId;
      getDeviceInfo(this.queryParams).then((res) => {
        //console.log('res.code: ',res);
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
          this.selectedCdID = selectedItem.cdId;
          this.selectedID = selectedItem.id;
          this.noteIsShow = false;
          this.idChanged(null);
        } else {
          this.selectedID = this.options[0].value;
          this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
          this.endDate = new Date().getTime();
          this.noteIsShow = false;
          this.idChanged(null);
        }
      });
    }
  },
  mounted() {
    this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
    this.$nextTick(() => {
      this.init();
      // this.initializeTableData1();
    });
  },
  watch: {
    chartData2: {
      handler() {
        this.init();
      },
    },
    chartData3: {
      handler() {
        this.init();
      },
    },
    TimeData3: {
      handler() {
        this.init();
      },
    },
    chartData4: {
      handler() {
        this.init();
      },
    },
    TimeData4: {
      handler() {
        this.init();
      },
    },
    chartData5: {
      handler() {
        this.init();
      },
    },
    TimeData5: {
      handler() {
        this.init();
      },
    },
    chartData6: {
      handler() {
        this.init();
      },
    },
    TimeData6: {
      handler() {
        this.init();
      },
    },
    chartData7: {
      handler() {
        this.init();
      },
    },
    TimeData7: {
      handler() {
        this.init();
      },
    },
    chartData8: {
      handler() {
        this.init();
      },
    },
    TimeData8: {
      handler() {
        this.init();
      },
    },
    chartData9: {
      handler() {
        this.init();
      },
    },
    TimeData9: {
      handler() {
        this.init();
      },
    },
    chartData10: {
      handler() {
        this.init();
      },
    },
    TimeData10: {
      handler() {
        this.init();
      },
    },
    chartData11: {
      handler() {
        this.init();
      },
    },
    TimeData11: {
      handler() {
        this.init();
      },
    },
    chartData12: {
      handler() {
        this.init();
      },
    },
    TimeData12: {
      handler() {
        this.init();
      },
    },
    chartData13: {
      handler() {
        this.init();
      },
    },
    TimeData13: {
      handler() {
        this.init();
      },
    },
    chartData14: {
      handler() {
        this.init();
      },
    },
    TimeData14: {
      handler() {
        this.init();
      },
    },
    chartData15: {
      handler() {
        this.init();
      },
    },
    chartData16: {
      handler() {
        this.init();
      },
    },
    TimeData16: {
      handler() {
        this.init();
      },
    },
    chartData17: {
      handler() {
        this.init();
      },
    },
    TimeData17: {
      handler() {
        this.init();
      },
    },
    chartData18: {
      handler() {
        this.init();
      },
    },
    TimeData18: {
      handler() {
        this.init();
      },
    },
    chartData19: {
      handler() {
        this.init();
      },
    },
    TimeData19: {
      handler() {
        this.init();
      },
    },
    chartData20: {
      handler() {
        this.init();
      },
    },
    TimeData20: {
      handler() {
        this.init();
      },
    },
    chartData21: {
      handler() {
        this.init();
      },
    },
    TimeData21: {
      handler() {
        this.init();
      },
    },
    chartData22: {
      handler() {
        this.init();
      },
    },
    TimeData22: {
      handler() {
        this.init();
      },
    },
    chartData23: {
      handler() {
        this.init();
      },
    },
    TimeData23: {
      handler() {
        this.init();
      },
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    idChanged(item) {
      this.repQueryParams.deviceId = this.selectedID;
      this.repQueryParams.startTimeStamp = this.startDate;
      this.repQueryParams.endTimeStamp = this.endDate;
      if (
        this.$store.getters.permissions.indexOf("report:get:report") !== -1 ||
        this.$store.getters.permissions.indexOf("*:*:*") !== -1
      ) {
        getReport(
          this.repQueryParams.deviceId,
          this.repQueryParams.startTimeStamp,
          this.repQueryParams.endTimeStamp
        ).then((res) => {
            console.log(res);
            if (res.code !== 200) {
              alert("请重新链接");
            } else {
              this.reportData = res.data;
              console.log(this.reportData);
              //报告开始时间
              const startdate = new Date(parseInt(this.reportData.start));
              const startyear = startdate.getFullYear();
              const startmonth = String(startdate.getMonth() + 1).padStart(2, "0");
              const startday = String(startdate.getDate()).padStart(2, "0");
              this.reportData.start = `${startyear}年${startmonth}月${startday}日`;
              //报告结束时间
              const enddate = new Date(parseInt(this.reportData.end));
              const endyear = enddate.getFullYear();
              const endmonth = String(enddate.getMonth() + 1).padStart(2, "0");
              const endday = String(enddate.getDate()).padStart(2, "0");
              this.reportData.end = `${endyear}年${endmonth}月${endday}日`;

              this.chartData2 = [];
              this.chartData3 = [];
              this.timeData3 = [];
              this.chartData4 = [[], []];
              this.timeData4 = [[], []];
              this.chartData5 = [[], [], [], []];
              this.timeData5 = [[], [], [], []];
              this.chartData6 = [[], [], []];
              this.timeData6 = [[], [], []];
              this.chartData7 = [[], [], [], []];
              this.timeData7 = [[], [], [], []];
              this.chartData8 = [];
              this.timeData8 = [];
              this.chartData9 = [[], [], []];
              this.timeData9 = [[], [], []];
              this.chartData10 = [[], [], []];
              this.timeData10 = [[], [], []];
              this.chartData11 = [[], []];
              this.timeData11 = [[], []];
              this.chartData12 = [[], []];
              this.timeData12 = [[], []];
              this.chartData13 = [[], []];
              this.timeData13 = [[], []];
              this.chartData14 = [[], []];
              this.timeData14 = [[], []];
              this.chartData15 = [];
              // this.timeData15 = [];
              this.chartData16 = [[], [], []];
              this.timeData16 = [[], [], []];
              this.chartData17 = [[], [], []];
              this.timeData17 = [[], [], []];
              this.chartData18 = [[], []];
              this.timeData18 = [[], []];
              this.chartData19 = [[], []];
              this.timeData19 = [[], []];
              this.chartData20 = [[], []];
              this.timeData20 = [[], []];
              this.chartData21 = [[], []];
              this.timeData21 = [[], []];
              this.chartData22 = [[], []];
              this.timeData22 = [[], []];
              this.chartData23 = [[], []];
              this.timeData23 = [[], []];
              if (this.reportData.data2 != null) {
                this.minx = 400;
                this.maxx = 0;
                this.miny = 400;
                this.maxy = 0;
                for (let item of this.reportData.data2) {
                  let temp = item;
                  let temp2 = item[0];
                  let temp3 = item[1];
                  if (temp2 > this.maxx) this.maxx = temp2;
                  if (temp2 < this.minx) this.minx = temp2;
                  if (temp3 > this.maxy) this.maxy = temp3;
                  if (temp3 < this.miny) this.miny = temp3;
                  this.chartData2.push(temp);
                }
                this.maxx = this.maxx + 0.1;
                this.maxy = this.maxy + 0.1;
                this.minx = this.minx - 0.1;
                this.miny = this.miny - 0.1;
              }
              if (this.reportData.img3 != null) {
                for (let item of this.reportData.img3.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData3.push(temp2);
                  this.timeData3.push(temp);
                }
                // console.log(333);
              }
              if (this.reportData.img4 != null) {
                for (let item of this.reportData.img4.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData4[0].push(temp2);
                  this.timeData4[0].push(temp);
                }
                for (let item of this.reportData.img4.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData4[1].push(temp2);
                  this.timeData4[1].push(temp);
                }
                // console.log(444);
              }
              if (this.reportData.img5 != null) {
                for (let item of this.reportData.img5.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData5[0].push(temp2);
                  this.timeData5[0].push(temp);
                }
                for (let item of this.reportData.img5.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  // console.log("item", item);
                  this.chartData5[1].push(temp2);
                  this.timeData5[1].push(temp);
                }
                for (let item of this.reportData.img5.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData5[2].push(temp2);
                  this.timeData5[2].push(temp);
                }
                for (let item of this.reportData.img5.data4) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData5[3].push(temp2);
                  this.timeData5[3].push(temp);
                }
                // console.log(555);
              }
              if (this.reportData.img6 != null) {
                for (let item of this.reportData.img6.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData6[0].push(temp2);
                  this.timeData6[0].push(temp);
                }
                for (let item of this.reportData.img6.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData6[1].push(temp2);
                  this.timeData6[1].push(temp);
                }
                for (let item of this.reportData.img6.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData6[2].push(temp2);
                  this.timeData6[2].push(temp);
                }
                // console.log(666);
              }
              if (this.reportData.img7 != null) {
                for (let item of this.reportData.img7.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData7[0].push(temp2);
                  this.timeData7[0].push(temp);
                }
                for (let item of this.reportData.img7.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData7[1].push(temp2);
                  this.timeData7[1].push(temp);
                }
                for (let item of this.reportData.img7.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData7[2].push(temp2);
                  this.timeData7[2].push(temp);
                }
                for (let item of this.reportData.img7.data4) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData7[3].push(temp2);
                  this.timeData7[3].push(temp);
                }
                // console.log(777);
                // console.log("this.chartData7:", this.chartData7);
                // console.log("this.timeData7:", this.timeData7);
              }
              if (this.reportData.img8 != null) {
                for (let item of this.reportData.img8.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData8.push(temp2);
                  this.timeData8.push(temp);
                }
                // console.log(888);
              }
              if (this.reportData.img9 != null) {
                for (let item of this.reportData.img9.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData9[0].push(temp2);
                  this.timeData9[0].push(temp);
                }
                for (let item of this.reportData.img9.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData9[1].push(temp2);
                  this.timeData9[1].push(temp);
                }
                for (let item of this.reportData.img9.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData9[2].push(temp2);
                  this.timeData9[2].push(temp);
                }
              }
              if (this.reportData.img10 != null) {
                for (let item of this.reportData.img10.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData10[0].push(temp2);
                  this.timeData10[0].push(temp);
                }
                for (let item of this.reportData.img10.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData10[1].push(temp2);
                  this.timeData10[1].push(temp);
                }
                for (let item of this.reportData.img10.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData10[2].push(temp2);
                  this.timeData10[2].push(temp);
                }
              }
              if (this.reportData.img11 != null) {
                for (let item of this.reportData.img11.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData11[0].push(temp2);
                  this.timeData11[0].push(temp);
                }
                for (let item of this.reportData.img11.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData11[1].push(temp2);
                  this.timeData11[1].push(temp);
                }
              }
              if (this.reportData.img12 != null) {
                for (let item of this.reportData.img12.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData12[0].push(temp2);
                  this.timeData12[0].push(temp);
                }
                for (let item of this.reportData.img12.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData12[1].push(temp2);
                  this.timeData12[1].push(temp);
                }
              }
              if (this.reportData.img13 != null) {
                for (let item of this.reportData.img13.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData13[0].push(temp2);
                  this.timeData13[0].push(temp);
                }
                for (let item of this.reportData.img13.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData13[1].push(temp2);
                  this.timeData13[1].push(temp);
                }
              }
              if (this.reportData.img14 != null) {
                for (let item of this.reportData.img14.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData14[0].push(temp2);
                  this.timeData14[0].push(temp);
                }
                for (let item of this.reportData.img14.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData14[1].push(temp2);
                  this.timeData14[1].push(temp);
                }
              }
              if (this.reportData.data15 != null) {
                for (let item of this.reportData.data15) {
                  let temp = item;
                  this.chartData15.push(temp);
                }
              }
              if (this.reportData.img16 != null) {
                for (let item of this.reportData.img16.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData16[0].push(temp2);
                  this.timeData16[0].push(temp);
                }
                for (let item of this.reportData.img16.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData16[1].push(temp2);
                  this.timeData16[1].push(temp);
                }
                for (let item of this.reportData.img16.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData16[2].push(temp2);
                  this.timeData16[2].push(temp);
                }
              }
              if (this.reportData.img17 != null) {
                for (let item of this.reportData.img17.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData17[0].push(temp2);
                  this.timeData17[0].push(temp);
                }
                for (let item of this.reportData.img17.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData17[1].push(temp2);
                  this.timeData17[1].push(temp);
                }
                for (let item of this.reportData.img17.data3) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData17[2].push(temp2);
                  this.timeData17[2].push(temp);
                }
              }
              if (this.reportData.img18 != null) {
                for (let item of this.reportData.img18.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData18[0].push(temp2);
                  this.timeData18[0].push(temp);
                }
                for (let item of this.reportData.img18.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData18[1].push(temp2);
                  this.timeData18[1].push(temp);
                }
              }
              if (this.reportData.img19 != null) {
                for (let item of this.reportData.img19.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData19[0].push(temp2);
                  this.timeData19[0].push(temp);
                }
                for (let item of this.reportData.img19.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData19[1].push(temp2);
                  this.timeData19[1].push(temp);
                }
              }
              if (this.reportData.img20 != null) {
                for (let item of this.reportData.img20.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData20[0].push(temp2);
                  this.timeData20[0].push(temp);
                }
                for (let item of this.reportData.img20.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData20[1].push(temp2);
                  this.timeData20[1].push(temp);
                }
              }
              if (this.reportData.img21 != null) {
                for (let item of this.reportData.img21.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData21[0].push(temp2);
                  this.timeData21[0].push(temp);
                }
                for (let item of this.reportData.img21.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData21[1].push(temp2);
                  this.timeData21[1].push(temp);
                }
              }
              if (this.reportData.img22 != null) {
                for (let item of this.reportData.img22.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData22[0].push(temp2);
                  this.timeData22[0].push(temp);
                }
                for (let item of this.reportData.img22.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData22[1].push(temp2);
                  this.timeData22[1].push(temp);
                }
              }
              if (this.reportData.img23 != null) {
                for (let item of this.reportData.img23.data1) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData23[0].push(temp2);
                  this.timeData23[0].push(temp);
                }
                for (let item of this.reportData.img23.data2) {
                  let temp = item[0];
                  let temp2 = item[1];
                  this.chartData23[1].push(temp2);
                  this.timeData23[1].push(temp);
                }
              }
            }
          })
          .catch(() => {
            this.init();
            this.loading = false;
          });
      }
    },
    init() {
      const charts1 = echarts.init(document.getElementById("trajectory"));
      const charts2 = echarts.init(document.getElementById("voyage"));
      const charts3 = echarts.init(document.getElementById("speed"));
      const charts4 = echarts.init(document.getElementById("hullPosture"));
      const charts5 = echarts.init(document.getElementById("tractorPosture"));
      const charts6 = echarts.init(document.getElementById("headingControl"));
      const charts7 = echarts.init(document.getElementById("voltage"));
      const charts8 = echarts.init(document.getElementById("environment"));
      const charts9 = echarts.init(document.getElementById("powerManagement"));
      const charts10 = echarts.init(document.getElementById("batteryPack"));
      const charts11 = echarts.init(
        document.getElementById("currentBatteryPack")
      );
      const charts12 = echarts.init(document.getElementById("batteryPanel"));
      const charts13 = echarts.init(document.getElementById("batteryPane2"));
      const charts14 = echarts.init(document.getElementById("windSpeedRose"));
      const charts15 = echarts.init(
        document.getElementById("windSpeedComparison")
      );
      const charts16 = echarts.init(
        document.getElementById("temperaturePressure")
      );
      const charts17 = echarts.init(document.getElementById("wave"));
      const charts18 = echarts.init(document.getElementById("1/3wave"));
      const charts19 = echarts.init(document.getElementById("1/10wave"));
      const charts20 = echarts.init(document.getElementById("maxWave"));
      const charts21 = echarts.init(document.getElementById("effectiveWave"));
      const charts22 = echarts.init(document.getElementById("waveComparison"));

      charts1.setOption({
        //图2
        grid: { x: "10%", y: "15%", width: "80%", height: "70%" },
        title: {
          text: "航行轨迹",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
          top: "9%", // 设置标题距离容器顶部的距离为容器高度的 5%
        },
        xAxis: [
          {
            type: "value",
            // data: [0],
            min: this.minx,
            max: this.maxx,
            axisLine: {
              lineStyle: {
                type: [58, 58],
                color: "#000",
                width: 3,
                cap: "butt",
              },
              onZero: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            // data: [0],
            min: this.minx,
            max: this.maxx,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              // interval: 0,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                type: [58, 58],
                dashOffset: 58,
                color: "#000000",
                width: 3,
                cap: "butt",
              },
              onZero: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: this.miny,
            max: this.maxy,
            // interval: 1,
            axisLine: {
              lineStyle: {
                type: [39, 39],
                color: "#000000",
                width: 3,
                cap: "butt",
              },
              onZero: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            type: "value",
            min: this.miny,
            max: this.maxy,
            // interval: 1,
            axisLine: {
              onZero: false,
              lineStyle: {
                type: [39, 39],
                dashOffset: 33,
                color: "#000000",
                width: 3,
                cap: "butt",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            data: this.chartData2,
            type: "line",
            color: "#0000FF",
            smooth: true,
            showSymbol: false,
          },
        ],
      });
      // 图2
      charts2.setOption({
        grid: {
          left: "10%",
          top: "15%",
          right: "10%",
          bottom: "15%",
        },
        title: {
          text: "航程",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
          top: "20px",
        },
        // 移除冗余的第二个X轴
        xAxis: {
          data: this.timeData3 || [], // 无数据时显示空数组
          type: "category",
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            onZero: false,
            lineStyle: { color: "#112" }, // x轴颜色
          },
        },
        // 移除冗余的第二个Y轴
        yAxis: {
          type: "value",
          name: "航程 (km)",
          // 动态适配Y轴范围
          min: this.chartData3.length > 0 ? Math.floor(Math.min(...this.chartData3)) : 0,
          max: this.chartData3.length > 0 ? Math.ceil(Math.max(...this.chartData3)) : 10,
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: { color: "#112" }, // 补充轴颜色
          },
          axisTick: {
            inside: true,
            show: true,
          },
          axisLabel: {
            showMaxLabel: false,
          },
        },
        // tooltip，提升交互性
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const value = Number(params[0].value);
            const formattedValue = isNaN(value) ? '0.000000' : value.toFixed(6);
            return `${params[0].name}<br/>航程: ${formattedValue} km`;
          },
        },
        series: [
          {
            data: this.chartData3 || [], // 无数据时显示空数组
            type: "line",
            smooth: true,
            color: "#B3804D",
            showSymbol: false,
            // 显式绑定轴
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
        ],
      });

      charts3.setOption({
        //图4
        grid: { x: "10%", y: "15%", width: "80%", height: "70%" },
        title: {
          text: "Velocity",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
          top: "30",
        },
        legend: {
          data: ["effective velocity", "Average velocity"],
          right: "1",
          top: "1",
          orient: "vertical",
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 1,
        },
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData4[0],
          },
          {
            type: "category",
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData4[0],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Velocity/(m/s)",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "effective velocity",
            data: this.chartData4[0],
            type: "line",
            color: "#7AC67A",
            showSymbol: false,
          },
          {
            name: "Average velocity",
            data: this.chartData4[1],
            type: "line",
            showSymbol: false,
            smooth: true,
          },
        ],
      });
      charts4.setOption({
        //图5
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "25%" },
          { x: "6%", y: "35%", width: "80%", height: "25%" },
          { x: "6%", y: "65%", width: "80%", height: "25%" },
        ],
        title: {
          text: "船体姿态",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
        },
        legend: {
          data: ["desired heading", "heading of the Float"],
          right: "1",
          top: "1",
          orient: "vertical",
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 1,
        },
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData5[0],
          },
          {
            type: "category",
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData5[2],
          },
          {
            type: "category",
            data: this.timeData5[3],
            gridIndex: 2,
            name: "Time/Day",
            nameLocation: "center",
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            gridIndex: 0,
            data: this.timeData5[0],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData5[2],
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData5[3],
            gridIndex: 2,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Heading/°",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "Pitch/°",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            name: "Roll/°",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
        ],
        series: [
          {
            name: "desired heading",
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData5[0],
            type: "line",
            color: "#FF4040",
            showSymbol: false,
          },
          {
            name: "heading of the Float",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData5[1],
            type: "line",
            color: "#661A4D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData5[2],
            type: "line",
            color: "#661A4D",
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData5[3],
            type: "line",
            color: "#991ACC",
            showSymbol: false,
          },
        ],
      });
      charts5.setOption({
        //图6
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "25%" },
          { x: "6%", y: "35%", width: "80%", height: "25%" },
          { x: "6%", y: "65%", width: "80%", height: "25%" },
        ],
        title: {
          text: "Attitude",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
        },
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            data: this.timeData6[0],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData6[1],
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData6[2],
            gridIndex: 2,
            name: "Time/Day",
            nameLocation: "center",
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            gridIndex: 0,
            data: this.timeData6[0],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData6[1],
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData6[2],
            gridIndex: 2,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Heading/°",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "Pitch/°",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            name: "Roll/°",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData6[0],
            type: "line",
            color: "#80CC99",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData6[1],
            type: "line",
            color: "#993333",
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData6[2],
            type: "line",
            color: "#4D99FF",
            showSymbol: false,
          },
        ],
      });
      charts6.setOption({
        //图7
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "25%" },
          { x: "6%", y: "35%", width: "80%", height: "25%" },
          { x: "6%", y: "65%", width: "80%", height: "25%" },
        ],
        title: {
          text: "Black Pearl Wave Glider Heading Control",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
            color: "black",
          },
          left: "center",
        },
        legend: {
          data: ["desired heading", "current heading"],
          right: "1",
          top: "1",
          orient: "vertical",
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 1,
        },
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            data: this.timeData7[0],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData7[2],
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData7[3],
            gridIndex: 2,
            name: "Time/Day",
            nameLocation: "center",
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            gridIndex: 0,
            data: this.timeData7[0],
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData7[2],
            gridIndex: 1,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            type: "category",
            data: this.timeData7[3],
            gridIndex: 2,
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "heading/°",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 0,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "rudder/°",
            nameLocation: "center",
            nameGap: 25,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            name: "heading error/°",
            nameLocation: "center",
            nameGap: 25,
            // interval: 20,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            // interval: 20,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
        ],
        series: [
          {
            name: "desired heading",
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData7[0],
            type: "line",
            color: "#FF4040",
            showSymbol: false,
          },
          {
            name: "current heading",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData7[1],
            type: "line",
            color: "#4040FF",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData7[2],
            type: "line",
            color: "#99664D",
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData7[3],
            type: "line",
            color: "#334D66",
            showSymbol: false,
          },
        ],
      });
      charts7.setOption({
        //图8
        grid: { x: "10%", y: "15%", width: "80%", height: "70%" },
        title: {
          text: "电压",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
          top: "30",
        },
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
              alignWithLabel: true,
            },
            splitLine: {
              show: true,
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData8,
          },
          {
            type: "category",
            axisTick: {
              inside: true,
              alignWithLabel: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            // data: [0],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Voltage/V",
            scale: true,
            // min: Math.min(this.chartData8)-5,
            // max: Math.max(this.chartData8)+5,
            // interval: 1,
            // min: 14,  // 计算最小值并减去5
            // max: 20,  // 计算最大值并加上5
            nameLocation: "center",
            nameGap: 25,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
          },
          {
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            data: this.chartData8,
            type: "line",
            color: "#33CC80",
            showSymbol: false,
          },
        ],
      });
      charts8.setOption({
        //图9
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "20%" },
          { x: "6%", y: "36%", width: "80%", height: "20%" },
          { x: "6%", y: "68%", width: "80%", height: "20%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData9[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData9[1],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 2,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData9[2],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "上位机温度",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            // data: [0],
          },
          {
            type: "category",
            name: "上位机湿度",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            // data: [0],
          },
          {
            type: "category",
            gridIndex: 2,
            name: "上位机压力",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            // data: [0],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "/℃",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "/°",
            nameLocation: "center",
            nameGap: 25,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            name: "压力",
            nameLocation: "center",
            nameGap: 30,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData9[0],
            type: "line",
            color: "#696969",
            smooth: true,
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData9[1],
            type: "line",
            color: "#334D4D",
            smooth: true,
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData9[2],
            type: "line",
            color: "#1A4D4D",
            smooth: true,
            showSymbol: false,
          },
        ],
      });
      charts9.setOption({
        //10
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "20%" },
          { x: "6%", y: "36%", width: "80%", height: "20%" },
          { x: "6%", y: "68%", width: "80%", height: "20%" },
        ],
        graphic: [
          {
            type: "text",
            left: "6%",
            top: "1%",
            style: {
              fill: "#999",
              text: "×10⁵",
            },
          },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[1],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 2,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[2],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "系统剩余电量",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[0],
          },
          {
            type: "category",
            name: "系统总电流",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[1],
          },
          {
            type: "category",
            gridIndex: 2,
            name: "系统电压",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData10[2],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "剩余电量",
            nameGap: 35,
            nameLocation: "center",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "ampere",
            nameLocation: "center",
            nameGap: 35,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            name: "volt",
            nameLocation: "center",
            nameGap: 35,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData10[0],
            type: "line",
            color: "#4D004D",
            smooth: true,
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData10[1],
            type: "line",
            color: "#33B34D",
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData10[2],
            type: "line",
            color: "#1A994D",
            showSymbol: false,
          },
        ],
      });
      charts10.setOption({
        //图11%20电池组状态(电量、温度)
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "35%" },
          { x: "6%", y: "55%", width: "80%", height: "35%" },
        ],
        graphic: {
          type: "text",
          left: "6%",
          top: "52%",
          style: {
            text: "×10⁵",
            fill: "#6F717A",
          },
        },
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData11[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData11[1],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "电池组1温度",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData11[0],
          },
          {
            type: "category",
            name: "电池组1剩余电量",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData11[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "℃",
            nameGap: 35,
            nameLocation: "center",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "剩余电量",
            nameLocation: "center",
            nameGap: 35,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData11[0],
            type: "line",
            color: "#336699",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData11[1],
            type: "line",
            color: "#1A4D80",
            showSymbol: false,
          },
        ],
      });
      charts11.setOption({
        //图11 电池组状态(当前电流、电压)
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "35%" },
          { x: "6%", y: "55%", width: "80%", height: "35%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData12[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData12[1],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "电池组1当前电流",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData12[0],
          },
          {
            type: "category",
            name: "电池组1当前电压",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData12[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "ampere",
            nameGap: 35,
            nameLocation: "center",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMinLabel: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "volt",
            nameLocation: "center",
            nameGap: 35,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData12[0],
            type: "line",
            color: "#331A99",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData12[1],
            type: "line",
            color: "#1A8080",
            showSymbol: false,
          },
        ],
      });
      charts12.setOption({
        //12电池板1
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "35%" },
          { x: "6%", y: "55%", width: "80%", height: "35%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData13[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData13[1],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "电池板1电压",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData13[0],
          },
          {
            type: "category",
            name: "电池板1电流",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData13[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "volt",
            nameGap: 25,
            nameLocation: "center",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "ampere",
            nameLocation: "center",
            nameGap: 30,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData13[0],
            type: "line",
            color: "#801A4D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData13[1],
            type: "line",
            color: "#00994D",
            showSymbol: false,
          },
        ],
      });
      charts13.setOption({
        //12电池板2
        //设置柱状图位置，x：与左侧边界距离；y：与上侧边界距离；width：图宽；height：图高
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "35%" },
          { x: "6%", y: "55%", width: "80%", height: "35%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData14[0],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData14[1],
          },
          {
            type: "category",
            gridIndex: 0,
            name: "电池板2电压",
            nameLocation: "center",
            nameGap: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData14[0],
          },
          {
            type: "category",
            name: "电池板2电流",
            nameLocation: "center",
            nameGap: 0,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData14[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "volt",
            nameGap: 25,
            nameLocation: "center",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            name: "ampere",
            nameLocation: "center",
            nameGap: 30,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 10,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0, // 关联到第一个坐标轴
            data: this.chartData14[0],
            type: "line",
            color: "#801A4D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData14[1],
            type: "line",
            color: "#00994D",
            showSymbol: false,
          },
        ],
      });
      charts14.setOption({
        grid: { x: "10%", y: "15%", width: "80%", height: "70%" },
        title: {
          //图13
          text: "风速玫瑰图",
          textStyle: {
            fontWeight: "normal",
            fontSize: 14,
          },
          left: "center",
          top: "15",
        },
        angleAxis: {
          type: "value",
          data: ["E", "S", "W", "N"],
          startAngle: 30,
          min: 0,
          max: 360,
          interval: 30,
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: function (value) {
              if (value === 30) {
                return "E";
              } else if (value === 120) {
                return "S";
              } else if (value === 210) {
                return "W";
              } else if (value === 300) {
                return "N";
              }
              // 其他数值保持默认格式
            },
            color: "#000",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#AFAFAF",
            },
          },
        },
        radiusAxis: {
          min: 0,
          max: 39,
          interval: 7.8,
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: function (value) {
              // 其他数值保持默认格式
              return value + "%";
            },
            color: "#000",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#AFAFAF",
            },
          },
          axisTick: {
            show: false,
          },
        },
        polar: {
          radius: ["6%", "80%"],
        },
        series: [
          {
            type: "bar",
            colorBy: "data",
            itemStyle: {
              borderColor: "#1C724F",
              borderWidth: 1,
              borderType: "solid",
            },
            data: this.chartData15,
            coordinateSystem: "polar",
            emphasis: {
              focus: "series",
            },
          },
        ],
        visualMap: {
          min: 0,
          max: 14,
          itemWidth: 20,
          itemHeight: 360,
          text: [14, 0],
          textGap: 2,
          inRange: {
            color: ["#018066", "#FEFF66"],
          },
          orient: "vertical",
          right: "40",
          top: "center",
        },
      });
      charts15.setOption({
        //14
        grid: [
          { x: "6%", y: "6%", width: "80%", height: "35%" },
          { x: "6%", y: "56%", width: "80%", height: "35%" },
        ],
        legend: {
          data: ["max", "2-min mean"],
          right: "6%",
          top: "7%",
          orient: "vertical",
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 1,
        },
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData16[0],
          },
          {
            type: "category",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData16[2],
          },
          {
            type: "category",
            name: "风速对比",
            nameLocation: "center",
            nameGap: "0",
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData16[0],
          },
          {
            type: "category",
            name: "最大风速对应风向",
            nameLocation: "center",
            nameGap: "0",
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData16[2],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "wind speed/(m/s)",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
          },
          {
            type: "value",
            name: "°",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              inside: true,
              show: true,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "max",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData16[0],
            type: "line",
            color: "#333333",
            showSymbol: false,
          },
          {
            name: "2-min mean",
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData16[1],
            type: "line",
            color: "#4D99E6",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData16[2],
            type: "line",
            color: "#1A4DE6",
            showSymbol: false,
          },
        ],
      });
      charts16.setOption({
        //15
        grid: [
          { x: "6%", y: "2%", width: "80%", height: "20%" },
          { x: "6%", y: "34%", width: "80%", height: "20%" },
          { x: "6%", y: "67%", width: "80%", height: "20%" },
        ],
        xAxis: [
          {
            type: "category",
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[0],
          },
          {
            type: "category",
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[1],
          },
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 2,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[2],
          },
          {
            type: "category",
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[0],
          },
          {
            type: "category",
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[1],
          },
          {
            type: "category",
            gridIndex: 2,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            data: this.timeData17[2],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Airtemperature/°",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            name: "Airpressure/(*10KPa)",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.02,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            type: "value",
            name: "SST/°",
            nameLocation: "center",
            nameGap: 20,
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 0.02,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 2,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData17[0],
            type: "line",
            color: "#FF00FF",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData17[1],
            type: "line",
            color: "#00FF00",
            showSymbol: false,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: this.chartData17[2],
            type: "line",
            color: "#00FFFF",
            showSymbol: false,
          },
        ],
      });
      charts17.setOption({
        //16
        grid: [
          { x: "6%", y: "4%", width: "80%", height: "30%" },
          { x: "6%", y: "55%", width: "80%", height: "30%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData18[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData18[1],
          },
          {
            type: "category",
            name: "平均波高",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData18[0],
          },
          {
            type: "category",
            name: "平均波周期",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData18[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "H/m",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "T/s",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 0.5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData18[0],
            type: "line",
            color: "#99334D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData18[1],
            type: "line",
            color: "#99334D",
            showSymbol: false,
          },
        ],
      });
      charts18.setOption({
        //17
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "30%" },
          { x: "6%", y: "55%", width: "80%", height: "30%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData19[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData19[1],
          },
          {
            type: "category",
            name: "三分之一波高",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData19[0],
          },
          {
            type: "category",
            name: "三分之一波周期",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData19[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "H/m",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "T/s",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData19[0],
            type: "line",
            color: "#4D1A4D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData19[1],
            type: "line",
            color: "#661A4D",
            showSymbol: false,
          },
        ],
      });
      charts19.setOption({
        //18
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "29%" },
          { x: "6%", y: "60%", width: "80%", height: "28%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData20[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData20[1],
          },
          {
            type: "category",
            name: "十分之一波高",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData20[0],
          },
          {
            type: "category",
            name: "十分之一波周期",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData20[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "H/m",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "T/s",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData20[0],
            type: "line",
            color: "#803333",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData20[1],
            type: "line",
            color: "#803380",
            showSymbol: false,
          },
        ],
      });
      charts20.setOption({
        //19
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "30%" },
          { x: "6%", y: "55%", width: "80%", height: "30%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData21[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData21[1],
          },
          {
            type: "category",
            name: "最大波高",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData21[0],
          },
          {
            type: "category",
            name: "最大波周期",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData21[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "H/m",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "T/s",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 5,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData21[0],
            type: "line",
            color: "#99994D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData21[1],
            type: "line",
            color: "#334D4D",
            showSymbol: false,
          },
        ],
      });
      charts21.setOption({
        //20
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "30%" },
          { x: "6%", y: "55%", width: "80%", height: "30%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData22[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData22[1],
          },
          {
            type: "category",
            name: "谱有效波高",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData22[0],
          },
          {
            type: "category",
            name: "谱平均波周期",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData22[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "H/m",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
              showMinLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "T/s",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 1,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 2,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData22[0],
            type: "line",
            color: "#99994D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData22[1],
            type: "line",
            color: "#334D4D",
            showSymbol: false,
          },
        ],
      });
      charts22.setOption({
        //21
        grid: [
          { x: "6%", y: "5%", width: "80%", height: "29%" },
          { x: "6%", y: "55%", width: "80%", height: "30%" },
        ],
        xAxis: [
          {
            type: "category",
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData23[0],
          },
          {
            type: "category",
            gridIndex: 1,
            name: "Time/Day",
            nameLocation: "center",
            nameGap: 25,
            axisTick: {
              inside: true,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData23[1],
          },
          {
            type: "category",
            name: "波向",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 0,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData23[0],
          },
          {
            type: "category",
            name: "波数",
            nameLocation: "center",
            nameGap: 3,
            gridIndex: 1,
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: false,
            },
            data: this.timeData23[1],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "direction/°",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "N/°",
            nameLocation: "center",
            nameGap: 30,
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              showMaxLabel: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 0,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            // min: 0,
            // max: 1,
            // interval: 100,
            axisLine: {
              onZero: false,
              show: true,
            },
            axisTick: {
              inside: true,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: this.chartData23[0],
            type: "line",
            color: "#99994D",
            showSymbol: false,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.chartData23[1],
            type: "line",
            color: "#1A664D",
            showSymbol: false,
          },
        ],
      });
      /* window.addEventListener("resize", () => {
        charts.resize();
      }); */

      this.tableData1 = [
        {
          range: "-20°————-10°",
          tractor: this.reportData.pitch1,
          hull: this.reportData.pitch6,
        },
        {
          range: "-10°————0°",
          tractor: this.reportData.pitch2,
          hull: this.reportData.pitch7,
        },
        {
          range: "0°————10°",
          tractor: this.reportData.pitch3,
          hull: this.reportData.pitch8,
        },
        {
          range: "10°————20°",
          tractor: this.reportData.pitch4,
          hull: this.reportData.pitch9,
        },
        {
          range: "≥20°  或≤-20°",
          tractor: this.reportData.pitch5,
          hull: this.reportData.pitch10,
        },
      ];
      this.tableData2 = [
        {
          range: "-10°————-5°",
          tractor: this.reportData.roll1,
          hull: this.reportData.roll6,
        },
        {
          range: "-5°————0°",
          tractor: this.reportData.roll2,
          hull: this.reportData.roll7,
        },
        {
          range: "0°————5°",
          tractor: this.reportData.roll3,
          hull: this.reportData.roll8,
        },
        {
          range: "5°————10°",
          tractor: this.reportData.roll4,
          hull: this.reportData.roll9,
        },
        {
          range: "≥10°  或≤-10°",
          tractor: this.reportData.roll5,
          hull: this.reportData.roll10,
        },
      ];
      this.tableData3 = [
        {
          range: "牵引机俯仰",
          max: this.reportData.maxpq,
          min: this.reportData.minpq,
          avg: this.reportData.averagepq,
        },
        {
          range: "船体俯仰",
          max: this.reportData.maxpq,
          min: this.reportData.minpq,
          avg: this.reportData.averagepq,
        },
        {
          range: "牵引机横滚",
          max: this.reportData.maxpq,
          min: this.reportData.minpq,
          avg: this.reportData.averagepq,
        },
        {
          range: "船体横滚",
          max: this.reportData.maxpq,
          min: this.reportData.minpq,
          avg: this.reportData.averagepq,
        },
      ];
      this.tableData4 = [
        {
          range: "-20°————-10°",
          tracking: this.reportData.tracking1,
          different: this.reportData.different1,
        },
        {
          range: "-10°————10°",
          tracking: this.reportData.tracking2,
          different: this.reportData.different2,
        },
        {
          range: "10°————20°",
          tracking: this.reportData.tracking3,
          different: this.reportData.different3,
        },
        {
          range: "≥20°  或≤-20°",
          tracking: this.reportData.tracking4,
          different: this.reportData.different4,
        },
      ];
    },
  },
};
</script>

<style scoped>
.app-container {
  padding-top: 0%;
}
.report {
  margin: 0 10%;
}
/* 正文首行缩进 */
.main-text {
  text-indent: 2em;
}
/* 图片 */
.img-container {
  max-width: 800px;
  height: auto;
  margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
}

.img-container el-img {
  width: 100%;
  height: auto;
  margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
}

.container {
  position: relative;
  width: 800px;
  height: 370px;
  margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
}

.echarts {
  height: 350px;
  width: 100%;
  margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
  /* height: 100%; */
  /* text-align: center; */
  /* height: auto; */
  /* overflow: visible !important; 确保内容不被裁剪 */
}

.title {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
/* 下划线 */
.underline-text {
  text-decoration: underline;
}

.table {
  width: 80%;
  margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
  border-collapse: collapse; /* 合并边框 */
}

@media print {
  .img-container {
    max-width: 80%;
    height: auto;
    margin: 0 auto; /* 使用 margin 属性将图片水平居中 */
  }
  .echarts {
    text-align: center;
    width: 781px;
    height: 373px;
    overflow: visible !important; /* 确保内容不被裁剪 */
  }
  .table {
    text-align: center;
    width: 781px;
    /* height: 373px; */
    overflow: visible !important; /* 确保内容不被裁剪 */
  }
  .report {
    margin: 0;
  }
}
</style>
