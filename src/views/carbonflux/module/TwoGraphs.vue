<template>
  <div style="overflow: hidden; height: 100%">
    <div v-for="(color, index) in value2" class="color-box" :key="index">
      <OneGraph
        :str="color.str"
        :chartData="color.chartData"
        :timeData="color.timeData"
        :text="color.text"
        :unit="color.unit"
        :title="color.title"
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
  name: "TwoGraphs",
  components: {
    OneGraph,
    Navbar,
  },
  data() {
    return {
      value2: [],
    };
  },
  props: {
    Twotitle: {
      type: Array,
      required: true,
    },
    str: {
      type: String,
      default: "",
    },
    chartData: {},
    timeData: {},
    QCchartData: {},
    QCtimeData: {},
    unit: undefined,
    text: undefined,
    QCtext: undefined,
    // Twotitle: [],
  },
  mounted() {
    this.value2 = [
      {
        str: this.str,
        chartData: this.chartData,
        timeData: this.timeData,
        text: this.text,
        unit: this.unit,
        title: this.Twotitle[0],
      },
      {
        str: "质控" + this.str,
        chartData: this.QCchartData,
        timeData: this.QCtimeData,
        text: this.QCtext,
        unit: this.unit,
        title: this.Twotitle[1],
      },
    ];
  },
};
</script>

<style scoped lang="scss">
.color-box {
  float: left;
  /*position: center;*/
  width: calc(47% - 25px);
  height: 100%;
  /*background: #efefef;*/
  line-height: 2rem;
  text-align: center;
  /*color: #fff;*/
  /*margin-top: 20px;*/
  margin: 25px;
  transition: transform 0.3s;
}
</style>
