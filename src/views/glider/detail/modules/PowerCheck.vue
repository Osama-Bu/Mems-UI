<template>
    <div id="mains" style="background-color: #0047AB; padding: 10px;">
      <!-- <dv-loading v-show="loading"></dv-loading> -->
      <div id="powercheck" style="width: 1400px; height: 700px;"></div>
    </div>
  </template>

  <script>
  import {temperature} from "@/api/status/status";
  import { getPowerCheck } from "@/api/device/device";
  const echarts = require("echarts/lib/echarts");
  require("echarts/lib/component/title");
  require("echarts/lib/component/toolbox");
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/grid");
  require("echarts/lib/component/legend");
  require("echarts/lib/chart/line");
  var charts = {};
  export default {
    name:'powercheck',
    data() {
      return {
        loading:false,
        title: "能量检测",
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

    props: ['PowerCheckData'],

    mounted() {
      // if (this.PowerCheckData[0].length > 0) {
      //   this.init();
      //   // console.log("PowerCheckData",this.PowerCheckData);
      // }
      this.init();
      // if(this.$store.getters.permissions.some(item => item==='*:*:*')||this.$store.getters.permissions.some(item => item==='report:report:getPowerCheck')){
      // if (this.$route.query.gliderId && this.$route.query.startDate && this.$route.query.endDate) {
      //   this.loading = true;
      //   this.chartData = [];
      //   this.timeData = [];
      //     getPowerCheck(this.$route.query.gliderId, this.$route.query.startDate, this.$route.query.endDate)
      //         .then(res => {
      //             // console.log('powercheck RES  ', res);
      //             let index1 = [];
      //                 for (let item of res.data.rows) {
      //                     let tempDate = new Date(item.timeStamp);
      //                     // 提取日期组件
      //                     let year = tempDate.getFullYear();
      //                     let month = tempDate.getMonth() + 1; // 月份是从0开始的，所以要加1
      //                     let day = tempDate.getDate();
      //                     let hours = tempDate.getHours();
      //                     let minutes = tempDate.getMinutes().toString().padStart(2, '0');//确保整点如4:00而不是4:0
      //                     let seconds = tempDate.getSeconds().toString().padStart(2, '0');
      //                     // 构造表示的日期时间字符串
      //                     let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      //                     let tempPower = item.powerCheck;
      //                     index1.push(tempPower);
      //                     this.timeData.push(formattedDate);
      //                 }
      //             // console.log("2222222222222index1", index1)
      //             this.chartData.push(index1);
      //             this.loading = false;
      //             // console.log("能量", this.chartData);
      //             // console.log("时间", this.timeData);
      //         }).catch(() => {
      //             this.chartData = [[0], [0]];
      //             this.timeData = [];
      //             //   console.log('到我这了1')
      //             this.init();
      //             this.loading = false;
      //         });
      // }
      // }
    },
    // watch: {
    //   chartData: {
    //     handler() {

    //       this.init();
    //     //   console.log("this.chartData",this.chartData)
    //     },
    //     // deep:true,
    //   }
    // },
    methods: {
      init() {
        charts = echarts.init(document.getElementById("powercheck"));
        charts.setOption({
          // backgroundColor: "#0d47a1", // 设置图表背景为蓝色
          title: {
            text: "能量检测",
            left: "center",
            top: "1%",
            textStyle: {
              color: "#ffffff",
              fontSize: "30px", // 更接近图片字体大小
            },
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            position: function (pt) {
              return [pt[0], "10%"];
            },
            formatter(params) {
              var relVal = params[0].name;
              for (var i = 0, l = params.length; i < l; i++) {
                relVal +=
                  "<br/>" +
                  params[i].marker +
                  params[i].seriesName +
                  " : " +
                  Number(params[i].value).toFixed(2);
              }
              return relVal;
            },
          },
          legend: {
            show: false, // 图例隐藏
          },
          grid: {
            left: "10%", // 调整图表间距
            right: "10%",
            bottom: "15%",
            top: "20%",
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
            iconStyle: {
              borderColor: "#ffffff",
            },
          },
          xAxis: {
            type: "value",
            name: "能量 (dB)",
            splitNumber: 15, // 建议分割的段数，这将影响刻度线的数量
            nameTextStyle: {
              color: "#ffffff",
              fontSize: 12, // 标签字体大小
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ffffff", // X轴颜色
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: "#ffffff", // X轴刻度颜色
              },
            },
            axisLabel: {
              color: "#ffffff", // X轴字体颜色
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ffffff33", // 网格线颜色，透明度调整
              },
            },
          },
          yAxis: {
            type: "category",
            data: this.PowerCheckData[1],
            name: "时间 (s)",
            nameTextStyle: {
              color: "#ffffff",
              fontSize: 12,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ffffff", // Y轴颜色
              },
            },
            axisTick: {
              show: true,
              alignWithLabel: true,
              lineStyle: {
                color: "#ffffff", // Y轴刻度颜色
              },
            },
            axisLabel: {
              alignWithLabel: true,
              color: "#ffffff", // Y轴字体颜色
              formatter: function (value, index) {
                return value.substring(5, 19); // 格式化时间显示
              },
            },
            splitLine: {
              show: false, // 隐藏水平网格线
            },
          },
          dataZoom: [
            {
              type: "inside",
              xAxisIndex: 0,
              start: 0,
              end: 100,
              filterMode: "none",
            },
            {
              type: "inside",
              yAxisIndex: 0,
              start: 0,
              end: 100,
              filterMode: "none",
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
          series: [
            {
              name: "能量",
              type: "line",
              symbol: "circle", // 数据点为圆形
              symbolSize: 6, // 数据点大小
              data: this.PowerCheckData[0],
              itemStyle: {
                color: "#ff5722", // 数据点颜色
                borderColor: "#ffffff", // 数据点边框颜色
                borderWidth: 1,
              },
              lineStyle: {
                width: 2, // 线宽
                color: "#ff5722", // 线条颜色
              },
            },
          ],
          graphic: {
            elements: [
              {
                type: 'rect',
                shape: {
                  width: 1400,
                  height: 700,
                  x: 0,
                  y: 0
                },
                style: {
                  fill: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      { offset: 0, color: '#00c8fe' }, // 渐变开始颜色
                      { offset: 1, color: '#005cea' }   // 渐变结束颜色
                    ],
                    global: false
                  }
                },
                z: 0 // 确保矩形在最底层
              }
            ]
          },
      // 其他配置保持不变
        });
      },
    },
  };
  </script>

  <style scoped lang="scss">
#mains {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #00c8fe 0%, #005cea 100%); // 定义渐变背景
}
  // #mains {
  //   width: 100%;
  //   height: 100%;

    // #powercheck {
    //   width: 100%;
    //   height: 100%;
    // }
  // }

  </style>
