<template>
    <div>
      <el-image
        style="width: 80%; height: 80%; margin:0 auto; display: block;"
        :src="require('@/assets/carbonflux/计算原理2-2.jpg')"></el-image>
    </div>
</template>

<script>
    export default {
        name: "DPMprinciple",
        data() {
            return {
                fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            }
        }
    }
</script>

<style scoped>

</style>
