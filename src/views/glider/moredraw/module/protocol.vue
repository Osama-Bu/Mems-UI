
<template>
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div :class="'chart-container-' + chartIndex"></div>
  </div>
</template>

<script>

import { msgParseFind } from "@/api/device/device";

const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/chart/line");
var charts = {};
export default {
  data() {
    return {
      colorPalette: [
        '#F5802E', '#5FA2DB', '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A',
        '#AED6F1', '#D7BDE2', '#F9E79F', '#ABEBC6', '#F5B7B1'
      ],
      loading:false,
      chartData: [],
      timeData: [],
      averageVal: 0 ,
      abnormalProbability:0,
      form: {
        ascFieldList: [],
        descFieldList: [],
        endTimeStamp: 0,
        fieldLimitList: [],
        deviceId: 0,
        msgId: undefined,
        startTimeStamp: 0
      }
    };

  },
  props: {
    chartIndex: Number,
    msgId: undefined,
    ascFieldList: [],
    descFieldList: [],
    fieldLimit_name: undefined,
    deviceId: undefined
  },
  mounted() {
    if(this.$store.getters.permissions.some(item => item==='*:*:*')
      ||this.$store.getters.permissions.some(item => item==='vue:detail:moredraw')){
      if(this.$route.query.deviceId&&this.$route.query.startDate&&this.$route.query.endDate)
      {
        this.loading=true;
        this.form.deviceId = this.$route.query.deviceId
        this.form.startTimeStamp = this.$route.query.startDate
        this.form.endTimeStamp = this.$route.query.endDate
        this.form.msgId = this.msgId
        this.form.fieldLimitList.push(this.fieldLimit_name)
        msgParseFind(this.form)
          .then(res => {
            let index3 = [];
            this.averageVal = 0;
            this.timeData = [];
            this.chartData = [];

            if (res.data.length !== 0) {
              // 先对数据按照时间进行排序
              res.data.sort((a, b) => new Date(a.send_date) - new Date(b.send_date));

              for (let item of res.data) {
                // 解析 ISO 格式的时间字符串
                let tempDate = new Date(item.send_date);

                // 提取日期组件（包含秒）
                let year = tempDate.getFullYear();
                let month = tempDate.getMonth() + 1; // 月份是从0开始的，所以要加1
                let day = tempDate.getDate();
                let hours = tempDate.getHours();
                let minutes = tempDate.getMinutes().toString().padStart(2, '0');

                // 构造表示的日期时间字符串（包含秒）
                let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                let temp4 = item[this.fieldLimit_name];
                this.averageVal += Number(temp4);
                index3.push(temp4);
                this.timeData.push(formattedDate);
              }

              this.chartData.push(index3);
            }

            this.averageVal/=res.data.length

            this.loading=false;
          }).catch(() => {
          this.init();
          this.loading=false;
        });
      }
    }

  },
  watch: {
    chartData: {
      handler() {
        this.init();
      },
    }
  },
  methods: {
    init() {
      charts = echarts.init(document.querySelector(`.chart-container-${this.chartIndex}`));
      charts.setOption({
        title: {
          text: this.fieldLimit_name,
          left: "center",
          top: "1%",
          textStyle: {
            color: "#ffffff",
            fontSize: "15px",
          },
        },
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter(params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>'
                + params[i].marker + params[i].seriesName
                + ' : ' + Number(params[i].value).toFixed(4);
            }
            return relVal;
          },
        },
        grid: {
          left: "7%",
          right: "3%",
          bottom: "12%",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
          iconStyle:{
            borderColor: "#ffffff",
          },
        },
        xAxis: {
          type: "category",
          data: this.timeData,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: {
              color: "#BFBFBF",
            },
          },
          axisLabel:{
            formatter: function (value, index) {
              return value.substring(5,16);
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#BFBFBF",
            },
          },
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: false,
            start: 0,
            end: 20,
            textStyle: {
              color: "#ffffff",
            },
          }
        ],
        series: [
          {
            name: this.fieldLimit_name + ' ' + this.$t('deviceDetails.moreDraw.value'),
            type: "line",
            symbol: 'none',
            data: this.chartData[0],
            itemStyle: {
              color: this.colorPalette[this.chartIndex % this.colorPalette.length],
            },
            lineStyle: {
              width: 1,
            },
            label: {
              show: false,
              position: "inside",
              formatter: "{c}",
              color: "#ffffff",
              textStyle: {
                fontSize: 16,
                fontWeight: "normal",
              },
            },
          }
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 25,
            z: 100,
            style: {
              fill: '#ffffffb6',
              text: 'Average_'+this.fieldLimit_name+': '+Number(this.averageVal).toFixed(2),
              font: '13px sans-serif'
            }
          }

        ],
      });
    },
  },
};
</script>


<style scoped lang="scss">
#mains {
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
}

.chart-container-0,
.chart-container-1,
.chart-container-2,
.chart-container-3,
.chart-container-4,
.chart-container-5,
.chart-container-6,
.chart-container-7,
.chart-container-8,
.chart-container-9,
.chart-container-10,
.chart-container-11,
.chart-container-12{
  width: 100%; /* 控制宽度，以便每行显示两个 */
  height: 100%; /* 控制高度 */
  margin: 0.1%; /* 控制间距 */
}
</style>

