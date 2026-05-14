<template>
    <div id="main">
      <el-form ref="form" label-width="100px">

        <el-form-item label="信标机回传间隔" label-width="130px" class="item" >
            <el-input v-model="beacon_set.beaconTime" size="mini" style="width: 49%;" >
              <template slot="suffix">分钟</template>
            </el-input>
        </el-form-item>

      </el-form>
    </div>
  </template>

  <script>
  import eventBus from "../../modules/EventBus";
  export default {
    name: "cmdBeacon",
    props: {
      deviceId: undefined,
      deviceCdId: undefined,
    },
    data() {
      return {
        beacon_set: {
          beaconTime:"",// 信标机回传间隔
        },
        transfer_data: {
          beaconTime:'xbjhcsj',
        },
        transfer_content: {
          beaconTime:'信标机回传时间',
        },
        beacon_list: [],
      };
    },
    mounted(){
        //获取信标机回传间隔的el-form-item标签，自定义label颜色
        this.updateDynamicStyle();
      },
    methods: {
      updateDynamicStyle() {
        // 选择目标元素
        const label = document.querySelector('.item .el-form-item__label');
        if (label) {
          // 动态设置样式   设置 信标机回传间隔 标题颜色
          label.style.color = '#06f1ef'; // 设置为蓝色
        }
      },
      pushBeacon() {
        // 通过事件总线发送消息
        let command_str = "";

        for (let key in this.beacon_set) {
          //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
          if (this.beacon_set[key] !== "" && key !== "angle_pram") {
            //如果数据值不为空意味着要发送此命令
            command_str=
            "$,"+
            "T"+
            ","+
            this.beacon_set[key]+
            ",*";
            this.beacon_list.push({
              ccontent: this.transfer_content[key],
              cname: this.transfer_data[key],
              pram: command_str,
            });
            this.beacon_set[key] = "";
          }
        }
        eventBus.$emit("pushBeacon", this.beacon_list);
        this.beacon_list = [];
      },
    },
    watch: {
      deviceId: function (val) {
        this.deviceId = val;
      },
    },
  };
  </script>

  <style scoped>

    .el-form-item {
      display: inline-block;
      width: 87%;
      margin-top: 0;
      margin-bottom:  0;
    }
  </style>
