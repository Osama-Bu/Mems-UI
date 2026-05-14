<template>
  <div class="app-container">
    <!--      添加或修改参数配置对话框-->
    <el-dialog :title="title" :visible.sync="open" :before-close="cancel" width="1200px" append-to-body>
      <el-steps :active="2" align-center style="margin-bottom: 20px; display: flex; justify-content: center"
        space="300px">
        <el-step title="选择协议项" description="已完成"></el-step>
        <el-step title="制定报警规则" description="进行中"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="250px">
        <el-row>
          <el-form-item :label="messageItemContent + '(异常值范围)'">
            <el-col :span="4">
              <el-input v-model="min" type="number">
                <template slot="prepend">最小值：</template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="max" type="number">
                <template slot="prepend">最大值：</template>
              </el-input>
            </el-col>
              <el-col :span="4">
                    <el-input v-model="trigger" type="number" >
                      <template slot="prepend">触发次数：</template>
                    </el-input>
                  </el-col>
            <el-col :span="12">
              <el-input v-model="scopeRuleDescription" type="textarea" placeholder="请填写规则描述" style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="messageItemContent + '(连续几组数据不变)'">
            <el-col :span="8">
              <el-input v-model="triggerNum" type="number">
                <template slot="prepend">重复次数：</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="triggerRuleDescription" type="textarea" placeholder="请填写规则描述" style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="messageItemContent + '(超出多少分钟无数据回传)'">
            <el-col :span="8">
              <el-input v-model="Timeout" type="number">
                <template slot="prepend">超时时间：</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="timeRuleDescription" type="textarea" placeholder="请填写规则描述" style="margin-left: 10px">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import {
   UpdateAlarmRule
} from "@/api/alarm/alarmrule";

export default {
  name: "GliderWithAlarmUpdateDetail",
  components: {
    Treeselect,
  },
  data() {
    return {
      rules: {},
      text: "123",
      // 范围规则
      min: null,
      max: null,
      scopeRuleDescription: "",
      // 连续几组数据
      triggerNum: null,
      triggerValue: 0,
      triggerRuleDescription: "",
      timeRuleDescription: "",
      trigger:null,
      Timeout: null,
      form: {},
      title: "",
      open: false,
      id:1,
      messageItemName: "", // 协议项字段
      messageItemContent: "" // 协议项中文名
    };
  },
  created() {
  },
  methods: {
    //提交新增或修改的表单信息
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const requestData1 = {
            gliderId: this.form.gliderId,
            msgId: this.form.msgId,
            id: this.id[0],
          };
          // 异常值范围规则
          if (this.min !== null && this.max !== null) {
              requestData1.description=this.scopeRuleDescription,
              requestData1.ruleContent= `(#${this.messageItemName})>${this.min} and (#${this.messageItemName})<${this.max}`,
              requestData1.triggerNum= 1
            ; }
            else if (this.min !== null) {
            // 只有最小值的情况

              requestData1.description= this.scopeRuleDescription;
              requestData1.ruleContent= `(#${this.messageItemName})>${this.min}`;
              requestData1.triggerNum= 1;
          } else if (this.max !== null) {
            // 只有最大值的情况

              requestData1.description= this.scopeRuleDescription;
              requestData1.ruleContent= `(#${this.messageItemName})<${this.max}`;
              requestData1.triggerNum= 1
          ;
          }
          // 连续几组不变规则
          if (this.triggerNum !== null) {
              requestData1.description= this.triggerRuleDescription;
              requestData1.ruleContent= `(#${this.messageItemName})==(#last_${this.messageItemName})`;
              requestData1.triggerNum= this.triggerNum
           ;
          }
          // 超时规则
          if (this.Timeout !== null) {

              requestData1.description= this.timeRuleDescription;
              requestData1.ruleContent= `(Time${this.Timeout}Time)`;
              requestData1.triggerNum=1
            ;
          }
          //处理时间格式
          const timestamp = this.form.startTime;
          const date = new Date(timestamp);
          const isoString = date.toISOString();
          this.form.startTime = isoString;

          const formattedDateTimeString = date.toISOString().replace("T", " ").slice(0, -5);
          this.form.startTime = formattedDateTimeString;
          requestData1.startTime = this.form.startTime;
          const timestamp1 = this.form.endTime;
          const date1 = new Date(timestamp1);
          const isoString1 = date1.toISOString().replace("T", " ").slice(0, -5);
          this.form.endTime = isoString1;
          requestData1.endTime = this.form.endTime;
          // 添加规则到数组
          UpdateAlarmRule(requestData1).then(response => {
            this.msgSuccess('修改成功')
            this.open = false
            this.$emit('ok', '')
          })
        }
      })
    },
    //关闭新增或修改页面
    cancel() {
      this.open = false;
    },
  },
};
</script>
<style scoped>
.inputClass {
  text-align: center;
}

.input-num-class>>>.el-input-number__increase,
.input-num-class>>>.el-input-number__decrease {
  width: 18px;
}

.input-num-class>>>.el-input__inner {
  padding-left: 0px;
  padding-right: 18px;
}

.messge-info>>>.el-input__inner {
  padding: 0 2px;
}
</style>


