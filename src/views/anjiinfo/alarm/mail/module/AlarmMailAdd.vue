<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('alarmAccount.addAndEdit.contactWay')" prop="status">
              <el-select v-model="form.status">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.status === 0"
              :label="$t('alarmAccount.addAndEdit.alarmMail')"
              prop="mailAddress"
            >
              <el-input
                v-model="form.mailAddress"
                :placeholder="$t('alarmAccount.addAndEdit.tip1')"
              />
            </el-form-item>
            <el-form-item
              v-else-if="form.status === 2"
              :label="$t('alarmAccount.addAndEdit.alarmPhone')"
              prop="phone"
            >
              <el-input
                v-model.trim="form.phone"
                :placeholder="$t('alarmAccount.addAndEdit.tip2')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('system.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('system.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AddAlarmEmail } from "@/api/alarm/alarmemail";

export default {
  name: "AlarmMailAdd",
  data() {
    return {
      rules: {
        mailAddress: [
          {
            required: true,
            message: this.$t('alarmAccount.addAndEdit.rule1'),
            trigger: "blur",
          },
          {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: this.$t('alarmAccount.addAndEdit.rule2'),
          },
        ],
        phone: [
          {
            required: true,
            message: this.$t('alarmAccount.addAndEdit.rule3'),
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: this.$t('alarmAccount.addAndEdit.rule4'),
          },
        ]
      },
      form: {
        status: 0,
      },
      title: "",
      open: false,
      options: [
        {
          value: 0,
          label: this.$t('alarmAccount.addAndEdit.mail'),
        },
        {
          value: 2,
          label: this.$t('alarmAccount.addAndEdit.phone'),
        },
      ],
    };
  },
  methods: {
    //提交新增表单信息
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.status === 2) {
            this.form.mailAddress = this.form.phone;
          }
          // this.form.status = this.form.status.toString()
          AddAlarmEmail(this.form).then((response) => {
            this.msgSuccess("新增成功");
            this.open = false;
            this.$emit("ok", "");
          });
        }
      });
    },
    //关闭新增或修改页面
    cancel() {
      this.open = false;
    },
  },
};
</script>

<style scoped>
</style>
