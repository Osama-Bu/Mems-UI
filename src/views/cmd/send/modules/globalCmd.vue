<template>
  <div id="app-container">
    <el-dialog :visible.sync="open" :title="title" width="1100px" append-to-body id="dialog1">
      <el-table
        v-loading="loading"
        :data="cmdList"
        stripe
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%"
      >
        <el-table-column prop="id" label="指令id" align=center width="60px" v-if="false"></el-table-column>
        <el-table-column :label="$t('command.taskManage.globalCmd.cmdName')" align=center width="180px" >
          <template slot-scope="scope" >
            <el-popover trigger="hover" placement="top">
              <p>{{ $t('command.customCmd.table.tip1') }}: {{ scope.row.description }}</p>
              <p>{{ $t('command.customCmd.table.tip2') }}: {{ scope.row.time }}</p>
              <p>{{ $t('command.customCmd.table.tip3') }}: {{ scope.row.userName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('command.taskManage.globalCmd.cmdType')" align=center width="120px" ></el-table-column>
        <el-table-column :label="$t('command.taskManage.globalCmd.param')" align=center >
          <template slot-scope="scope" >
            <el-row :gutter="5" type="flex" justify="center" align="middle" >
              <el-col v-for="i in scope.row.paramNum" :key = "i" :span="5">
                　　<el-input v-model="scope.row.prams[i]" class="inputClass"></el-input>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column :label="$t('system.operate')" align=center class-name="small-padding fixed-width" width="150px">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       icon="el-icon-edit"
                       @click="submitForm(scope.row)"
                       v-hasPermi="['cmd:send']"
            >{{ $t('command.send') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

import { sendCmd, delCustomizeCmd } from '@/api/command/command'
import eventBus from './EventBus'
export default {
  name: 'globalCmd',
  props:{
    deviceId: undefined,
    deviceCdId: undefined
  },
  components:{},
  data () {
    return {
      // 指令类型：0-基础指令，1-自定义指令
      cmdType: "0",
      //查询参数
      queryParams:{
        orgName: undefined
      },
      // 遮罩层
      loading: false,
      // 组织表格树数据
      cmdList: [
        {
          description: "0~65535",
          id: 1,
          name:"信标机回传间隔",
          operation: "",
          paramNum: 1,
          time: "2023-04-12 15:09:07",
          type: "T",
          cmdId: 35,
          userId: 1,
          prams:[],
          userName:'system'
        }
      ],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      flag:false,
      title: '',
      // 表单参数
      form: {},
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    /** 提交按钮 */
    submitForm(row) {
      let cmd_list=[]
      let pram_str=''
      for (let i = 1; i < row.prams.length; i++) {
        pram_str=pram_str+row.prams[i]+','
      }
      let pram='$'+','+row.type+','+pram_str+'*'
      let cmd={
        cmdId: row.cmdId,
        content:pram,
        deviceId:this.deviceId,
        cmdType: this.cmdType, // 基础指令
      }
      cmd_list.push(cmd)
      this.$message('正在发送，请稍候');
      sendCmd(cmd_list).then(res => {
        if(res.code === 200){
          eventBus.$emit("getCmdHistoryByID", this.deviceId);
          //如果发送成功则刷新列表
          this.$message({
            message: '已发送'+cmd_list[0].content,
            type: 'success'
          });
          this.open = false
        }
      })

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    }
  },
  watch : {
    deviceId:function(val){

    },
  },
}
</script>

<style scoped>
.inputClass {
  text-align: center;
}
</style>
