<template>
    <div>
      <el-image
        style="width: 85%; height: 80%; margin:0 auto; display: block;"
        :src="require('@/assets/carbonflux/计算原理1-1.jpg')"></el-image>
    </div>
</template>

<script>
    export default {
        name: "VCMprinciple",
        data() {
            return {
                fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            }
        }
    }
</script>

<style scoped>

</style>
