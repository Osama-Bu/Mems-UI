<template>
<!--  电压状态  -->
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="energy"></div>
  </div>
</template>

<script>
import { Energy } from "@/api/status/status"
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
      chartData: [[0],[0]],
      timeData: [],
    };
  },

  mounted() {
    if(this.$store.getters.permissions.some(item => item==='*:*:*')
      ||this.$store.getters.permissions.some(item => item==='chart:status:NY')){
      if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
        this.loading=true;
        this.chartData=[];
        this.timeData=[];
        Energy(this.$route.query.deviceId, this.$route.query.startDate, this.$route.query.endDate)
          .then(res => {
            let index1 = [];
            for (let item of res.rows) {
              let temp = item.sendDate;
              let temp2 = item.volt;
              index1.push(temp2);
              this.timeData.push(temp);
            }
            this.chartData.push(index1);
            this.loading=false;
            this.refresh = true;
          }).catch(() => {
          this.chartData= [[0],[0]];
          this.timeData= [];
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
      this.chartInstance = echarts.init(document.getElementById("energy"));
      this.chartInstance.setOption({
        title: {
          text: this.$t('deviceDetails.chart.energy_status.title'),
          left: "center",
          top: "1%",
          textStyle: {
            color: "#ffffff",
            fontSize: "15px"
          },
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          position: function(pt) {
            return [pt[0], '10%'];
          },
          formatter(params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4)+'V'
            }
            return relVal;
          },
        },
        legend: {
          data: ["电压"],
          // data: ["输出功率", "输入功率"],
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
          // name: "功率(瓦特)",
          min: 0,
          max: 30,
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
          name: this.$t('deviceDetails.chart.energy_status.voltage'),
          // name: "输出功率",
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
        ],
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 25,
            z: 100,
            style: {
              fill: '#ffffffb6',
              text: this.chartData[0]===undefined?'1'
                :
                this.$t('deviceDetails.chart.energy_status.current_voltage')
                + '：'
                + (this.chartData[0][this.chartData[0].length-1]?Number(this.chartData[0][this.chartData[0].length-1]).toFixed(2) :'NaN')
                + ' V',
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

  #energy {
    width: 100%;
    height: 100%;
  }
}
</style>
