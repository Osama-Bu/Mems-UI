
<template>
  <div id="mains" style="background-color: #0047AB; padding: 10px;">
     <div ref="chartContainer" style="width: 1400px; height: 700px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';

export default {
  name:'lofar',
  data() {
    return {
      loading:false,
    };

  },
  props: ['lofarData'],
  mounted() {
    if(this.lofarData.length>0){
      this.initLofar()
    }
  },

  methods: {
      initLofar(){
        var chartDom = this.$refs.chartContainer;
        var myChart = echarts.init(chartDom);


        var option;
        // See https://github.com/ecomfe/echarts-stat
        echarts.registerTransform(ecStat.transform.clustering);
        const data = this.lofarData;
        const timeData = data.map(item => item[0]);
        var CLUSTER_COUNT = 15;
        var DIENSIION_CLUSTER_INDEX = 3;
        var COLOR_ALL = [
          '#37A2DA',
          '#5197D3',
          '#6B8BCB',
          '#8589C3',
          '#9F8BBB',
          '#B98DB3',
          '#D38FAB',
          '#E891A3',
          '#F29499',
          '#FD9A8F',
          '#FD9E85',
          '#FCA27B',
          '#FFA671',
          '#FFA967',
          '#E06343',
        ];
        var pieces = [];
        for (var i = 0; i < CLUSTER_COUNT; i++) {
          pieces.push({
            min:i*10,
            max:(i+1)*10,
            color: COLOR_ALL[i]
          });
        }
        option = {
            dataZoom: [
            {
              type: 'inside', // 启用鼠标滚轮缩放
              xAxisIndex: 0, // 控制x轴的索引，如果只有一个x轴，可以省略
              // yAxisIndex: 0  // 控制y轴的索引，如果只有一个y轴，可以省略
            }
          ],
          dataset: [
            {
              source: data
            },
            {
              transform: {
                type: 'ecStat:clustering',
                // print: true,
                config: {
                  clusterCount: CLUSTER_COUNT,
                  outputType: 'single',
                  outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
                }
              }
            }
          ],
          tooltip: {
            position: 'top',
          },
          visualMap: {
            type: 'piecewise',
            top: 'middle',
            min: 0,
            max: CLUSTER_COUNT,
            left: 10,
            splitNumber: CLUSTER_COUNT,
            dimension: 2,
            pieces: pieces
          },
          grid: {
            left: 160
          },
          xAxis: {
            name:'时间',
            type:'time',
            data: timeData,
            axisLine: {
                show: true, // 确保坐标线显示
                lineStyle: {
                color: "#ffffff", // X轴颜色
              },
            },
            axisLabel: {
              show: true, // 显示刻度标签
               formatter: function(value) {
                // 格式化日期
                return echarts.time.format(value,'{MM}-{dd} {HH}:{mm}:{ss}');
              }
            },
          },
          yAxis: {
            name:'频率(hz)',
            axisLine: {
                show: true, // 确保坐标线显示
                lineStyle: {
                color: "#ffffff", // Y轴颜色
                },
            },
          },
          series: {
            type: 'scatter',
            encode: { tooltip: [0,1,2] },

            symbolSize: 8,
            itemStyle: {
              borderColor: '#555'
            },
            datasetIndex: 1,
          }
        };
        myChart.clear()
        myChart.setOption(option);
      }
  }
}
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
</style>
