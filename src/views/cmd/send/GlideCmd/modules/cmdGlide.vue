<template>
    <div id="main">
      <el-form ref="form" label-width="100px">
        <el-form-item label="PID">
          <el-input
            v-model="cmd_glide.p"
            style="width: 32%"
            placeholder="P:整数"
            size="mini"
          ></el-input>
          <el-input
            v-model="cmd_glide.i"
            style="width: 32%; margin-left: 2%"
            placeholder="I:整数"
            size="mini"
          ></el-input>
          <el-input
            v-model="cmd_glide.d"
            style="width: 32%; margin-left: 2%"
            placeholder="D:整数"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item label="锚定半径" placeholder="单位:米">
          <el-input
            v-model="cmd_glide.angle_range"
            size="mini"
            placeholder="0~200"
            ><template slot="suffix">米</template></el-input
          >
        </el-form-item>
        <el-form-item label="锚泊正反转及距离" label-width="130px">
          <el-input v-model="cmd_glide.angle_fd" size="mini" style="width: 49%"
            ><template slot="suffix">米</template></el-input
          >
          <el-select
            v-model="cmd_glide.angle_pram"
            size="mini"
            placeholder="方向"
            style="width: 49%; margin-left: 2%"
          >
            <el-option label="顺时针" value="1"></el-option>
            <el-option label="逆时针" value="0"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>
  </template>

  <script>
  import eventBus from "../../modules/EventBus";
  export default {
    name: "cmdGlide",
    props: {
      deviceId: undefined,
      deviceCdId: undefined,
    },
    data() {
      return {

        cmd_glide: {
          p: "",
          i: "",
          d: "",
          angle_fd: "", //forward distance
          angle_range: "",
          angle_pram: "顺时针",
          pid_transfer: "",
        },
        transfer_data: {
          p: "ddP",
          i: "ddI",
          d: "ddD",
          angle_fd: "mdcsh",
          angle_range: "mdbj",
          angle_pram: "锚定参数",
          pid_transfer: "PID控制转换",
        }, //此数据用来把变量和指令确认命令里要显示的内容做映射
        transfer_content: {
          p: "尾舵控制参数P",
          i: "尾舵控制参数I",
          d: "尾舵控制参数D",
          angle_fd: "锚定前向距离及参数",
          angle_range: "锚定半径",
          angle_pram: "锚定参数",
          pid_transfer: "PID控制转换",
        }, //此数据用来把变量和指令确认命令里要显示的内容做映射
        glide_list: [], //把数据处理成指令确认组件能直接识别的list
      };
    },
    created() {

    },

    methods: {
      pushGlider() {
        // 通过事件总线发送消息
        let command_str = "";
        for (let key in this.cmd_glide) {
          //for循环let key是对象里面的键，再通过,[]的形式this.objNum[item]去获取对象的value值
          if (this.cmd_glide[key] !== "" && key !== "angle_pram") {
            //如果数据值不为空意味着要发送此命令
            switch (key) {
              case "p":
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  4 +
                  "," +
                  this.cmd_glide[key] +
                  ",*";
                break;
              case "i":
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  "A" +
                  "," +
                  this.cmd_glide[key] +
                  ",*";
                break;
              case "d":
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  6 +
                  "," +
                  this.cmd_glide[key] +
                  ",*";
                break;
              case "angle_range":
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  "D" +
                  "," +
                  this.cmd_glide[key] +
                  ",*";
                break;
              case "angle_fd":
                if (
                  this.cmd_glide.angle_pram === 1 ||
                  this.cmd_glide.angle_pram === "顺时针" ||
                  this.cmd_glide.angle_pram === ""
                ) {
                  command_str =
                    "$Q," +
                    this.deviceCdId +
                    "," +
                    "E" +
                    "," +
                    1 +
                    "," +
                    this.cmd_glide[key] +
                    ",*";
                } else if (this.cmd_glide.angle_pram === 0) {
                  command_str =
                    "$Q," +
                    this.deviceCdId +
                    "," +
                    "E" +
                    "," +
                    0 +
                    "," +
                    this.cmd_glide[key] +
                    ",*";
                }
                break;
              case "pid_transfer":
                command_str =
                  "$Q," +
                  this.deviceCdId +
                  "," +
                  "B" +
                  "," +
                  this.cmd_glide[key] +
                  ",*";
            }
            this.glide_list.push({
              ccontent: this.transfer_content[key],
              cname: this.transfer_data[key],
              pram: command_str,
            });
            this.cmd_glide[key] = "";
          }
        }
        eventBus.$emit("pushGlider", this.glide_list);
        this.glide_list = [];
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
