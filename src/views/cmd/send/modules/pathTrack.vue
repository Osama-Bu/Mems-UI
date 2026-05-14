<template>
  <div id="main">
    <el-form ref="form" label-width="30px">
      <!--    <p class="text1">目标点</p>-->
      <el-form-item label="T1">
        <el-input
          v-model="path_point.t1.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
          <!--保留4位小数是就+5，以此类推-->
        </el-input>
        <el-input
          v-model="path_point.t1.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T2">
        <el-input
          v-model="path_point.t2.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t2.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T3">
        <el-input
          v-model="path_point.t3.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t3.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T4">
        <el-input
          v-model="path_point.t4.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t4.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T5">
        <el-input
          v-model="path_point.t5.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t5.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T6">
        <el-input
          v-model="path_point.t6.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t6.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T7">
        <el-input
          v-model="path_point.t7.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t7.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T8">
        <el-input
          v-model="path_point.t8.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t8.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T9">
        <el-input
          v-model="path_point.t9.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t9.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="T10">
        <el-input
          v-model="path_point.t10.lng"
          size="mini"
          :placeholder="$t('system.lng')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
        <el-input
          v-model="path_point.t10.lat"
          size="mini"
          class="input-right"
          :placeholder="$t('system.lat')"
          oninput="if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
        >
        </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import eventBus from "./EventBus";
export default {
  name: "pathTrack",
  props: {
    deviceId: undefined,
    deviceCdId: undefined,
  },
  data() {
    return {
      selectDeviceId: undefined,

      path_point: {
        t1: { lng: "", lat: "" }, //第一个元素为经度，第二个元素为纬度
        t2: { lng: "", lat: "" },
        t3: { lng: "", lat: "" },
        t4: { lng: "", lat: "" },
        t5: { lng: "", lat: "" },
        t6: { lng: "", lat: "" },
        t7: { lng: "", lat: "" },
        t8: { lng: "", lat: "" },
        t9: { lng: "", lat: "" },
        t10: { lng: "", lat: "" },
      },
      transfer_data: {
        t1: "路径点1",
        t2: "路径点2",
        t3: "路径点3",
        t4: "路径点4",
        t5: "路径点5",
        t6: "路径点6",
        t7: "路径点7",
        t8: "路径点8",
        t9: "路径点9",
        t10: "路径点10",
      }, //此数据用来把变量和指令确认命令里要显示的内容做映射
      path_str: "", //把数据处理成指令确认组件能直接识别的list
      count: 0,
    };
  },
  created() {
    this.selectDeviceId = this.deviceId;
  },
  methods: {
    pushPath() {
      // 通过事件总线发送消息
      for (let key in this.path_point) {
        //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
        if (this.path_point[key].lng !== "" && this.path_point[key].lat !== "") {
          //如果数据值不为空意味着要发送此命令
          this.count++;
          this.path_str =
            this.path_str +
            this.path_point[key].lng +
            "," +
            this.path_point[key].lat +
            ",";
          // var b=new Blob(parseFloat(this.path_point[key].lng));

          // this.path_point[key].lng=''//如果甲方要求路径点点击确认之后不存在，就把这一行和下一行取消注释
          // this.path_point[key].lat=''
        }
      }
      this.path_str =
        "$P," +
        this.deviceCdId +
        "," +
        this.count +
        "," +
        this.path_str +
        "*";
      let path_list = {
        ccontent: this.$t('otherConfig.commandConfig.mbd'),
        cname: "mbd",
        pram: this.path_str
      };
      if (this.count !== 0) {
        eventBus.$emit("pushPath", path_list);
      }
      this.path_str = "";
      this.count = 0;
    },
  },
  watch: {
    deviceId: function (val) {
      this.selectDeviceId = val;
    },
  },
};
</script>

<style scoped>
p.text1 {
  font-family: "Microsoft YaHei", Arial, sans-serif;
  margin-top: 0;
  font-size: 20px;
  color: #02ccfe;
}
.el-form-item {
  display: inline-block;
  margin-top: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-input {
  width: 42%;
}

.input-right {
  width: 42%;
  margin-left: 2%;
}
</style>
