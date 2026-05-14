<template>
    <div id="main">
        <div class="top-back"></div>
        <div class="navbar">
            <navbar />
        </div>
        <div class="topTitleBox">
            <div class="dateTimeBox">
                <p class="dateText">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</p>
            </div>
            <div style="position: absolute; top: 35px; left: 60px">
                <div style="color: #06f1ef; display: inline">
                    <span style="color: #ffffff; display: inline">设备ID:</span>
                    <el-select v-model="selectedID"
                               filterable
                               :placeholder="selectedID+''"
                               style="width: 95px; margin-right: 10px"
                               @change="idChanged()"
                               class="idSelect">
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.cdId"
                        :value="item.id"
                      >
                        <span style="float: left">{{ item.cdId }}</span>
                        <span style="color: rgba(0, 3, 48, 0); font-size: 13px">__</span>
                        <span style="color: #8492a6; font-size: 13px">{{ item.deviceName }}</span>
                      </el-option>
                    </el-select>
                    <!--          <span style="color: #ffffff; font-size: 30px">{{ deviceID }}</span>-->
                    <span>
                        <el-date-picker v-model="startDate" type="datetime" value-format="timestamp"
                            placeholder="请选择开始时间" style="margin-left: 5px; width: 195px"></el-date-picker>
                        <el-date-picker v-model="endDate" type="datetime" value-format="timestamp" placeholder="请选择结束时间"
                            style="margin-left: 5px; width: 195px"></el-date-picker>
                    </span>
                    <span style="color: #ffffff; font-size: 16px; margin-left: 20px">指标选择：</span>
                    <el-select v-model="SelectIndex" filterable @change="indexChanged()" placeholder="请选择">
                        <el-option v-for="item in indexOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span style="color: #ffffff; font-size: 16px; margin-left: 10px">指标项：</span>
                    <!--  观测指标 -->
                    <!--    <el-select v-model="indexSelectionValue" filterable multiple collapse-tags placeholder="请选择"
                        v-if="indexType == '观测'" @change="debounceObservationIndexChange()"> -->
                    <el-select v-model="indexSelectionValue" filterable multiple collapse-tags placeholder="请选择"
                        v-if="indexType == '观测'">
                        <!-- <div v-if="indexType === '观测'">{{ selectedID }}</div> -->
                        <template v-if="selectedID === 111164">
                            <el-option-group v-for="group in ObservationIndexOptions282" :key="group.label"
                                :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-option-group>
                        </template>

                        <template v-else>
                            <el-option-group v-for="group in ObservationIndexOptions" :key="group.label"
                                :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-option-group>
                        </template>
                    </el-select>
                    <!--  统计指标 @change="StatisticalIndexChange()"-->
                    <el-select filterable v-model="indexSelectionValue" v-if="indexType == '统计'" placeholder="请选择">
                        <el-option v-for="item in StatisticalIndexOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option></el-select>
                    <!--  计算指标 @change="CalculationIndexChange()" -->
                    <el-select v-model="indexSelectionValue" filterable multiple collapse-tags v-if="indexType == '计算'"
                        placeholder="请选择">
                        <el-option v-for="item in CalculationIndexOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <el-button type="primary" @click="confirmQuery" style="margin-left: 10px;">确认查询</el-button>

                    <!-- 点击按钮触发显示风向风速玫瑰图 -->
                    <el-button type="text" style="font-size: 16px; margin-left: 10px" @click="showWindRoseChart"
                        :modal="false" v-hasPermi="['flux:rose']">
                        风向风速玫瑰图
                    </el-button>

                    <el-dialog title="风向风速玫瑰图" :visible.sync="dialogVisible" :top="'10px'" :left="'10px'"
                        :width="'1200px'" :height="'1200px'">
                        <div ref="windRoseChartContainer" id="windRoseChartContainer"
                            style="width: 600px; height: 400px; background-color: white;">
                            <div id="windRoseChart" style="width: 100%; height: 100%;"></div>
                        </div>
                    </el-dialog>

                    <!-- <div id="windRoseChart" style="width: 600px; height: 400px;"></div> -->

                    <div class="custom-spacing"></div>
                    <el-popover placement="right" trigger="click">
                        <div>
                            <el-button v-show="indexType == '计算'" type="text"
                                @click="Calculationprincipl1()">涡度相关法</el-button>
                        </div>
                        <div>
                            <el-button v-show="indexType == '计算'" type="text"
                                @click="Calculationprincipl2()">分压差法</el-button>
                        </div>
                        <el-button v-show="indexType == '计算'" type="text" slot="reference"
                            style="font-size: 16px">计算原理</el-button>
                    </el-popover>

                    <!--          <el-cascader-->
                    <!--            :show-all-levels="false"-->
                    <!--            v-model="indexSelection.value"-->
                    <!--            :options="indexSelection.options"-->
                    <!--            :props="props"-->
                    <!--            collapse-tags-->
                    <!--            style="width: 270px"-->
                    <!--            @change="indexChangeHandler()"-->
                    <!--          ></el-cascader>-->
                    <span v-if="indexSelection.value && indexSelection.value[0] == '观测'">
                        <el-button type="text" class="query" @click="indexChangeHandler()"
                            style="margin-left: 50px">数据显示</el-button>
                        <el-button type="text" class="excel" @click="qualityControl()" :loading="downloading"
                            v-show="false">质量控制</el-button>
                        <!--            <el-button-->
                        <!--              type="text"-->
                        <!--              class="excel"-->
                        <!--              @click="downloadExcel()"-->
                        <!--              :loading="downloading"-->
                        <!--              >Excel导出</el-button-->
                        <!--            >-->
                    </span>
                    <span v-if="indexSelection.value && indexSelection.value[0] == '计算'">
                        <el-button type="text" class="query" @click="Calculationprinciple()"
                            style="margin-left: 50px">计算原理</el-button>
                        <!--            <el-button-->
                        <!--              type="text"-->
                        <!--              class="excel"-->
                        <!--              @click="Fluxcalculation()"-->
                        <!--              :loading="downloading"-->
                        <!--              >通量计算</el-button-->
                        <!--            >-->
                        <el-button type="text" class="excel" @click="indexChangeHandler()"
                            :loading="downloading">数据显示</el-button>
                        <el-button type="text" class="excel" @click="qualityControl()" :loading="downloading"
                            v-show="false">质量控制</el-button>
                        <!--            <el-button-->
                        <!--              type="text"-->
                        <!--              class="excel"-->
                        <!--              @click="Datainterpolation()"-->
                        <!--              :loading="downloading"-->
                        <!--              >数据插补</el-button-->
                        <!--            >-->
                    </span>
                    <span v-if="indexSelection.value && indexSelection.value[0] == '统计'">
                        <el-button type="text" class="query" @click="indexChangeHandler()"
                            style="margin-left: 50px">数据显示</el-button>
                    </span>
                </div>
            </div>
        </div>
        <div class="page-title">
            海气通量模块<br />
            <span class="en">
                Sea-Air Flux Module of Shore based Monitoring System
            </span>
        </div>
        <div class="page" v-loading="loading" element-loading-background="rgba(19, 20, 23, 0.8)"
            element-loading-text="数据加载中">
            <div class="list" v-for="(chart, index) in chartArray" :key="keyCounter + index * 1000">
                <One style="height: 100%" :chartData="chart.chartData" :timeData="chart.timeData" :text="chart.text"
                    :unit="chart.unit" :title="chart.title" :QCchartData="chart.QCchartData"
                    :QCtimeData="chart.QCtimeData" :QCtext="chart.QCtext" :str="chart.str" :echartsId="index"></One>
            </div>

            <SixGraphs ref="SixGraphsMoudle" :str="indexSelectionValue" :SixchartData="SixchartData"
                :SixtimeData="SixtimeData" :title="title" :unit="unit" :Sixtext="Sixtext"
                v-if="graghType == 'six' && !VCMpriIsShow && !DPMpriIsShow"></SixGraphs>
            <VCMprinciple v-if="VCMpriIsShow"></VCMprinciple>
            <DPMprinciple v-if="DPMpriIsShow"></DPMprinciple>
            <div class="note-message" v-if=" VCMpriIsShow || DPMpriIsShow ? false
            : indexSelectionValue == null || indexSelectionValue.length == 0">请选择信息进行查询</div>
        </div>
        <div>
            <div class="echarts" id="wind-rose-chart" style="width: 100%; height: 500px"></div>
        </div>
    </div>
