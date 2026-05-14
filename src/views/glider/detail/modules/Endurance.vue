<template>
<!--  续航状态  -->
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="endurance"></div>
  </div>
</template>

<script>
import {
  Endurance
} from "@/api/status/status"
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
      loading:true,
      chartData: [[0],[0]],
      timeData: [],
    };
  },
  mounted() {
    if(this.$store.getters.permissions.some(item => item==='*:*:*')
      ||this.$store.getters.permissions.some(item => item==='chart:status:XH')){
      if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
        this.loading=true;
        this.chartData=[];
        this.timeData=[];
        Endurance(this.$route.query.deviceId, this.$route.query.startDate, this.$route.query.endDate)
          .then(res => {
            let index1 = [];
            let index2 = [];
            for (let item of res.rows) {
              let temp = item.sendDate;
              let temp2 = item.sailKilo;
              let temp3 = item.effectKilo;
              index1.push(temp2);
              index2.push(temp3);
              this.timeData.push(temp);
            }
            this.chartData.push(index1);
            this.chartData.push(index2);
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
      // 获取最大值方法
      function calMax(arr) {
        const max = Math.max.apply(null, arr); // 获取最大值方法
        const maxint = Math.ceil(max / 5); // 向上以5的倍数取整
        return maxint * 5 + 5; // 输出最大值
      }
      // 获取最小值方法
      function calMin(arr) {
        const min = Math.min.apply(null, arr); // 获取最小值方法
        const minint = Math.floor(min); // 向下以1的倍数取整
        return minint - 5; // 输出最小值
      }
      const minData1 = calMin(this.chartData[0]);
      const minData2 = calMin(this.chartData[1]);
      const maxData1 = calMax(this.chartData[0]);
      const maxData2 = calMax(this.chartData[1]);

      if(this.chartInstance){
        this.chartInstance.dispose();
      }
      this.refresh = false;

      this.chartInstance = echarts.init(document.getElementById("endurance"));
      this.chartInstance.setOption({
        title: {
          text: this.$t('deviceDetails.chart.endurance_status.title'),
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
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(2)+'Km'
            }
            return relVal;
          },
        },
        legend: [{
          data: ["对地航程"],
          show: false,
          top: "14%",
          textStyle: {
            color: "#3F0F0F",
            fontSize: "20px",
          },
        },{
          data: ["有效轨迹航程"],
          show: false,
          top: "14%",
          textStyle: {
            color: "#3F0F0F",
            fontSize: "20px",
          },
        },],
        grid: {
          left: "7%",
          right: "10%",
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
        yAxis: [{
          // name: "对地航程(Km)",
          type: "value",
          min: 0,
          max: maxData1,
          //splitNumber: 5, //设置坐标轴的分割段数
          interval: (maxData1  / 5), // 标轴分割间隔
          splitLine: {  //设置坐标轴的分割段数
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
        },{
          // name: "有效轨迹航程(Km)",
          type: "value",
          min: 0,
          max: maxData2,
          //splitNumber: 5, //设置坐标轴的分割段数
          interval: (maxData2 / 5), // 标轴分割间隔
          splitLine: {  //设置坐标轴的分割段数
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
        }],
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
          name: this.$t('deviceDetails.chart.endurance_status.ground_range'),
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
        },{
          name: this.$t('deviceDetails.chart.endurance_status.effect_track_range'),
          yAxisIndex: 1, //在单个图表实例中存在多个y轴的时候有用
          type: "line",
          symbol: 'none',
          data: this.chartData[1],
          itemStyle: {
            color: "#5FA2DB",
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
        }, ],
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
                this.$t('deviceDetails.chart.endurance_status.ground_range')
                + '：'
                + Number(this.chartData[0][this.chartData[0].length-1]).toFixed(2)
                + 'Km  '
                + this.$t('deviceDetails.chart.endurance_status.effect_track_range')
                + '：'
                + Number(this.chartData[1][this.chartData[1].length-1]).toFixed(2)
                +'Km',
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

  #endurance {
    width: 100%;
    height: 100%;
  }
}
</style>

