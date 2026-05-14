<template>
<!--  动力状态  -->
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="power"></div>
  </div>
</template>

<script>
import { Power } from "@/api/status/status"
const echarts = require("echarts/lib/echarts");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/chart/line");

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
      averageVal3:0,
    };
  },

  mounted() {
    if(this.$store.getters.permissions.some(item => item==='*:*:*')
      ||this.$store.getters.permissions.some(item => item==='chart:status:DL')){
      if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
        this.loading=true;
        Power(this.$route.query.deviceId, this.$route.query.startDate, this.$route.query.endDate)
          .then(res => {
            let preValueBG = 0, preValueEfec = 0, hmean = 0
            let index1 = [];
            let index2 = [];
            let index3 = [];
            this.averageVal1 = 0;
            this.averageVal2 = 0;
            for (let item of res.rows) {
              let temp = item.sendDate;
              let temp2 = item.speedAve;
              let temp3 = item.speedEfec;
              let temp4 = item.h1_3;
              if(temp2<-10||temp2>10){
                temp2 = preValueBG
              }
              if(temp3<-10||temp3>10){
                temp3 = preValueEfec
              }
              if(temp4<-10||temp4>10){
                temp4 = hmean
              }
              index1.push(temp2);
              index2.push(temp3);
              index3.push(temp4);
              this.timeData.push(temp);
              this.averageVal1+=temp2;
              this.averageVal2+=temp3;
              preValueBG = temp2;
              preValueEfec = temp3;
              hmean = temp4;
              this.averageVal3+=temp4;
            }
            this.averageVal1/=index1.length;
            this.averageVal2/=index2.length;
            this.averageVal3/=index3.length;
            this.loading=false;
            this.chartData.push(index1);
            this.chartData.push(index2);
            this.chartData.push(index3);
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
      this.chartInstance = echarts.init(document.getElementById("power"));
      this.chartInstance.setOption({
        title: {
          text: this.$t('deviceDetails.chart.power_status.title'),
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
              if(i<params.length-1){
                relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4)+'m/s'
              }
              else{
                 relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4)+'m'
              }
            }
            return relVal;
          },
        },
        legend: {
          data: ["表观速度", "有效速度","1/3波高"],
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
          // name: "速度(米/秒)",
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
          name: this.$t('deviceDetails.chart.power_status.apparent_speed'),
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
            name: this.$t('deviceDetails.chart.power_status.effect_speed'),
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
          {
            name: this.$t('deviceDetails.chart.power_status.wave_height_1_3'),
            type: "line",
            symbol: 'none',
            itemStyle: {
              color: "#33FFAA",
            },
            lineStyle: {
              width: 1,
            },
            data: this.chartData[2],
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
                this.$t('deviceDetails.chart.power_status.avg_apparent_speed')
                + '：'
                + Number(this.averageVal1).toFixed(2)
                + 'm/s  '
                + this.$t('deviceDetails.chart.power_status.avg_effect_speed')
                + '：'
                + Number(this.averageVal2).toFixed(2)
                + 'm/s  '
                + this.$t('deviceDetails.chart.power_status.avg_wave_height_1_3')
                + '：'
                + Number(this.averageVal3).toFixed(2)
                + 'm',
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

  #power {
    width: 100%;
    height: 100%;
  }
}
</style>