</template>

<script>
import OneGraph from "./module/OneGraph";
import One from "./module/One";
import TwoGraphs from "./module/TwoGraphs";
import SixGraphs from "./module/SixGraphs";
import VCMprinciple from "./module/VCMprinciple";
import DPMprinciple from "./module/DPMprinciple";

    import { Navbar } from "@/layout/components";
    import { getDeviceInfo } from "@/api/device/device";
    import { detailExcel } from "@/api/status/status";
    import { getCommonValue, getDPMValue,getRose } from "@/api/carbonflux/carbonflux";
    import * as echarts from 'echarts'; // 引入ECharts库
    import { debounce } from 'lodash';
    export default {
        name: "home",
        components: {
            OneGraph,
            One,
            TwoGraphs,
            SixGraphs,
            Navbar,
            VCMprinciple,
            DPMprinciple,
        },
        data() {
            return {

                dialogVisible: false, // 控制弹窗显示状态
                myChart: null, // echarts 图表对象
                cachedData: {},
                lastRequestTime: 0,
                dataCache: {}, // 数据缓存对象
                chartData: [], // 风速数据
                directionData: [], // 风向数据
                //搜索字段
                queryParams: {
                    pageNum: -1,
                    pageSize: 10,
                    code: undefined,
                    name: undefined,
                    imel: undefined,
                },
                VCMpriIsShow: false,
                DPMpriIsShow: false,
                loading: false,
                downloading: false,
                noteIsShow: true,
                dateDay: null, //时间
                dateYear: null,
                dateWeek: null,
                weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                deviceID: null,
                startDate: null,
                endDate: null,
                keyCounter: 1,
                selectedID: null,
                chartArray: [], // 添加更多图表数据对象
                SelectIndex: '', // 所选指标
                ObservationIndexShow: true, // 观测指标选择框是否显示
                CalculationIndexShow: false, // 计算指标选择框是否显示
                StatisticalIndexShow: false, // 计算指标选择框是否显示
                // 可选指标
                indexOptions: [
                    {
                        value: "观测",
                        label: "观测指标"
                    },
                    {
                        value: "计算",
                        label: "计算指标"
                    },
                    {
                        value: "统计",
                        label: "统计指标"
                    },
                ],
                // 观测指标-指标项
                ObservationIndexOptions: [
                    {
                        label: '空气指标',
                        options: [
                            {
                                value: "风速",
                                label: "风速",
                            },
                            {
                                value: "风向",
                                label: "风向",
                            },
                            {
                                value: "气温",
                                label: "气温",
                            },
                            {
                                value: "气压",
                                label: "气压",
                            },
                            {
                                value: "U轴风速",
                                label: "U轴风速",
                            },
                            {
                                value: "V轴风速",
                                label: "V轴风速",
                            },
                            {
                                value: "W轴风速",
                                label: "W轴风速",
                            },
                            {
                                value: "空气CO2浓度",
                                label: "空气CO2浓度",
                            },
                            //{
                               //value: "湿度",
                                //label: "湿度",
                        //}
                        ]
                    },
                    {
                        label: '水质指标',
                        options: [
                            {
                                value: "海水CO2分压",
                                label: "海水CO2分压",
                            },
                            {
                                value: "水温",
                                label: "水温",
                            },
                            {
                                value: "盐度",
                                label: "盐度",
                            },
                            {
                                value: "叶绿素",
                                label: "叶绿素",
                            },
                            {
                                value: "溶解氧",
                                label: "溶解氧",
                            },
                            {
                                value: "pH",
                                label: "pH",
                            },
                              {
                                value: "海水CO2浓度",
                                label: "海水CO2浓度",
                        }                ]
                    }],
                ObservationIndexOptions282: [
                {
                    label: '空气指标',
                    options: [
                        {
                            value: "风速",
                            label: "风速",
                        },
                        {
                            value: "风向",
                            label: "风向",
                        },
                        {
                            value: "气温",
                            label: "气温",
                        },
                        {
                            value: "气压",
                            label: "气压",
                        },
                        {
                            value: "湿度",
                            label: "湿度",
                        },
                        {
                            value: "空气CO2浓度",
                            label: "空气CO2浓度",
                        },
                    ]
                },
                {
                    label: '水质指标',
                    options: [
                        {
                            value: "海水CO2分压2",
                            label: "海水CO2分压",
                        },
                        {
                            value: "pH",
                            label: "pH",
                        },
                        {
                            value: "盐度",
                            label: "盐度",
                        },
                        {
                            value: "海水CO2浓度",
                            label: "海水CO2浓度",
                        }]
                }],
                // 计算指标-指标项
                CalculationIndexOptions: [
                    {
                        value: "涡度相关法",
                        label: "涡度相关法",
                    },
                    {
                        value: "分压差法",
                        label: "分压差法",
                    },
                ],
                // 统计指标-指标项
                StatisticalIndexOptions: [
                    {
                        value: "涡度相关法",
                        label: "涡度相关法",
                    },
                    {
                        value: "分压差法",
                        label: "分压差法",
                    },
                ],
                // 所选的指标需显示的下拉框 v-if控制
                indexType: "",
                // 选择的指标项
                indexSelectionValue: null,
                props: {multiple: true},
                options: [],
                graghType: "",
                timeData: [],
                QCchartData: [],
                QCtimeData: [],

                averageVal: 0,
                QCaverageVal: 0,
                unit: "", //单位名称
                title: "", // 图标题
                text: "", //标题下文字
                flag: "", //测试
                QCtext: "",
                Twotitle: "",
                Sixtext: "",
                SixchartData: [],
                SixtimeData: [],
                static_data: [
                    {
                        chartData1: [],
                        timeData1: [],
                    },
                ],
                indexSelection: {
                    value: null,
                    options: [{
                        value: "统计",
                        label: "统计指标",
                        children: [
                            {
                                value: "涡度相关法",
                                label: "涡度相关法",
                            },
                            {
                                value: "分压差法",
                                label: "分压差法",
                            },
                        ],
                    }],
                },
            };
        },

  created() {
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
            this.selectedID = this.$route.query.deviceId;
            this.startDate = this.$route.query.startDate;
            this.endDate = this.$route.query.endDate;
    getDeviceInfo(this.queryParams).then((res) => {
                if (res.code !== 200) {
                    alert("请重新链接");
                } else {
                  this.options = [];
                  for (let item of res.rows) {
                    const temp = {
                      id: item.id,
                      cdId: item.cdId,
                      deviceName: item.deviceName
                    };
                    this.options.push(temp);
                  }
                }
                if ( this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate) {
                  const selectedItem = this.options.find(item => item.id === parseInt(this.$route.query.deviceId));
                  this.selectedID = selectedItem.id;
                  this.noteIsShow = false;
                } else {
                    this.selectedID = this.options[0].id;
                    this.startDate = new Date().getTime() - 3 * 24 * 3600 * 1000;
                    this.endDate = new Date().getTime();
                    this.idChanged(null);
                    this.noteIsShow = false;
                }
            });
            this.SelectIndex = this.indexOptions[0].value
            this.indexChanged()
        },
        mounted() {
            this.indexSelectionValue = null
            this.timeFn();
            this.noteIsShow = !(this.$route.query.deviceId && this.$route.query.startDate && this.$route.query.endDate);
        },

        watch: {
            indexType(newIndexType, oldIndexType) {
                // 监听 indexType 变化
                if (newIndexType !== oldIndexType) {
                    // 当 indexType 发生变化时，清空 indexSelectionValue 数组
                    this.chartArray = [];
                }
            }
        },
        methods: {
            confirmQuery() {
                if (this.indexType === '统计') {
                    this.StatisticalIndexChange();
                    //this.indexSelectionValue = this.statisticalIndexValue;
                }
                // Handle calculation index
                if (this.indexType === '计算') {
                    this.CalculationIndexChange();
                   //this.indexSelectionValue = this.calculationIndexValue;
                }
                if (this.indexType === '观测') {
                    this.ObservationIndexChange();
                    //this.indexSelectionValue = this.calculationIndexValue;
                }
            },
           //qgl
            debounceObservationIndexChange: debounce(function () {
                // 在此处调用事件处理函数
                this.ObservationIndexChange();
            }, 1000) ,// 设置防抖等待时间为 500 毫秒
            adjustVModalStyleAndInitializeChart() {
                let vModal = document.querySelector('.v-modal');
                if (vModal) {
                    vModal.style.display = 'none'; // 直接隐藏遮罩
                }
                this.showWindRoseChart5();
            },
            showWindRoseChart() {
                this.dialogVisible = true;
                setTimeout(() => {
                    this.adjustVModalStyleAndInitializeChart();
                }, 100); // 延迟时间可以根据需要调整

                //this.showWindRoseChart5();
                // this.$nextTick(() => {
                //     // 点击按钮时初始化图表
                //     setTimeout(() => {
                //         this.showWindRoseChart5();
                //     }, 500);
                // });
            },
            async showWindRoseChart5() {
                let data = {
                  deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "rose",
                };
                //console.log(1);
                // 获取玫瑰图数据
                let res = await getRose(data);
                let uniqueData = res.rows.reduce((acc, row) => {
                    let key = `${row.angle}_${row.speed}`;
                    if (!acc[key]) {
                        acc[key] = [parseFloat(row.percentage.toFixed(2)), row.angle * 30, row.speed];
                    }
                    return acc;
                }, {});
                let processedData = Object.values(uniqueData);
                //console.log(processedData);
                //let res = await getRose(data);
                //let processedData = res.rows.map(row => [
                   // parseFloat(row.percentage.toFixed(2)),
                   // row.angle*30,
                   // row.speed
               // ]);
                //console.log(processedData)

                // 获取图表容器
                var chartDom = document.getElementById('windRoseChart');
                // 初始化图表
                var myChart = echarts.init(chartDom);

                // 配置项
                var option = {
                    title: {
                        text: '',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        },
                        left: 'center',
                        top: '15'
                    },
                    angleAxis: {
                        type: 'value',
                        data: ['E', 'S', 'W', 'N'],
                        startAngle: 30,
                        min: 0,
                        max: 360,
                        interval: 30,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            formatter: function (value) {
                                if (value === 30) {
                                    return 'E';
                                } else if (value === 120) {
                                    return 'S';
                                } else if (value === 210) {
                                    return 'W';
                                } else if (value === 300) {
                                    return 'N';
                                }
                                // 其他数值保持默认格式
                            },
                            color: '#000'
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#AFAFAF'
                            }
                        }
                    },
                    radiusAxis: {
                        min: 0,
                        max: 15,
                        interval: 5,
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: function (value) {
                                // 其他数值保持默认格式
                                return value + '%';
                            },
                            color: '#000'
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#AFAFAF'
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    },
                    polar: {
                        radius: ['2%', '80%']
                    },
                    series: [
                        {
                            type: 'bar',
                            colorBy: 'data',
                            itemStyle: {
                                borderColor: '#1C724F',
                                borderWidth: 1,
                                borderType: 'solid'
                            },
                            data: processedData,
                            coordinateSystem: 'polar',
                            emphasis: {
                                focus: 'series'
                            }
                        }
                    ],
                    visualMap: {
                        min: 0,
                        max: 14,
                        itemWidth: 20,
                        itemHeight: 360,
                        text: [14, 0],
                        textGap: 2,
                        inRange: {
                            color: ['#018066', '#FEFF66']
                        },
                        orient: 'vertical',
                        right: '20',
                        top: 'center'
                    }
                };
                // 设置配置项
                myChart.setOption(option);
            },
            dataShow() {
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = false;
                if (this.indexSelection.value) {
                    let selectType = this.indexSelection.value[0];
                    if (selectType == "观测") {
                        this.graghType = "one";
                    } else if (selectType == "计算") {
                        this.graghType = "one";
                    } else if (selectType == "统计") {
                        this.graghType = "six";
                    }
                }
            },
            indexChanged() {
                this.indexType = ''
                this.graghType = "";
                this.indexSelectionValue = null
                if (this.SelectIndex) {
                    if (this.SelectIndex == "观测") {
                        // this.props = {multiple: true}
                        // indexSelectionOptions = [{
                        //     value: "观测",
                        //     label: "观测指标",
                        //     children: [
                        //         {
                        //             value: "空气",
                        //             label: "空气指标",
                        //             children: [
                        //                 {
                        //                     value: "风速",
                        //                     label: "风速",
                        //                 },
                        //                 {
                        //                     value: "风向",
                        //                     label: "风向",
                        //                 },
                        //                 {
                        //                     value: "气温",
                        //                     label: "气温",
                        //                 },
                        //                 {
                        //                     value: "气压",
                        //                     label: "气压",
                        //                 },
                        //                 {
                        //                     value: "U轴风速",
                        //                     label: "U轴风速",
                        //                 },
                        //                 {
                        //                     value: "V轴风速",
                        //                     label: "V轴风速",
                        //                 },
                        //                 {
                        //                     value: "W轴风速",
                        //                     label: "W轴风速",
                        //                 },
                        //                 {
                        //                     value: "空气CO2浓度",
                        //                     label: "空气CO2浓度",
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             value: "水质",
                        //             label: "水质指标",
                        //             children: [
                        //                 {
                        //                     value: "海水CO2分压",
                        //                     label: "海水CO2分压",
                        //                 },
                        //                 {
                        //                     value: "水温",
                        //                     label: "水温",
                        //                 },
                        //                 {
                        //                     value: "盐度",
                        //                     label: "盐度",
                        //                 },
                        //                 {
                        //                     value: "叶绿素",
                        //                     label: "叶绿素",
                        //                 },
                        //                 {
                        //                     value: "溶解氧",
                        //                     label: "溶解氧",
                        //                 },
                        //                 {
                        //                     value: "PH",
                        //                     label: "PH",
                        //                 },
                        //             ],
                        //         },
                        //     ],
                        // }]
                        // this.indexSelection.options = indexSelectionOptions
                        this.indexType = '观测'
                    } else if (this.SelectIndex =="计算") {
                        // this.props = {multiple: true}
                        // indexSelectionOptions = [{
                        //     value: "计算",
                        //     label: "计算指标",
                        //     children: [
                        //         {
                        //             value: "涡度相关法",
                        //             label: "涡度相关法",
                        //         },
                        //         {
                        //             value: "分压差法",
                        //             label: "分压差法",
                        //         },
                        //     ],
                        // }]
                        // this.indexSelection.options = indexSelectionOptions
                        this.indexType = '计算'
                    } else if (this.SelectIndex =="统计") {
                        // this.props = {multiple: false}
                        // indexSelectionOptions = [{
                        //     value: "统计",
                        //     label: "统计指标",
                        //     children: [
                        //         {
                        //             value: "涡度相关法",
                        //             label: "涡度相关法",
                        //         },
                        //         {
                        //             value: "分压差法",
                        //             label: "分压差法",
                        //         },
                        //     ],
                        // },]
                        // this.indexSelection.options = indexSelectionOptions
                        this.indexType = '统计'
                    }
                }
            },
            async ObservationIndexChange2() {
                // 获取当前选项的缓存数据，如果存在则直接使用缓存数据
                //this.indexSelectionValue
                // 如果缓存中没有数据，则重新请求ObservationIndexChange()加载数据
                const newData = await this.ObservationIndexChange();
                // 将新加载的数据存入缓存
                this.cachedData[this.indexSelectionValue] = newData;
                // 更新界面显示
                this.chartArray = newData.chartArray;
            },
            // 观测指标 指标项发生变化
            async ObservationIndexChange() {


                const currentTime = new Date();
               // console.log("当前时间：", currentTime);
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = false;
                this.graghType = "";
                this.averageVal = 0;
                this.chartData = [];
                this.QCchartData=[];
                this.timeData = [];
                this.QCtimeData = [];
                this.chartArray = []
                this.unit = "";
                this.title = "";
                this.text = "";
                this.QCtext = "";
                await this.$router.push({
                    path: "/carbonflux",
                    query: {
                      deviceId: this.selectedID,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                });
                this.loading = true;
                // 空气指标
                if (! this.indexSelectionValue){
                    alert("请选择对应指标");
                    return null;
                }
                if (this.indexSelectionValue.indexOf('风速') !==-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "WISP_AIRMAR",
                    };
                    let data2 = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "WISP_AIRMAR",
                        isFiltered: true,
                    };
                    await getCommonValue(data2).then((res) => {
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        this.QCaverageVal = 0;
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        }
                        this.lagtime=res.lagTime/1000;
                        this.deletionRate=res.deletionRate;
                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控风速：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前质控风速：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(m/s)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%"+"时间偏差"+this.lagtime +"秒";
                    });
                    this.title = "风速（wind speed）";
                    this.unit = "m/s";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均风速：" +
                            Number(this.averageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前风速：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(m/s)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '风速',
                    }

                    //console.log(temp);
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('风向') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "WIDI_AIRMAR",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "WIDI_AIRMAR",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        this.QCaverageVal = 0;
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        }
                        this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;
                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控风向：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(°)\t\t\t\t当前质控风向：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(°)\t\t\t\t数据损失率：" +
                        this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.title = "风向（raw wind direction）";
                    this.unit = "°";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均风向：" +
                            Number(this.averageVal).toFixed(2) +
                            "(°)\t\t\t\t当前风向：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(°)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '风向',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('气温') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "TEMP_AIRMAR",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "TEMP_AIRMAR",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        }
                        this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;
                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控气温：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(℃)\t\t\t\t当前质控气温：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(℃)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.title = "气温（raw air temperature）";
                    this.unit = "℃";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均气温：" +
                            Number(this.averageVal).toFixed(2) +
                            "(℃)\t\t\t\t当前气温：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(℃)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '气温',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('气压') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "PRES_AIRMAR",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "PRES_AIRMAR",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        }
                        this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控气压：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(10^2Pa)\t\t\t\t当前质控气压：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(10^2Pa)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.title = "气压（raw pressure）";
                    this.unit = "10^2Pa";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均气压：" +
                            Number(this.averageVal).toFixed(2) +
                            "(10^2Pa)\t\t\t\t当前气压：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(10^2Pa)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '气压',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('U轴风速') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_U",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_U",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控U轴风速：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前质控U轴风速：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(m/s)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "m/s";
                    this.title = "U轴风速（raw U-axis wind speed）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均U轴风速：" +
                            Number(this.averageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前U轴风速：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(m/s)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: 'U轴风速',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('V轴风速') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_V",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_V",
                        isFiltered: true,
                    };

                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控V轴风速：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前质控V轴风速：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(m/s)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "m/s";
                    this.title = "V轴风速（raw V-axis wind speed）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均V轴风速：" +
                            Number(this.averageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前V轴风速：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(m/s)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: 'V轴风速',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('W轴风速') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_W",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Wind_speed_W",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控W轴风速：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前质控W轴风速：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(m/s)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "m/s";
                    this.title = "W轴风速（raw W-axis wind speed）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均W轴风速：" +
                            Number(this.averageVal).toFixed(2) +
                            "(m/s)\t\t\t\t当前W轴风速：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(m/s)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: 'W轴风速',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('空气CO2浓度') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "CO2_Air",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "CO2_Air",
                        isFiltered: true,
                    };

                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控空气CO2浓度：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μmol/mol)\t\t\t\t当前质控空气CO2浓度：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(μmol/mol)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "μmol/mol";
                    this.title = "空气CO2浓度（raw air CO2 concentration）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均空气CO2浓度：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μmol/mol)\t\t\t\t当前空气CO2浓度：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol/mol)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '空气CO2浓度',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('湿度') != -1) {
                let data = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "Humidity",
                };
                let dataa = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "Humidity",
                    isFiltered: true,
                };

                await getCommonValue(dataa).then((res) => {
                    this.QCaverageVal = 0;
                    this.QCchartData = [];
                    this.QCtimeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.QCchartData.push(temp2);
                        this.QCtimeData.push(temp);
                        this.QCaverageVal += temp2;
                    } this.lagtime = res.lagTime / 1000;
                    this.deletionRate = res.deletionRate;

                    this.QCaverageVal /= this.QCchartData.length;
                    this.QCtext =
                        "平均质控湿度：" +
                        Number(this.QCaverageVal).toFixed(2) +
                        "(mbar)\t\t\t\t当前质控湿度：" +
                        (this.QCchartData[this.QCchartData.length - 1]
                            ? Number(
                                this.QCchartData[this.QCchartData.length - 1]
                            ).toFixed(2)
                            : "暂无") +
                        "(mbar)\t\t\t\t数据损失率：" +
                        this.deletionRate +
                        "%" + "时间偏差" + this.lagtime + "秒";

                });
                this.unit = "mbar";
                this.title = "湿度（humidity）";
                await getCommonValue(data).then((res) => {
                    this.averageVal = 0;
                    this.chartData = [];
                    this.timeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.chartData.push(temp2);
                        this.timeData.push(temp);
                        this.averageVal += temp2;
                    }
                    this.averageVal /= this.chartData.length;
                    this.text =
                        "平均湿度：" +
                        Number(this.averageVal).toFixed(2) +
                        "(mbar)\t\t\t\t当前湿度：" +
                        (this.chartData[this.chartData.length - 1]
                            ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                            : "暂无") +
                        "(mbar)";
                });
                let temp = {
                    chartData: this.chartData,
                    timeData: this.timeData,
                    text: this.text,
                    unit: this.unit,
                    title: this.title,
                    QCchartData: this.QCchartData, // 待修改
                    QCtimeData: this.QCtimeData,  // 待修改
                    QCtext: this.QCtext, //待修改
                    str: '湿度',
                }
                this.chartArray.push(temp)
            }

                if (this.indexSelectionValue.indexOf('海水CO2分压') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Gas_pressure",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Gas_pressure",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控海水CO2分压：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μatm)\t\t\t\t当前质控海水CO2分压：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(μatm)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "μatm";
                    this.title = "海水CO2分压（raw seawater CO2 partial pressure）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均海水CO2分压：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μatm)\t\t\t\t当前海水CO2分压：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μatm)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '海水CO2分压',
                    }
                    this.chartArray.push(temp)
                }

                if (this.indexSelectionValue.indexOf('海水CO2分压2') != -1) {
                let data = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "Sea_pressure",
                };
                let dataa = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "Sea_pressure",
                    isFiltered: true,
                };
                await getCommonValue(dataa).then((res) => {
                    this.QCaverageVal = 0;
                    this.QCchartData = [];
                    this.QCtimeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.QCchartData.push(temp2);
                        this.QCtimeData.push(temp);
                        this.QCaverageVal += temp2;
                    } this.lagtime = res.lagTime / 1000;
                    this.deletionRate = res.deletionRate;

                    this.QCaverageVal /= this.QCchartData.length;
                    this.QCtext =
                        "平均质控海水CO2分压：" +
                        Number(this.QCaverageVal).toFixed(2) +
                        "(μatm)\t\t\t\t当前质控海水CO2分压：" +
                        (this.QCchartData[this.QCchartData.length - 1]
                            ? Number(
                                this.QCchartData[this.QCchartData.length - 1]
                            ).toFixed(2)
                            : "暂无") +
                        "(μatm)\t\t\t\t数据损失率：" +
                        this.deletionRate +
                        "%" + "时间偏差" + this.lagtime + "秒";

                });
                this.unit = "μatm";
                this.title = "海水CO2分压（raw seawater CO2 partial pressure）";
                await getCommonValue(data).then((res) => {
                    this.averageVal = 0;
                    this.chartData = [];
                    this.timeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.chartData.push(temp2);
                        this.timeData.push(temp);
                        this.averageVal += temp2;
                    }
                    this.averageVal /= this.chartData.length;
                    this.text =
                        "平均海水CO2分压：" +
                        Number(this.averageVal).toFixed(2) +
                        "(μatm)\t\t\t\t当前海水CO2分压：" +
                        (this.chartData[this.chartData.length - 1]
                            ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                            : "暂无") +
                        "(μatm)";
                });
                let temp = {
                    chartData: this.chartData,
                    timeData: this.timeData,
                    text: this.text,
                    unit: this.unit,
                    title: this.title,
                    QCchartData: this.QCchartData, // 待修改
                    QCtimeData: this.QCtimeData,  // 待修改
                    QCtext: this.QCtext, //待修改
                    str: '海水CO2分压',
                }
                this.chartArray.push(temp)
            }

      if (this.indexSelectionValue.indexOf("水温") != -1) {
        let data = {
          deviceId: this.selectedID,
          startTimeStamp: this.startDate,
          endTimeStamp: this.endDate,
          field1: "Sea_temperature",
        };
        let dataa = {
          deviceId: this.selectedID,
          startTimeStamp: this.startDate,
          endTimeStamp: this.endDate,
          field1: "Sea_temperature",
          isFiltered: true,
        };

                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控水温：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(℃)\t\t\t\t当前质控水温：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(℃)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "℃";
                    this.title = "水温（raw water temperature）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均水温：" +
                            Number(this.averageVal).toFixed(2) +
                            "(℃)\t\t\t\t当前水温：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(℃)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '水温',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('盐度') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Salinity",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Salinity",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控盐度：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(‰)\t\t\t\t当前质控盐度：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(‰)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "‰";
                    this.title = "盐度（raw salinity）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均盐度：" +
                            Number(this.averageVal).toFixed(2) +
                            "(‰)\t\t\t\t当前盐度：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(‰)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '盐度',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('叶绿素') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Chlorophyll",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Chlorophyll",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控叶绿素：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μmol/L)\t\t\t\t当前质控叶绿素：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(μmol/L)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "μmol/L";
                    this.title = "叶绿素（raw chlorophyll）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均叶绿素：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μmol/L)\t\t\t\t当前叶绿素：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol/L)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '叶绿素',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('溶解氧') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "DissolvedO2_concentration",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "DissolvedO2_concentration",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控溶解氧：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μmol/l)\t\t\t\t当前质控溶解氧：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "(μmol/l)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "μmol/l";
                    this.title = "溶解氧（raw dissolved oxygen）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均溶解氧：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μmol/l)\t\t\t\t当前溶解氧：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol/l)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '溶解氧',
                    }
                    this.chartArray.push(temp)
                }

                if (this.indexSelectionValue.indexOf('海水CO2浓度') != -1) {
                let data = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "CO2_Sea",
                };
                let dataa = {
                    deviceId: this.selectedID,
                    startTimeStamp: this.startDate,
                    endTimeStamp: this.endDate,
                    field1: "CO2_Sea",
                    isFiltered: true,
                };
                await getCommonValue(dataa).then((res) => {
                    this.QCaverageVal = 0;
                    this.QCchartData = [];
                    this.QCtimeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.QCchartData.push(temp2);
                        this.QCtimeData.push(temp);
                        this.QCaverageVal += temp2;
                    } this.lagtime = res.lagTime / 1000;
                    this.deletionRate = res.deletionRate;

                    this.QCaverageVal /= this.QCchartData.length;
                    this.QCtext =
                        "平均质控海水CO2浓度：" +
                        Number(this.QCaverageVal).toFixed(2) +
                        "(μmol/mol)\t\t\t\t当前质控海水CO2浓度：" +
                        (this.QCchartData[this.QCchartData.length - 1]
                            ? Number(
                                this.QCchartData[this.QCchartData.length - 1]
                            ).toFixed(2)
                            : "暂无") +
                        "(μmol/mol)\t\t\t\t数据损失率：" +
                        this.deletionRate +
                        "%" + "时间偏差" + this.lagtime + "秒";

                });
                this.unit = "μmol/mol";
                this.title = "海水CO2浓度（raw seawater CO2 concentration）";
                await getCommonValue(data).then((res) => {
                    this.averageVal = 0;
                    this.chartData = [];
                    this.timeData = [];
                    for (let item of res.rows) {
                        let temp = item.sendDate;
                        let temp2 = item.y1;
                        this.chartData.push(temp2);
                        this.timeData.push(temp);
                        this.averageVal += temp2;
                    }
                    this.averageVal /= this.chartData.length;
                    this.text =
                        "平均海水CO2浓度：" +
                        Number(this.averageVal).toFixed(2) +
                        "(μmol/mol)\t\t\t\t当前海水CO2浓度：" +
                        (this.chartData[this.chartData.length - 1]
                            ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                            : "暂无") +
                        "(μmol/mol)";
                });
                let temp = {
                    chartData: this.chartData,
                    timeData: this.timeData,
                    text: this.text,
                    unit: this.unit,
                    title: this.title,
                    QCchartData: this.QCchartData,
                    QCtimeData: this.QCtimeData,
                    QCtext: this.QCtext,
                    str: '海水CO2浓度',
                }
                this.chartArray.push(temp)
            }

                if (this.indexSelectionValue.indexOf('pH') !=-1)  {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "PH",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "PH",
                        isFiltered: true,
                    };
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控pH：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "\t\t\t\t当前质控pH：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(
                                    this.QCchartData[this.QCchartData.length - 1]
                                ).toFixed(2)
                                : "暂无") +
                            "\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.unit = "";//(uints)
                    this.title = "pH（raw pH）";
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均pH：" +
                            Number(this.averageVal).toFixed(2) +
                            "\t\t\t\t当前pH：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: 'pH',
                    }
                    this.chartArray.push(temp)
                    this.loading = false;
                }
                //console.log(this.indexSelectionValue)
                this.loading = false;
                return {
                    chartArray: this.chartArray,
                };
            },
            // 计算指标 指标项发生变化
            async CalculationIndexChange() {
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = false;
                // await this.qualityControl();
                this.graghType = "";
                this.averageVal = 0;
                this.chartData = [];
                this.timeData = [];
                this.QCchartData = [];
                this.QCtimeData = [];
                this.chartArray = [];
                this.unit = "";
                this.title = "";
                this.text = "";
                this.QCtext = "";
                await this.$router.push({
                    path: "/carbonflux",
                    query: {
                        deviceId: this.selectedID,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                });
                this.loading = true;
                if (!this.indexSelectionValue) {
                    alert("请选择对应指标");
                    return null;
                }
                if (this.indexSelectionValue.indexOf('涡度相关法') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Vorticity_Correlation",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "Vorticity_Correlation",
                        isFiltered: true,
                    };
                    // this.QCaverageVal = 0;
                    await getCommonValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控CO2通量：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μmol.m-2s-1)\t\t\t\t当前质控CO2通量：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(this.QCchartData[this.QCchartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol.m-2s-1)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.title =
                        "基于涡度相关法的CO2通量计算结果\n（CO2 flux calculation results based on Eddy Covariance)";
                    this.unit = "μmol.m-2s-1";
                    this.averageVal = 0;
                    await getCommonValue(data).then((res) => {
                        this.averageVal = 0;
                        this.timeData = [];
                        this.chartData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均CO2通量：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μmol.m-2s-1)\t\t\t\t当前CO2通量：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol.m-2s-1)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '涡度相关法',
                    }
                    this.chartArray.push(temp)
                }
                if (this.indexSelectionValue.indexOf('分压差法') !=-1) {
                    let data = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "calculate_pressure",
                    };
                    let dataa = {
                        deviceId: this.selectedID,
                        startTimeStamp: this.startDate,
                        endTimeStamp: this.endDate,
                        field1: "calculate_pressure",
                        isFiltered: true,
                    };
                    // this.QCaverageVal = 0;
                    this.QCchartData = [];
                    this.QCtimeData = [];
                    await getDPMValue(dataa).then((res) => {
                        this.QCaverageVal = 0;
                        this.QCchartData = [];
                        this.QCtimeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.QCchartData.push(temp2);
                            this.QCtimeData.push(temp);
                            this.QCaverageVal += temp2;
                        } this.lagtime = res.lagTime / 1000;
                        this.deletionRate = res.deletionRate;

                        this.QCaverageVal /= this.QCchartData.length;
                        this.QCtext =
                            "平均质控CO2通量：" +
                            Number(this.QCaverageVal).toFixed(2) +
                            "(μmol.m-2s-1)\t\t\t\t当前质控CO2通量：" +
                            (this.QCchartData[this.QCchartData.length - 1]
                                ? Number(this.QCchartData[this.QCchartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol.m-2s-1)\t\t\t\t数据损失率：" +
                            this.deletionRate +
                            "%" + "时间偏差" + this.lagtime + "秒";

                    });
                    this.title =
                        "基于分压差法的CO2通量计算结果\n（CO2 flux calculation results based on Partial Pressure Difference)";
                    this.unit = "μmol.m-2s-1";
                    this.averageVal = 0;
                    await getDPMValue(data).then((res) => {
                        this.averageVal = 0;
                        this.chartData = [];
                        this.timeData = [];
                        for (let item of res.rows) {
                            let temp = item.sendDate;
                            let temp2 = item.y1;
                            this.chartData.push(temp2);
                            this.timeData.push(temp);
                            this.averageVal += temp2;
                        }
                        this.averageVal /= this.chartData.length;
                        this.text =
                            "平均CO2通量：" +
                            Number(this.averageVal).toFixed(2) +
                            "(μmol.m-2s-1)\t\t\t\t当前CO2通量：" +
                            (this.chartData[this.chartData.length - 1]
                                ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                : "暂无") +
                            "(μmol.m-2s-1)";
                    });
                    let temp = {
                        chartData: this.chartData,
                        timeData: this.timeData,
                        text: this.text,
                        unit: this.unit,
                        title: this.title,
                        QCchartData: this.QCchartData, // 待修改
                        QCtimeData: this.QCtimeData,  // 待修改
                        QCtext: this.QCtext, //待修改
                        str: '分压差法',
                    }
                    this.chartArray.push(temp)
                }
                this.loading = false;
            },
            // 统计指标 指标项发生变化
            async StatisticalIndexChange() {
                this.graghType = "";
                this.SixchartData = [];
                this.SixtimeData = [];
                this.title = ""
                await this.$router.push({
                    path: "/carbonflux",
                    query: {
                        deviceId: this.selectedID,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                });
                if (!this.indexSelectionValue) {
                    alert("请选择对应指标");
                    return null;
                }
                if (this.indexSelectionValue == "涡度相关法") {
                    let index_data = [
                        [1, 1],
                        [1, 2],
                        [2, 1],
                        [2, 2],
                        [4, 1],
                        [3, 1],
                    ];
                    this.loading = true;
                    for (let i = 0; i < index_data.length; i++) {
                        let item = index_data[i];
                        let data = {
                            deviceId: this.selectedID,
                            startTimeStamp: this.startDate,
                            endTimeStamp: this.endDate,
                            field1: "Vorticity_Correlation",
                            isStatistics: true,
                            statisticalRange: item[0],
                            statisticalMethod: item[1],
                        };
                        await getCommonValue(data).then((res) => {
                            let chartData = [];
                            let timeData = [];
                            for (let item of res.rows) {
                                let temp = item.sendDate;
                                let temp2 = item.y1;
                                chartData.push(temp2);
                                timeData.push(temp);
                            }
                            // this.SixchartData[i] = chartData;
                            // this.SixtimeData[i] = timeData;
                            this.SixchartData.push(chartData);
                            this.SixtimeData.push(timeData);
                            this.title =
                                "基于涡度相关法的CO2通量统计结果\n（CO2 flux statistical results based on Eddy Covariance）";
                            this.unit = "μmol.m-2s-1";
                            this.Sixtext = [
                                "白天平均通量(μmol/m²/s)",
                                "夜间平均通量(μmol/m²/s)",
                                "全天平均通量(μmol/m²/s)",
                                "白天最强通量(μmol/m²/s)",
                                "夜间最强通量(μmol/m²/s)",
                                "昼夜平均通量(μmol/m²/s)",
                            ];
                        });
                    }
                    this.loading = false;
                }
                else if (this.indexSelectionValue == "分压差法") {
                    let index_data = [
                        [1, 1],
                        [1, 2],
                        [2, 1],
                        [2, 2],
                        [4, 1],
                        [3, 1],
                    ];
                    this.loading = true;
                    for (let i = 0; i < index_data.length; i++) {
                        let item = index_data[i];
                        let data = {
                            deviceId: this.selectedID,
                            startTimeStamp: this.startDate,
                            endTimeStamp: this.endDate,
                            field1: "calculate_pressure",
                            isStatistics: true,
                            statisticalRange: item[0],
                            statisticalMethod: item[1],
                        };
                        await getDPMValue(data).then((res) => {
                            let chartData = [];
                            let timeData = [];
                            for (let item of res.rows) {
                                let temp = item.sendDate;
                                let temp2 = item.y1;
                                chartData.push(temp2);
                                timeData.push(temp);
                            }
                            // this.SixchartData[i] = chartData;
                            // this.SixtimeData[i] = timeData;
                            this.SixchartData.push(chartData);
                            this.SixtimeData.push(timeData);
                            this.title =
                                "基于分压差法的CO2通量统计结果\n（CO2 flux statistical results based on Partial Pressure Difference）";
                            this.unit = "μmol.m-2s-1";
                            this.Sixtext = [
                                "白天平均通量",
                                "夜间平均通量",
                                "全天平均通量",
                                "白天最强通量",
                                "夜间最强通量",
                                "平均昼夜通量",
                            ];
                        });
                    }
                    this.loading = false;
                }
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = false;
                this.graghType = "six"
            },

            async indexChangeHandler() {
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = false;
                this.averageVal = 0;
                this.chartData = [];
                this.timeData = [];
                this.unit = "";
                this.title = "";
                this.text = "";
                this.SixchartData = [];
                this.SixtimeData = [];
                await this.$router.push({
                    path: "/carbonflux",
                    query: {
                        deviceId: this.selectedID,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                });
                if (
                    this.$route.query.deviceId &&
                    this.$route.query.startDate &&
                    this.$route.query.endDate
                ) {
                    this.noteIsShow = false;
                } else {
                    this.noteIsShow = true;
                }
                // await this.qualityControl();
                // this.chartData = [20, 290, 180, 290];
                // this.timeData = ["2023-08-20", "2023-08-21", "2023-08-22", "2023-08-23"];
                if (this.indexSelection.value) {
                    if (this.indexSelection.value[0] == "观测") {
                        // 空气指标
                        if (this.indexSelection.value[2] == "风速") {
                            this.loading = true;
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "WISP_AIRMAR",
                            };
                            this.title = "风速（wind speed）";
                            this.unit = "m/s";
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均风速：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(m/s)\t\t\t\t当前风速：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(m/s)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "风向") {
                            this.loading = true;
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "WIDI_AIRMAR",
                            };
                            this.title = "风向（raw wind direction）";
                            this.unit = "°";
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均风向：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(°)\t\t\t\t当前风向：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(°)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "气温") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "TEMP_AIRMAR",
                            };
                            this.title = "气温（raw air temperature）";
                            this.unit = "℃";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均质控气温：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(℃)\t\t\t\t当前质控气温：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(℃)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "气压") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "PRES_AIRMAR",
                            };
                            this.title = "气压（raw pressure）";
                            this.unit = "10^2Pa";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均气压：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(10^2Pa)\t\t\t\t当前气压：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(10^2Pa)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "U轴风速") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Wind_speed_U",
                            };
                            this.unit = "m/s";
                            this.title = "U轴风速（raw U-axis wind speed）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均U轴风速：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(m/s)\t\t\t\t当前U轴风速：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(m/s)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "V轴风速") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Wind_speed_V",
                            };
                            this.unit = "m/s";
                            this.title = "原始V轴风速（raw V-axis wind speed）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均V轴风速：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(m/s)\t\t\t\t当前V轴风速：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(m/s)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "W轴风速") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Wind_speed_W",
                            };
                            this.unit = "m/s";
                            this.title = "原始W轴风速（raw W-axis wind speed）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均W轴风速：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(m/s)\t\t\t\t当前W轴风速：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(m/s)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "空气CO2浓度") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "CO2_Air",
                            };
                            this.unit = "μmol/mol";
                            this.title = "原始空气CO2浓度（raw air CO2 concentration）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均空气CO2浓度：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(μmol/mol)\t\t\t\t当前空气CO2浓度：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(μmol/mol)";
                            });
                            this.loading = false;
                        }
                        // 水质指标
                        if (this.indexSelection.value[2] == "海水CO2分压") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Gas_pressure",
                            };
                            this.unit = "mbar";
                            this.title = "原始海水CO2分压（raw seawater CO2 partial pressure）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均海水CO2分压：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(mbar)\t\t\t\t当前海水CO2分压：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(mbar)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "海水CO2分压千帕") {
                        let data = {
                            deviceId: this.selectedID,
                            startTimeStamp: this.startDate,
                            endTimeStamp: this.endDate,
                            field1: "Sea_pressure",
                        };
                        this.unit = "mbar";
                        this.title = "原始海水CO2分压（raw seawater CO2 partial pressure）";
                        this.loading = true;
                        await getCommonValue(data).then((res) => {
                            this.averageVal = 0;
                            this.chartData = [];
                            for (let item of res.rows) {
                                let temp = item.sendDate;
                                let temp2 = item.y1;
                                this.chartData.push(temp2);
                                this.timeData.push(temp);
                                this.averageVal += temp2;
                            }
                            this.averageVal /= this.chartData.length;
                            this.text =
                                "平均海水CO2分压：" +
                                Number(this.averageVal).toFixed(2) +
                                "(mbar)\t\t\t\t当前海水CO2分压：" +
                                (this.chartData[this.chartData.length - 1]
                                    ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                    : "暂无") +
                                "(mbar)";
                        });
                        this.loading = false;
                    }
                        if (this.indexSelection.value[2] == "水温") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Sea_temperature",
                            };
                            this.unit = "℃";
                            this.title = "原始水温（raw water temperature）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均水温：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(℃)\t\t\t\t当前水温：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(℃)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "盐度") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Salinity",
                            };
                            this.unit = "PSU";
                            this.title = "原始盐度（raw salinity）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均盐度：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(PSU)\t\t\t\t当前盐度：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(PSU)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "叶绿素") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Chlorophyll",
                            };
                            this.unit = "μmol/L";
                            this.title = "原始叶绿素（raw chlorophyll）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均叶绿素：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(μmol/L)\t\t\t\t当前叶绿素：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(μmol/L)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "溶解氧") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "DissolvedO2_concentration",
                            };
                            this.unit = "μmol/l";
                            this.title = "原始溶解氧（raw dissolved oxygen）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均溶解氧：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(μmol/l)\t\t\t\t当前溶解氧：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(μmol/l)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[2] == "pH") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "pH",
                            };
                            this.unit = "uints";
                            this.title = "原始pH（raw pH）";
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均pH：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(uints)\t\t\t\t当前pH：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(uints)";
                            });
                            this.loading = false;
                        }
                    }
                    if (this.indexSelection.value[0] == "计算") {
                        if (this.indexSelection.value[1] == "涡度相关法") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "Vorticity_Correlation",
                            };
                            this.title =
                                "基于涡度相关法的CO2通量计算结果\n（CO2 flux calculation results based on Eddy Covariance)";
                            this.unit = "μmol.m-2s-1";
                            this.averageVal = 0;
                            this.chartData = [];
                            this.timeData = [];
                            this.loading = true;
                            await getCommonValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均CO2通量：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(μmol.m-2s-1)\t\t\t\t当前CO2通量：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(μmol.m-2s-1)";
                            });
                            this.loading = false;
                        }
                        if (this.indexSelection.value[1] == "分压差法") {
                            let data = {
                                deviceId: this.selectedID,
                                startTimeStamp: this.startDate,
                                endTimeStamp: this.endDate,
                                field1: "calculate_pressure",
                            };
                            this.title =
                                "基于分压差法的CO2通量计算结果\n（CO2 flux calculation results based on Partial Pressure Difference)";
                            this.unit = "μmol.m-2s-1";
                            this.averageVal = 0;
                            this.chartData = [];
                            this.timeData = [];
                            this.loading = true;
                            await getDPMValue(data).then((res) => {
                                this.averageVal = 0;
                                this.chartData = [];
                                for (let item of res.rows) {
                                    let temp = item.sendDate;
                                    let temp2 = item.y1;
                                    this.chartData.push(temp2);
                                    this.timeData.push(temp);
                                    this.averageVal += temp2;
                                }
                                this.averageVal /= this.chartData.length;
                                this.text =
                                    "平均CO2通量：" +
                                    Number(this.averageVal).toFixed(2) +
                                    "(μmol.m-2s-1)\t\t\t\t当前CO2通量：" +
                                    (this.chartData[this.chartData.length - 1]
                                        ? Number(this.chartData[this.chartData.length - 1]).toFixed(2)
                                        : "暂无") +
                                    "(μmol.m-2s-1)";
                            });
                            this.loading = false;
                        }
                    }
                    if (this.indexSelection.value[0] == "统计") {
                        this.graghType = "";
                        if (this.indexSelection.value[1] == "涡度相关法") {
                            let index_data = [
                                [1, 1],
                                [1, 2],
                                [2, 1],
                                [2, 2],
                                [4, 1],
                                [3, 1],
                            ];
                            this.loading = true;
                            for (let i = 0; i < index_data.length; i++) {
                                let item = index_data[i];
                                let data = {
                                    deviceId: this.selectedID,
                                    startTimeStamp: this.startDate,
                                    endTimeStamp: this.endDate,
                                    field1: "Vorticity_Correlation",
                                    isStatistics: true,
                                    statisticalRange: item[0],
                                    statisticalMethod: item[1],
                                };
                                await getCommonValue(data).then((res) => {
                                    let chartData = [];
                                    let timeData = [];
                                    for (let item of res.rows) {
                                        let temp = item.sendDate;
                                        let temp2 = item.y1;
                                        chartData.push(temp2);
                                        timeData.push(temp);
                                    }
                                    // this.SixchartData[i] = chartData;
                                    // this.SixtimeData[i] = timeData;
                                    this.SixchartData.push(chartData);
                                    this.SixtimeData.push(timeData);
                                    this.title =
                                        "基于涡度相关法的CO2通量统计结果\n（CO2 flux statistical results based on Eddy Covariance）";
                                    this.unit = "μmol.m-2s-1";
                                    this.Sixtext = [
                                        "白天平均通量",
                                        "夜间平均通量",
                                        "全天平均通量",
                                        "白天最强通量",
                                        "夜间最强通量",
                                        "平均昼夜通量",
                                    ];
                                });
                            }
                            this.loading = false;
                        }
                        if (this.indexSelection.value[1] == "分压差法") {
                            let index_data = [
                                [1, 1],
                                [1, 2],
                                [2, 1],
                                [2, 2],
                                [4, 1],
                                [3, 1],
                            ];
                            this.loading = true;
                            for (let i = 0; i < index_data.length; i++) {
                                let item = index_data[i];
                                let data = {
                                    deviceId: this.selectedID,
                                    startTimeStamp: this.startDate,
                                    endTimeStamp: this.endDate,
                                    field1: "calculate_pressure",
                                    isStatistics: true,
                                    statisticalRange: item[0],
                                    statisticalMethod: item[1],
                                };
                                await getDPMValue(data).then((res) => {
                                    let chartData = [];
                                    let timeData = [];
                                    for (let item of res.rows) {
                                        let temp = item.sendDate;
                                        let temp2 = item.y1;
                                        chartData.push(temp2);
                                        timeData.push(temp);
                                    }
                                    // this.SixchartData[i] = chartData;
                                    // this.SixtimeData[i] = timeData;
                                    this.SixchartData.push(chartData);
                                    this.SixtimeData.push(timeData);
                                    this.title =
                                        "基于分压差法的CO2通量统计结果\n（CO2 flux statistical results based on Partial Pressure Difference）";
                                    this.unit = "μmol.m-2s-1";
                                    this.Sixtext = [
                                        "白天平均通量",
                                        "夜间平均通量",
                                        "全天平均通量",
                                        "白天最强通量",
                                        "夜间最强通量",
                                        "平均昼夜通量",
                                    ];
                                });
                            }
                            this.loading = false;
                        }
                    }
                    this.dataShow();
                    // let selectType=this.indexSelection.value[0];
                    // if(selectType=='观测'||selectType=='计算'){
                    //   if(this.graghType!='two'){
                    //     this.dataShow();
                    //   }else{
                    //     this.qualityControl();
                    //   }
                    // }else if(selectType=='统计'){
                    //   this.dataShow();
                    // }
                }
            },
            downloadExcel() {
                this.$confirm("是否确认导出设备详情数据？", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.downloading = true;
                        return detailExcel(this.selectedID, this.startDate, this.endDate);
                    })
                    .then((res) => {
                        this.download(
                            res.data.url,
                            {
                                ...this.queryParams,
                            },
                            res.data.name
                        );
                        this.downloading = false;
                    })
                    .catch(() => {
                        this.downloading = false;
                    });
            },
            idChanged() {//shebei
            this.chartArray = [];
            // this.graghType = "";
            this.indexSelectionValue = null
                this.$router.push({
                    path: "/carbonflux",
                    query: {
                        deviceId: this.selectedID,
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                });
                // this.$router.go(0);
                this.keyCounter++;
            },
            Calculationprincipl() {
                if (this.indexSelection.value[1] == "涡度相关法") {
                    this.VCMpriIsShow = true;
                }
                if (this.indexSelection.value[1] == "分压差法") {
                    this.DPMpriIsShow = true;
                }
            },
            Calculationprincipl1() {
                this.VCMpriIsShow = true;
                this.DPMpriIsShow = false;
                this.chartArray=[];
            },
            Calculationprincipl2() {
                this.VCMpriIsShow = false;
                this.DPMpriIsShow = true;
                this.chartArray = [];

            },
            timeFn() {
                //获取时间
                setInterval(() => {
                    this.dateDay = this.formatTimes(new Date(), "HH: mm: ss");
                    this.dateYear = this.formatTimes(new Date(), "yyyy-MM-dd");
                    this.dateWeek = this.weekday[new Date().getDay()];
                }, 1000);
            },
            formatTimes(time, fmt) {
                if (!time) return "";
                else {
                    const date = new Date(time);
                    const o = {
                        "M+": date.getMonth() + 1,
                        "d+": date.getDate(),
                        "H+": date.getHours(),
                        "m+": date.getMinutes(),
                        "s+": date.getSeconds(),
                        "q+": Math.floor((date.getMonth() + 3) / 3),
                        S: date.getMilliseconds(),
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(
                            RegExp.$1,
                            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
                        );
                    for (const k in o) {
                        if (new RegExp("(" + k + ")").test(fmt)) {
                            fmt = fmt.replace(
                                RegExp.$1,
                                RegExp.$1.length === 1
                                    ? o[k]
                                    : ("00" + o[k]).substr(("" + o[k]).length)
                            );
                        }
                    }
                    return fmt;
                }
            },
        },
    };
