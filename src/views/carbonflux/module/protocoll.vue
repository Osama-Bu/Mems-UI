<template>
    <div id="mains">
        <dv-loading v-show="loading"></dv-loading>
        <div :class="'chart-container-' + chartIndex"></div>
        <!--    <div id="drag"></div>-->
    </div>
</template>

<script>


import {
    Drag, Navigation
} from "@/api/status/status"
import { msgParseFind } from "@/api/device/device";
import { getCommonValue, getDPMValue } from "@/api/carbonflux/carbonflux";

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
            loading: false,
            chartData: [],
            timeData: [],
            averageVal1: 0,
            averageVal2: 0,
            abnormalProbability: 0,
            form: {
                ascFieldList: [],
                descFieldList: [],
                endTimeStamp: 0,
                fieldLimitList: [],
                gliderId: 0,
                msgId: undefined,
                startTimeStamp: 0
            }
        };

    },
    props: {
        chartIndex: Number, // 新增一个属性用于标识图表的索引
        msgId: undefined,
        ascFieldList: [],
        descFieldList: [],
        fieldLimit_name: undefined,
    },
    mounted() {
        // console.log('DOM element:', document.getElementById('your-chart-id'));
        //this.init();
        if (this.$store.getters.permissions.some(item => item === '*:*:*')
          || this.$store.getters.permissions.some(item => item === 'chart:status:QY')) {
            if (this.$route.query.gliderId && this.$route.query.startDate && this.$route.query.endDate) {
                this.loading = true;
                this.form.gliderId = this.$route.query.gliderId
                this.form.startTimeStamp = this.$route.query.startDate
                this.form.endTimeStamp = this.$route.query.endDate
                this.form.fieldLimitList.push(this.fieldLimit_name)
                // console.log("this.form.fieldLimitList",this.form.fieldLimitList)
                getCommonValue(this.form)
                    .then(res => {
                        let index3 = [];
                        this.averageVal1 = 0;
                        this.timeData = [];
                        this.chartData = [];
                        if (res.data.length != 0) {
                            for (let item of res.data) {
                                let tempDate = new Date(item._id.timestamp * 1000);
                                // 提取日期组件
                                let year = tempDate.getFullYear();
                                let month = tempDate.getMonth() + 1; // 月份是从0开始的，所以要加1
                                let day = tempDate.getDate();
                                let hours = tempDate.getHours();
                                let minutes = tempDate.getMinutes();
                                // 构造表示的日期时间字符串
                                let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                                // console.log('item._id.timestamp ', item._id.timestamp);
                                let temp4 = item[this.fieldLimit_name];
                                this.averageVal1 += temp4;
                                index3.push(temp4);
                                this.timeData.push(formattedDate);
                            }

                            this.chartData.push(index3);
                            // console.log('this.timeData  ',this.timeData);
                        }
                        // console.log('this.chartData.length  ',res.data.length);
                        this.averageVal1 /= res.data.length
                        this.loading = false;
                        //this.chartData = [];
                    }).catch(() => {
                        this.init();
                        this.loading = false;
                    });
            }
        }

    },
    watch: {
        chartData: {
            handler() {
                // console.log(this.chartData);
                this.init();
            },
            // deep:true,
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
                        var relVal = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            //遍历出来的值一般是字符串，需要转换成数字，再进项tiFixed四舍五入
                            relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Number(params[i].value).toFixed(4) + '°'
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
                    iconStyle: {
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
                    axisLabel: {
                        formatter: function (value, index) {
                            return value.substring(5, 16);
                        }
                    }
                },
                yAxis: {
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
                        name: this.fieldLimit_name + "值",
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
                        name: "横滚",
                        type: "line",
                        symbol: 'none',
                        itemStyle: {
                            width: 1,
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
                            text: 'Average_' + this.fieldLimit_name + ': ' + Number(this.averageVal1).toFixed(2),
                            // text: '俯仰：'+Number(this.chartData[0][this.chartData[0].length-1]).toFixed(2)+'°  '+'横滚：'+Number(this.chartData[1][this.chartData[1].length-1]).toFixed(2)+'°',
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
.chart-container-12 {
    width: 100%;
    /* 控制宽度，以便每行显示两个 */
    height: 100%;
    /* 控制高度 */
    margin: 0.1%;
    /* 控制间距 */
}
</style>

