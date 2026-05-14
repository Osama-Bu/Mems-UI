<template>
<!--  浮船状态  -->
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="floatingship"></div>
  </div>
</template>

<script>
import { FloatingShip } from "@/api/status/status"
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/chart/line");
let charts = {};
export default {
  data() {
    return {
      chartInstance: null,
      refresh: false,
      loading:false,
      chartData: [],
      timeData: [],
      averageVal1:0,
      averageVal2:0,
    };
  },

  mounted() {
    if(this.$store.getters.permissions.some(item => item==='*:*:*') ||
      this.$store.getters.permissions.some(item => item==='chart:status:FC')){
      if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
        this.loading=true;
        FloatingShip(this.$route.query.deviceId, this.$route.query.startDate, this.$route.query.endDate)
          .then(res => {
            let index1 = [];
            let index2 = [];
            for (let item of res.rows) {
              let temp = item.sendDate;
              let temp2 = item.boatPitch;
              let temp3 = item.boatRoll;
              index1.push(temp2);
              index2.push(temp3);
              this.timeData.push(temp);
              this.averageVal1+=temp2;
              this.averageVal2+=temp3;
            }
            this.averageVal1/=index1.length;
            this.averageVal2/=index2.length;
            this.chartData.push(index1);
            this.chartData.push(index2);
            this.loading=false;
            this.refresh = true;
          }).catch(() => {
          this.refresh = true;
          this.loading=false;
        });

      }
    }

  },
  watch: {
    refresh: function(val){
      if(val){
        this.init();
      }
    },
  },
  methods: {
    init() {
      if(this.chartInstance){
        this.chartInstance.dispose();
      }
      this.refresh = false;
      this.chartInstance = echarts.init(document.getElementById("floatingship"));
      this.chartInstance.setOption({
        title: {
          text: this.$t('deviceDetails.chart.ship_status.title'),
          left: "center",
          top: "1%",
          textStyle: {
            color: "#ffffff",
            fontSize: "15px"
          },
        },
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], '10%'];
          },
          formatter(params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4)+'°'
            }
            return relVal;
          },
        },
        legend: {
          data: ["俯仰", "横滚"],
          show: false,
          top: "14%",
          textStyle: {
            color: "#ffffff",
            fontSize: "20px",
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
          // name: "角度(度)",
          min: -45,
          max: 45,
          splitNumber: 8,
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
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            yAxisIndex: 0, // 指定对第一个 Y 轴进行缩放
            start: 0,
            end: 100,
          },
          {
            show: false,
            start: 0,
            end: 20,
            textStyle: {
              color: "#ffffff",
            },
          },
        ],
        series: [{
          name: this.$t('deviceDetails.chart.ship_status.pitch'),
          type: "line",
          symbol: 'none',
          data: this.chartData[0],
          itemStyle: {
            color: "#F5802E",
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
        },
          {
            name: this.$t('deviceDetails.chart.ship_status.roll'),
            type: "line",
            symbol: 'none',
            itemStyle: {
              color: "#5FA2DB",
            },
            lineStyle: {
              width: 1,
            },
            data: this.chartData[1],
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
          },
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 25,
            z: 100,
            style: {
              fill: '#ffffffb6',
              text:
                this.$t('deviceDetails.chart.ship_status.avg_pitch')
                + '：'
                + Number(this.averageVal1).toFixed(2)
                +'°  '
                + this.$t('deviceDetails.chart.ship_status.avg_roll')
                + '：'
                + Number(this.averageVal2).toFixed(2)
                + '°',
              font: '12px sans-serif'
            }
          },
          {
            type: 'text',
            left: 'center',
            bottom: 3,
            z: 100,
            style: {
              fill: '#ffffffb6',
              text: '（'+new Date(Number(this.$route.query.startDate)).toLocaleString('chinese',{hour12:false})+'—'+new Date(Number(this.$route.query.endDate)).toLocaleString('chinese',{hour12:false})+'）',
              font: '9px sans-serif'
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

  #floatingship {
    width: 100%;
    height: 100%;
  }
}
</style>