</script>
<style scoped>
.v-modal {
    display: none !important;
}
.top-back {
  background-color: #1e1f26;
  position: absolute;
  width: 100%;
  height: 83px;
  box-shadow: 0px 3px 5px #000000;
}

#main >>> .el-input__inner {
  background-color: rgba(0, 3, 48, 0);
  color: #ffffff;
}

#main >>> .el-breadcrumb {
  display: none;
}

#main >>> .hamburger {
  fill: rgb(255, 255, 255);
}

.topTitleBox >>> .el-button.is-loading:before {
  background-color: rgb(255 255 255);
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0; /*设置不透明度*/
    text-shadow: 0px 0px 4px #ffffff;
  }

  50% {
    opacity: 0.6;
    text-shadow: 0 0 10px #ffffff;
  }

  100% {
    opacity: 0;
    text-shadow: 0 0 4px #ffffff;
  }
}

.note-message {
  font-size: 4.5em;
  color: #06f1ef;
  position: absolute;
  margin: 0px;
  border: 0px;
  padding: 0px;
  letter-spacing: 0.3em;
  left: calc((100% - 11.5em) / 2);
  top: calc((100% - 1.5em) / 2);
  animation: fadeInAnimation 3s infinite ease-in;
  z-index: 1;
}
</style>
<style scoped>
.custom-spacing {
  margin-right: 40px;
  /* Adjust the margin value as needed */
  display: inline-block;
  /* Ensures the div takes up space and doesn't collapse */
}
</style>
<style scoped lang="scss">
.page-title {
  color: rgb(46, 117, 182);
  text-align: center;
  margin-top: 10px;
  font-size: 24px;
  text-shadow: 0 0 3px rgb(15, 47, 106), 0 0 5px rgb(15, 47, 106),
    0 0 10px rgb(15, 47, 106), 0 0 15px rgb(15, 47, 106);
  .en {
    font-size: 16px;
  }
}
#main {
  position: fixed;
  width: 100%;
  height: 100%;
  // min-width: 1850px;
  // background: url("~@/assets/bg2.jpg") no-repeat;
  background-color: #131417;
  background-size: 100% 100%;
  // overflow: hidden;

  .topTitleBox {
    width: 100%;
    height: 80px;
    display: flex;
    position: relative;

    .leftDecorate {
      position: absolute;
      left: 7%;
      top: 32px;
    }

    .dateTimeBox {
      display: inline-block;
      position: absolute;
      right: 3%;
      top: 28px;
      color: #797979;
      font-size: 16px;
      // background-color: rgb(15, 19, 37);
      width: 30%;
      height: 30px;
      text-align: right;
      line-height: 30px;
      cursor: pointer;

        .dateText {
          display: inline-block;
        }
      }
    }

    .content {
      width: 100%;
      height: 100%;
      padding-top: 20px;
    }
  }
.el-dialog__body {
    height: 800px;
}
.page {
  position: absolute;
  left: 30px;
  top: 150px;
  right: 25px;
  bottom: 25px;
  // background-color: #01066A;
  max-height: 4000px; /* 根据需要调整高度 */
  max-weight: 3000px; /* 根据需要调整高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

.list {
  float: left;
  height: 49%;
  width: 32.6%;
  margin: 0.3%;
  position: relative;
  background-color: #1d1e22;
  // border:2px solid #2C303A;
  border-top: 2px solid #2c303a;
  box-shadow: 0px 2px 3px 0px #000000;
  border-radius: 12px;
  // box-shadow:0px 0px 5px #000000;
}

.list:before {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
}

.list:after {
  content: attr(data-index);
  position: absolute;
  height: 30px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  font: 24px/30px bold "microsoft yahei";
}
.query {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 10px;
  // top: 30px;
  // left: 45px;
}

.excel {
  display: inline;
  font-weight: normal;
  font-size: 16px;
  color: #06f1ef;
  margin-left: 30px;
  // top: 30px;
  // left: 45px;
}

.navbar {
  position: absolute;
  width: calc(100%);
}
</style>
