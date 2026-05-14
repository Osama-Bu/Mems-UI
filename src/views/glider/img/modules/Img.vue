
<template>
  <div id="mains">
<!--    <dv-loading v-show="loading"></dv-loading>-->
<!--    <div style="color: white">-->
      <span style="color: white">图像</span>
<!--    </div>-->
  </div>
</template>

<script>
    export default {
        data() {
            return {
                loading:false,
                chartData: [],
                timeData: [],
                averageVal1:0,
                averageVal2:0,
                abnormalProbability:0,
            };
        },
    };
</script>

<style scoped lang="scss">
  #mains {
    width: 100%;
    height: 100%;
  }
</style>

