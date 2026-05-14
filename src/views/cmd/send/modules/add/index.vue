<template>
  <div id="app-container">
    <el-dialog :visible.sync="open" :title="title" width="1200px" append-to-body id="dialog1">
      <el-button style="margin-left: 0; margin-bottom: 10px" type="primary" plain icon="el-icon-plus" size="mini"
        @click="handleAdd('add')"
                 v-hasPermi="['cmd:custom:add']">
        {{ $t('command.customCmd.addAndEdit.add') }}
      </el-button>
      <el-table v-loading="loading" :data="cmdList" stripe border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" style="width: 100%">
        <el-table-column prop="id" label="指令id" align="center" width="60px" v-if="false"></el-table-column>
        <el-table-column prop="fake_id" :label="$t('command.customCmd.table.order')" align="center" width="60px"></el-table-column>
        <el-table-column :label="$t('command.customCmd.table.cmdName')" align="center" width="220px">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ $t('command.customCmd.table.tip1') }}: {{ scope.row.description }}</p>
              <p>{{ $t('command.customCmd.table.tip2') }}: {{ scope.row.createTime }}</p>
              <p>{{ $t('command.customCmd.table.tip3') }}: {{ scope.row.createBy }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('command.customCmd.table.cmdType')" align="center" width="100px"></el-table-column>
        <el-table-column prop="operation" :label="$t('command.customCmd.table.operateCode')" align="center" width="100px"></el-table-column>
        <el-table-column :label="$t('command.customCmd.table.param')" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="start" wrap>
              <el-col v-for="i in scope.row.paramNum" :key="i" style="flex: 1; min-width: 100px; margin: 0 5px 5px 0;">
                <el-input v-model="scope.row.prams[i]" class="inputClass"></el-input>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column :label="$t('system.operate')" align="center" class-name="small-padding fixed-width" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="submitForm(scope.row)"
              v-hasPermi="['cmd:send']">{{ $t('command.send') }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['cmd:custom:delete']">{{ $t('system.delete') }}</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleSet(scope.row)"
              v-hasPermi="['cmd:custom:update']">{{ $t('system.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <org-add ref="orgAddModal"></org-add>
  </div>
</template>

<script>

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import orgAdd from "./modules/cmdAdd";
import eventBus from "../EventBus";
import { getCustomizeCmd, sendCmd, delCustomizeCmd, } from "@/api/command/command";

export default {
  name: "index",
  props: {
    deviceId: undefined,
    deviceCdId: undefined
  },
  components: { Treeselect, IconSelect, orgAdd },
  data() {
    return {
      // 指令类型：0-基础指令，1-自定义指令
      cmdType: "1",
      //查询参数
      queryParams: {
        orgName: undefined,
      },
      // 遮罩层
      loading: false,
      cmdList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      flag: false,
      title: "",
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getNewCmdList();
  },
  mounted() {
    //获取从ordAdd组件传过来的消息，重新刷新table
    eventBus.$on("refreshTable", (sensorMsg) => {
      this.getNewCmdList();
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm(row) {
      let cmd_list = [];
      let pram_str = "";
      let pram;
      // 新增判断：如果是16进制指令
      if (row.name === "16进制指令") {
        const hexString = row.prams[1] || ""; // 防止undefined
        const hexArray = hexString.split(" ");
        pram = hexArray
          .map(hex => {
            if (hex === "0D" || hex === "0A") return "";
            if (/^[0-9A-Fa-f]{2}$/.test(hex)) { // 校验是否为合法16进制字节
              return String.fromCharCode(parseInt(hex, 16));
            }
            return ""; // 非法字符过滤
          }).join("");
      } else {
        // 原有逻辑：拼接多个参数
        for (let i = 1; i < row.prams.length; i++) {
          //因为v-for遍历数字默认从1开始，所以读的时候也从1开始读
          pram_str = pram_str + row.prams[i] + ",";
        }
        pram =
          "$" +
          row.type +
          "," +
          this.deviceCdId +
          "," +
          row.operation +
          "," +
          pram_str +
          "*";
      }
      let cmd = {
        cmdId: row.id,
        content: pram,
        deviceId: this.deviceId,
        cmdType: this.cmdType // 自定义指令
      };
      cmd_list.push(cmd);
      this.$message("正在发送，请稍候");
      sendCmd(cmd_list).then((response) => {
        // eventBus.$emit("getCmdHistory"); //如果发送成功则刷新列表
        eventBus.$emit("getCmdHistoryByID", this.deviceId);
        this.$message({
          message: "成功发送指令！已发送" + cmd_list[0].content,
          type: "success",
        });
      });
    },
    /** 获取所有新指令 */
    getNewCmdList() {
      this.cmdList = []; //清空指令列表
      getCustomizeCmd().then((res) => {
        let i = 0;
        for (let item of res.data) {
          i++;
          item["prams"] = new Array(item.paramNum + 1);
          item["fake_id"] = i; //这个fake_id是给用户看的自增id，并不是指令id
          this.cmdList.push(item);
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 新增按钮操作 */
    handleAdd(type) {
      if (type === "add") {
        //如果是添加则进入这个分支
        this.reset();
        this.$refs.orgAddModal.open = true;
        this.$refs.orgAddModal.flag = true;
        this.$refs.orgAddModal.title = this.$t('command.customCmd.addAndEdit.addTitle');
      }
    },
    handleSet(row) {
      this.reset();
      const data = {
        cmdName: "",
        represent: "无",
        cmdtype: "",
        cmdcode: "",
        pramNum: 1,
      };
      data.cmdName = row.name;
      data.represent = row.description;
      data.cmdtype = row.type;
      data.cmdcode = row.operation;
      data.pramNum = row.paramNum;
      this.$refs.orgAddModal.open = true;
      this.$refs.orgAddModal.flag = true;
      this.$refs.orgAddModal.form = data;
      this.$refs.orgAddModal.cmdId = row.id;
      this.$refs.orgAddModal.title = this.$t('command.customCmd.addAndEdit.editTitle');
    },
    /** 表格重置 */
    reset() {
      this.form = {
        orgId: undefined,
        parentId: 0,
        orgName: undefined,
        orderNum: undefined,
      };
      this.$refs.orgAddModal.resetForm("form");
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除名为" + '"' + row.name + '"的指令项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
          return delCustomizeCmd(row.id);
        }).then(() => {
          this.getNewCmdList();
          this.msgSuccess("删除成功");
        });
    },
  },
  watch: {
    deviceId: function (val) {

    },
  },
};
</script>

<style scoped>
::v-deep .inputClass .el-input__inner {
  width: 100% !important;    /* 填满弹性父容器 */
  min-width: 100px;          /* 最小宽度 */
  max-width: 500px;          /* 最大宽度限制 */
  transition: width 0.3s;    /* 可选：动态宽度过渡效果 */
}

</style>
