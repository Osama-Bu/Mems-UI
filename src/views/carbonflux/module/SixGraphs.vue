<template>
  <div style="overflow: hidden; height: 100%">
    <div v-for="(color, index) in value2" class="color-box" :key="index">
      <OneGraph
        :str="color.str"
        :chartData="color.chartData"
        :timeData="color.timeData"
        :title="color.title"
        :unit="color.unit"
        :text="color.text"
        :echarts-id="'Echarts' + index"
        style="height: 100%"
      ></OneGraph>
    </div>
  </div>
</template>

<script>
    import OneGraph from "./OneGraph";
    import { Navbar } from "@/layout/components";

    export default {
        name: "SixGraphs",
        components: {
            OneGraph,
            Navbar,
        },
        data() {
            return {
                value2: [],
                //搜索字段
                keyCounter: 1,
                selectedID: null,
                options: [
                    {
                        value: "1",
                    },
                    {
                        value: "2",
                    },
                    {
                        value: "3",
                    },
                    {
                        value: "4",
                    },
                    {
                        value: "5",
                    },
                ],
            };
        },
        props: {
            str: {
                type: String,
                default: "",
            },
            SixchartData: {
                type: Array,
                default: () => [[]], // 默认值是一个空数组包含一个空数组
            },
            SixtimeData: {
                type: Array,
                default: () => [[]], // 默认值是一个空数组包含一个空数组
            },
            Sixtext: {
                type: Array,
                required: true,
            },
            title: "",
            unit: undefined,
        },
        mounted() {
            // // console.log(this.SixtimeData[0])
            this.value2 = [
                {
                    str: this.str,
                    chartData: this.SixchartData[0],
                    timeData: this.SixtimeData[0],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[0],
                },
                {
                    str: this.str,
                    chartData: this.SixchartData[1],
                    timeData: this.SixtimeData[1],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[1],
                },
                {
                    str: this.str,
                    chartData: this.SixchartData[2],
                    timeData: this.SixtimeData[2],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[2],
                },
                {
                    str: this.str,
                    chartData: this.SixchartData[3],
                    timeData: this.SixtimeData[3],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[3],
                },
                {
                    str: this.str,
                    chartData: this.SixchartData[4],
                    timeData: this.SixtimeData[4],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[4],
                },
                {
                    str: this.str,
                    chartData: this.SixchartData[5],
                    timeData: this.SixtimeData[5],
                    title: this.title,
                    unit: this.unit,
                    text: this.Sixtext[5],
                },
            ];
        },
        // methods: {
        //     initData() {
        //         // console.log("static_data in SixGraphs component:", this.SixchartData);
        //         // console.log("static_data in SixGraphs component:", this.SixtimeData);
        //         this.value2 = [
        //             {
        //                 str: this.str,
        //                 chartData: this.SixchartData[0],
        //                 timeData: this.SixtimeData[0],
        //             },
        //             {
        //                 str: this.str,
        //                 chartData: this.SixchartData[1],
        //                 timeData: this.SixtimeData[1],
        //             },{
        //                 str: this.str,
        //                 chartData: this.SixchartData[2],
        //                 timeData: this.SixtimeData[2],
        //             },{
        //                 str: this.str,
        //                 chartData: this.SixchartData[3],
        //                 timeData: this.SixtimeData[3],
        //             },{
        //                 str: this.str,
        //                 chartData: this.SixchartData[4],
        //                 timeData: this.SixtimeData[4],
        //             },{
        //                 str: this.str,
        //                 chartData: this.SixchartData[5],
        //                 timeData: this.SixtimeData[5],
        //             },
        //         ];
        //         console.log(this.value2)
        //     }
        // }
    };
</script>

<style scoped lang="scss">
  .color-box {
    float: left;
    width: 33.333%;
    height: calc(50% - 25px);
    /*background: #efefef;*/
    line-height: 2rem;
    text-align: center;
    /*color: #fff;*/
    margin-top: 20px;
    transition: transform 0.3s;
  }
</style>
