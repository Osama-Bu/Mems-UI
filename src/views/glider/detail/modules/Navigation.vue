<template>
<!--  导航状态  -->
  <div id="mains">
    <dv-loading v-show="loading"></dv-loading>
    <div id="navigation"></div>
  </div>
</template>

<script>
import { Navigation } from "@/api/status/status";
const echarts = require("echarts/lib/echarts");

export default {
  data() {
    return {
      loading: false,
      chartData: [],
      timeData: [],
      averageVal1: 0,
      cep80: 0,
      chartInstance: null,
      refresh: false
    };
  },

  mounted() {
    if (this.$store.getters.permissions.some((item) => item === "*:*:*") ||
      this.$store.getters.permissions.some((item) => item === "chart:status:DH")) {
      if (this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
        this.loading = true;
        Navigation(
          this.$route.query.deviceId,
          this.$route.query.startDate,
          this.$route.query.endDate
        ).then((res) => {
            let index1 = [];
            let index2 = [];
            let index3 = [];
            this.averageVal1 = 0;
            this.timeData = [];
            this.chartData = [];
            if (res.rows.length !== 0) {
              this.cep80 = res.cep80;
              for (let item of res.rows) {

                let temp = item.sendDate;
                let temp2 = item.expectedHeading;
                let temp3 = item.realHeading;
                let temp4 = item.heading;
                index1.push(temp2);
                index2.push(temp3);
                index3.push(temp4);
                this.timeData.push(temp);
                this.averageVal1 += Math.min(
                  (temp2 - temp3 + 360) % 360,
                  (temp3 - temp2 + 360) % 360
                );
              }
              this.averageVal1 /= index1.length;
              this.chartData.push(index1);
              this.chartData.push(index2);
              this.chartData.push(index3);
            }
            this.refresh = true;
            this.loading = false;
          }).catch(() => {
            this.refresh = true;
            this.loading = false;
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
      this.chartInstance = echarts.init(document.getElementById("navigation"));
      this.chartInstance.setOption({
        title: {
          text: this.$t('deviceDetails.chart.navigate_status.title'),
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
            return [pt[0], "10%"];
          },
          axisPointer: {
            axis: "x",
          },
          formatter(params) {
            let relVal = params[0].name;
            for (let i = 0, l = params.length; i < l; i++) {
              //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
              relVal +=
                "<br/>" +
                params[i].marker +
                params[i].seriesName +
                " : " +
                Number(params[i].value).toFixed(4) +
                "°";
            }
            return relVal;
          },
        },
        legend: {
          data: ["期望航向", "当前航向"],
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
          iconStyle: {
            borderColor: "#ffffff",
          },
        },
        xAxis: {
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
          axisLabel: {
            formatter: function (value, index) {
              return value.substring(5, 16);
            },
          },
        },
        yAxis: {
          // name: "角度(度)",
          min: 0,
          max: 360,
          interval: 90,
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
        series: [
          {
            name: this.$t('deviceDetails.chart.navigate_status.expect_heading'),
            type: "line",
            symbol: "none",
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
            name: this.$t('deviceDetails.chart.navigate_status.tractor_heading'),
            type: "line",
            symbol: "none",
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
            name: this.$t('deviceDetails.chart.navigate_status.ship_heading'),
            type: "line",
            symbol: "none",
            itemStyle: {
              color: "#33db54",
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
            type: "text",
            left: "center",
            top: 25,
            z: 100,
            style: {
              fill: "#ffffffb6",
              text:
                this.$t('deviceDetails.chart.navigate_status.avg_heading_diff')
                +"："
                + Number(this.averageVal1).toFixed(2)
                + "°  "
                + this.$t('deviceDetails.chart.navigate_status.heading_diff_cep80')
                + "："
                + Number(this.cep80).toFixed(2)
                + "°  ",
              font: "12px sans-serif",
            },
          },
          {
            type: "text",
            left: "center",
            bottom: 3,
            z: 100,
            style: {
              fill: "#ffffffb6",
              text:
                "（" +
                new Date(Number(this.$route.query.startDate)).toLocaleString(
                  "chinese",
                  { hour12: false }
                ) +
                "—" +
                new Date(Number(this.$route.query.endDate)).toLocaleString(
                  "chinese",
                  { hour12: false }
                ) +
                "）",
              font: "9px sans-serif",
            },
          },
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
  text-align: center;

  #navigation {
    width: 100%;
    height: 100%;
  }
}
</style>

