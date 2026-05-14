<template>
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="temperature"></div>
  </div>
</template>

<script>
import {getCommonValue} from "@/api/carbonflux/carbonflux";
import One from "@/views/carbonflux/module/One.vue";
import {humidity, temperature} from "@/api/status/status";
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
      loading:false,
      title: "温度状态",
      chartArray: [],
      chartData: {},
      timeData: {},
      averageVal: undefined,
      unit: undefined,
      text: undefined,
      QCchartData: {},
      QCtimeData: {},
      QCtext: undefined,
    };
  },

  mounted() {
    //this.init();
    if(this.$store.getters.permissions.some(item => item==='*:*:*')
      ||this.$store.getters.permissions.some(item => item==='chart:status:DL')){
    if (this.$route.query.gliderId && this.$route.query.startDate && this.$route.query.endDate) {
      this.loading = true;
      this.chartData = [];
      this.timeData = [];
      temperature(this.$route.query.gliderId, this.$route.query.startDate, this.$route.query.endDate)
        .then(res => {
          console.log('temperature RES  ', res);
          let index1 = [];
          for (let item of res.rows) {
            let temp = item.sendDate;
            let temp2 = item.m_temperature;
            index1.push(temp2);
            this.timeData.push(temp);
          }
          console.log("2222222222222index1", index1)
          this.chartData.push(index1);
          this.loading = false;
          console.log("this.chartData", this.chartData)
        }).catch(() => {
        this.chartData = [[0], [0]];
        this.timeData = [];
        console.log('到我这了1')
        this.init();
        this.loading = false;
      });
    }
    }
  },
  watch: {
    chartData: {
      handler() {

        this.init();
        console.log("this.chartData",this.chartData)
      },
      // deep:true,
    }
  },
  methods: {
    init() {
      charts = echarts.init(document.getElementById("temperature"));
      charts.setOption({
        title: {
          text: "温度状态",
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
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4)
            }
            return relVal;
          },
        },
        legend: {
          data: ["温度"],
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
          max: 100,
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
          name: "温度",
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

          // {
          // 	name: "输入功率",
          // 	type: "line",
          // 	symbol: 'none',
          // 	itemStyle: {
          // 		color: "#5FA2DB",
          // 	},
          // 	lineStyle: {
          // 		width: 1,
          // 	},
          // 	data: this.chartData[1],
          // 	label: {
          // 		show: false,
          // 		position: "inside",
          // 		formatter: "{c}",
          // 		color: "#ffffff",
          // 		textStyle: {
          // 			fontSize: 16,
          // 			fontWeight: "normal",
          // 		},
          // 	},
          // },
        ],
        graphic: [

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

  #temperature {
    width: 100%;
    height: 100%;
  }
}
</style>
