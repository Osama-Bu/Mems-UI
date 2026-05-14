<template>
  <div id="mains">
    <!--    <dv-loading v-show="loading"></dv-loading>-->
    <div :id="'chart-container-'+this.echartsId" class="echarts"></div>
    <!-- <div :id="'chart-container-'+this.echartsId + 'QC'" class="echarts"></div> -->
  </div>
</template>

<script>
    const echarts = require("echarts/lib/echarts");
    var charts = {};
    export default {
        name: "One",
        data() {
            return {
                loading: false,
                // chartData: [],
                // timeData: [],
                cep80: 0,
            };
        },
        props: {
            str: {
                type: String,
                default: "",
            },
            echartsId: {
                type: Number,
            },
            chartData: {},
            timeData: {},
            averageVal: undefined,
            unit: undefined,
            title: undefined,
            text: undefined,
            QCchartData: {},
            QCtimeData: {},
            QCtext: undefined,
        },
        mounted() {
            this.init();
            // console.log("chartData:", this.chartData);
            // console.log("QCchartData:", this.QCchartData);
            // console.log("chartData:", this.timeData);
            // console.log("QCchartData:", this.QCtimeData);
            //this.initQC();
            //console.log(this.unit);
            // this.loading=true;
            // this.chartData = [20,270,180,220]
            // this.timeData = ['2023-08-20','2023-08-21','2023-08-22','2023-08-23']
        },
        watch: {
            chartData: {
                handler() {
                    this.init();
                },
            },
            str: {
                handler() {
                    this.init();
                },
            },
            QCchartData: {
                handler() {
                    this.init();
                },
            },
        },
        methods: {
            calculateGraphicTop() {
                // 获取标题的行数
                const titleLines = this.title.split('\n').length;
                //console.log(titleLines);
                // 动态计算 top 的值
                const initialTop = 30; // 初始值
                const lineHeight = 14; // 假设每行的高度为14px
                const dynamicTop = initialTop + (titleLines - 1) * lineHeight;

                return dynamicTop;
            },
            init() {
                //console.log(this.averageVal);
                //console.log(this.unit);
                charts = echarts.init(document.getElementById('chart-container-' + this.echartsId));
                const seriesOriginal = {
                    name: this.str,
                    type: "line",
                    symbol: "none",
                    data: this.chartData,
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
                };

                // QC 绘制的 series 对象
                const seriesQC = {
                    name: "质控" + this.str,
                    type: "line",
                    symbol: "none",
                    data: this.QCchartData,
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
                        color: "#ffff00",
                        textStyle: {
                            fontSize: 16,
                            fontWeight: "normal",
                        },
                    },
                };

                // 根据需要设置不同的 x 轴数据
                seriesOriginal.xAxisIndex = 0;
                seriesQC.xAxisIndex = 1;

                charts.setOption({
                    title: {
                        text: this.title,
                        left: "center",
                        top: "0%",
                        textStyle: {
                            color: "#ffffff",
                            fontSize: "15px",
                        },
                    },
                    tooltip: {
                        trigger: "axis",
                        position: function (pt, params, dom, rect, size) {
                            // 获取图表的宽度
                            var chartWidth = size.viewSize[0];
                            // 计算提示框的位置
                            var xPos = pt[0] < chartWidth / 2 ? pt[0] + 10 : pt[0] - dom.offsetWidth - 10;
                            var yPos = pt[1] < size.viewSize[1] / 2 ? pt[1] + 10 : pt[1] - dom.offsetHeight - 10;
                            return [xPos, yPos];
                        },
                        // position: function (pt) {
                        //     return [pt[0], "10%"];
                        // },
                        axisPointer: {
                            axis: "x",
                        },
                        formatter: (params) => {
                            //console.log(params);
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                //console.log(params[i]);
                                //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
                                relVal +=
                                    "<br/>" +
                                    params[i].marker +
                                    params[i].seriesName +
                                    " : " +
                                    Number(params[i].value).toFixed(4) +
                                    this.unit;
                            }
                            return relVal;
                        },
                        
                    },
                    legend: {
                        data: ["原始" + this.str],
                        show: false,
                        top: "14%",
                        textStyle: {
                            color: "#ffffff",
                            fontSize: "20px",
                        },
                    },
                    grid: {
                        left: "1%",
                        right: "3%",
                        bottom: "12%",
                        top:"20%",
                        containLabel: true,
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},
                        },
                        iconStyle: {
                            borderColor: "#ffffff",
                        },
                    },
                    xAxis:[{
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
                    }, {
                        data: this.QCtimeData,
                        splitLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                            onZero: false,
                            lineStyle: {
                                color: "#ff0000",
                            },
                        },
                        axisLabel: {
                            show:false,
                            formatter: function (value, index) {
                                return value.substring(5, 16);
                            },
                        },
                    }],
                    yAxis: {
                        min :Math.floor(Math.min(Math.min(...this.chartData), Math.min(...this.QCchartData)) / 5) * 5 - 5,
                        //min: Math.min(Math.min(...this.chartData), Math.min(...this.QCchartData)) - 10,
                        // name: "角度(度)",
                        //min: 0,
                        //max: 360,
                        //interval: 90,
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
                            show: false,
                            start: 0,
                            end: 20,
                            textStyle: {
                                color: "#ffffff",
                            },
                        },
                    ],
                    series:  [seriesOriginal, seriesQC],
                    graphic: [
                        {
                            type: "text",
                            left: "center",
                            top: this.calculateGraphicTop(),
                            z: 100,
                            style: {
                                fill: "#ffffffb6",
                                text:  this.text+ '\n' +this.QCtext,
                                font: "12px sans-serif",
                            },
                        },
                        {
                            type: "text",
                            left: "center",
                            bottom: 10,
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
                                font: "10px sans-serif",
                            },
                        },
                    ],
                });
                window.addEventListener("resize", () => {
                    charts.resize();
                });
            },

        },
    };
</script>

<style scoped lang="scss">
  #mains {
    width: 100%;
    height: 100%;
    background-color: #1d1e22;
    // border:2px solid #2C303A;
    border-top: 2px solid #2c303a;
    box-shadow: 0px 2px 3px 0px #000000;
    border-radius: 12px;
  }

  .echarts {
    height: 100%;
  }
</style>
